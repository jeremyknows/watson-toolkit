/**
 * decide-pool.js
 * Reads and normalizes items from configured sources.
 *
 * v2: accepts injected config (portable, testable).
 * v1 compat: pool() calls loadConfig() then buildPool() — no behavior change for Watson.
 *
 * Sources:
 *   jsonfile — reads a JSON file with carry-forwards or threads schema
 *   http     — fetches from an HTTP endpoint (task manager, custom API, etc.)
 *
 * Degrades gracefully when graceful:true sources are unreachable.
 * Throws when graceful:false sources fail (mandatory sources).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const os = require('os');

const { loadConfig } = require('./decide-config');

/**
 * @typedef {Object} DecideItem
 * @property {string} id
 * @property {string} source
 * @property {string} priority
 * @property {number} age_days
 * @property {string} title
 * @property {string} context
 * @property {string|null} thread_id
 * @property {string|null} source_ref
 * @property {string|null} snoozed_until
 * @property {string} _sourceName - internal: which config source this came from
 */

/**
 * @typedef {Object} PoolResult
 * @property {DecideItem[]} items
 * @property {string[]} sourcesUnavailable - names of graceful sources that failed
 */

function ageInDays(dateStr) {
  if (!dateStr) return 0;
  const created = new Date(dateStr);
  if (isNaN(created)) return 0;
  return Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── jsonfile source readers ──────────────────────────────────────────────────

function normalizeCarryForward(item, sourceName) {
  // Skip snoozed items that haven't returned yet
  if (item.snoozed_until) {
    const snoozeDate = new Date(item.snoozed_until);
    if (!isNaN(snoozeDate) && snoozeDate > new Date()) return null;
  }
  return {
    id: `cf:${item.id}`,
    source: 'carry-forward',
    priority: item.priority || 'unset',
    age_days: ageInDays(item.created || item.deadline),
    title: item.title || item.detail || '(untitled)',
    context: item.detail || item.notes || `Carry-forward item in category: ${item.category || 'general'}`,
    thread_id: null,
    source_ref: item.id,
    snoozed_until: item.snoozed_until || null,
    _sourceName: sourceName,
  };
}

function normalizeThread(t, sourceName) {
  const age = ageInDays(t.created || t.last_activity);
  return {
    id: `thread:${t.id}`,
    source: 'thread',
    priority: 'P1',
    age_days: age,
    title: t.name || t.description || `Thread ${t.id}`,
    context: t.description || `Thread blocked on a pending decision. Project: ${t.project || 'unknown'}.`,
    thread_id: t.id,
    source_ref: t.id,
    snoozed_until: null,
    _sourceName: sourceName,
  };
}

function readJsonfileSource(source) {
  const raw = fs.readFileSync(source.path, 'utf8');
  const data = JSON.parse(raw);
  const filter = source.filter || {};

  if (source.itemType === 'carry-forward') {
    const items = Array.isArray(data) ? data : (data.items || []);
    return items
      .filter(item => {
        if (filter.owner) {
          const owner = (item.owner || '').toLowerCase();
          const filterOwner = filter.owner.toLowerCase();
          if (owner !== filterOwner && owner !== filterOwner + 'knows') return false;
        }
        if (filter.status) {
          const status = (item.status || '').toLowerCase();
          if (status !== filter.status.toLowerCase()) return false;
        }
        return true;
      })
      .map(item => normalizeCarryForward(item, source.name))
      .filter(Boolean);
  }

  if (source.itemType === 'thread') {
    const threads = Array.isArray(data) ? data : (data.threads || []);
    return threads
      .filter(t => {
        if (filter.status) {
          if ((t.status || '') !== filter.status) return false;
        }
        return true;
      })
      .map(t => normalizeThread(t, source.name));
  }

  // Unknown itemType — return raw items with minimal normalization
  const items = Array.isArray(data) ? data : (data.items || []);
  return items.map(item => ({
    id: `${source.name}:${item.id || Math.random()}`,
    source: source.name,
    priority: item.priority || 'P2',
    age_days: ageInDays(item.created || item.created_at),
    title: item.title || item.name || '(untitled)',
    context: item.description || item.detail || '',
    thread_id: item.thread_id || null,
    source_ref: item.id || null,
    snoozed_until: null,
    _sourceName: source.name,
  }));
}

// ─── http source reader ───────────────────────────────────────────────────────

/**
 * Fetch items from an HTTP source.
 *
 * Always resolves (never rejects) — error handling is done via the graceful flag
 * in buildPool(). Non-graceful source failure is surfaced as a thrown Error from
 * readHttpSource so buildPool can re-throw it.
 *
 * @param {object} source
 * @returns {Promise<DecideItem[]>}
 */
function readHttpSource(source) {
  return new Promise((resolve, reject) => {
    const timeoutMs = source.timeoutMs || 2000; // 2s default (tighter than v1's 3s for MCP headroom)
    const params = source.params || {};
    const qs = new URLSearchParams(params).toString();
    const urlStr = qs ? `${source.url}?${qs}` : source.url;

    const urlObj = new URL(urlStr);
    const lib = urlObj.protocol === 'https:' ? https : http;

    const fail = (reason) => {
      const err = new Error(`[decide-pool] Source "${source.name}" ${reason}`);
      if (source.graceful !== false) {
        console.warn(err.message + ' — degrading gracefully');
        resolve([]);
      } else {
        reject(err);
      }
    };

    const req = lib.get(urlStr, { timeout: timeoutMs }, res => {
      if (res.statusCode !== 200) {
        // Consume body to free socket
        res.resume();
        return fail(`returned HTTP ${res.statusCode}`);
      }
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const tasks = JSON.parse(body);
          const items = Array.isArray(tasks) ? tasks : (tasks.tasks || tasks.items || []);
          resolve(items.map(task => ({
            id: `${source.name}:${task.id}`,
            source: source.name,
            priority: task.priority || 'P2',
            age_days: ageInDays(task.created_at || task.createdAt),
            title: task.title || task.name || '(untitled task)',
            context: task.description || task.context || `Task from ${source.name}`,
            thread_id: task.thread_id || task.threadId || null,
            source_ref: task.id,
            snoozed_until: null,
            _sourceName: source.name,
          })));
        } catch (e) {
          fail(`parse error: ${e.message}`);
        }
      });
    });
    req.on('error', (e) => fail(`unreachable: ${e.message}`));
    req.on('timeout', () => { req.destroy(); fail('timeout'); });
  });
}

// ─── Core: read a single source ───────────────────────────────────────────────

async function readSource(source) {
  if (source.type === 'jsonfile') {
    return readJsonfileSource(source);
  }
  if (source.type === 'http') {
    return readHttpSource(source);
  }
  throw new Error(`Unknown source type: ${source.type}`);
}

// ─── buildPool: accepts injected config (testable, portable) ─────────────────

/**
 * Pool items from all sources defined in config.
 *
 * @param {object} config - Result of loadConfig()
 * @returns {Promise<PoolResult>} { items, sourcesUnavailable }
 */
async function buildPool(config) {
  const items = [];
  const sourcesUnavailable = [];

  for (const source of config.sources) {
    try {
      const sourceItems = await readSource(source);
      items.push(...sourceItems);
    } catch (err) {
      if (source.graceful !== false) {
        console.error(`[decide-pool] Source "${source.name}" failed — skipping:`, err.message);
        sourcesUnavailable.push(source.name);
      } else {
        // Mandatory source failed — surface the error
        throw new Error(`Mandatory source "${source.name}" failed: ${err.message}`);
      }
    }
  }

  const bySource = config.sources.reduce((acc, s) => {
    acc[s.name] = items.filter(i => i._sourceName === s.name).length;
    return acc;
  }, {});
  const summary = Object.entries(bySource).map(([k, v]) => `${k}:${v}`).join(' ');

  console.error(`[decide-pool] Pooled ${items.length} items (${summary})`);

  if (sourcesUnavailable.length > 0) {
    console.warn(`[decide-pool] Sources unavailable: ${sourcesUnavailable.join(', ')}`);
  }

  return { items, sourcesUnavailable };
}

// ─── pool: v1-compatible wrapper ─────────────────────────────────────────────

/**
 * Pool all items. Loads config automatically.
 * Watson v1 compat: returns the items array directly (with sourcesUnavailable available
 * on the result object for callers that need it).
 *
 * @returns {Promise<DecideItem[]>} Flat array of ranked-ready items
 */
async function pool() {
  const config = loadConfig();
  const { items, sourcesUnavailable } = await buildPool(config);
  if (sourcesUnavailable.length > 0) {
    console.warn(`[decide-pool] pool() — unavailable: ${sourcesUnavailable.join(', ')}`);
  }
  return items;
}

module.exports = { pool, buildPool };

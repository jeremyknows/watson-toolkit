/**
 * decide-handler.js
 * Main /decide command handler.
 *
 * Called by Watson when Jeremy types /decide.
 * Also handles button callbacks: decide:yes:*, decide:dismiss:*, decide:later:*
 *
 * Usage (from agent prompt):
 *   node decide-handler.js invoke [--channel CHANNEL_ID] [--session SESSION_ID]
 *   node decide-handler.js button <payload> [--channel CHANNEL_ID] [--session SESSION_ID]
 *   node decide-handler.js later-date <item_id> <date_str> [--channel CHANNEL_ID]
 *   node decide-handler.js later-blocker <item_id> <blocker> <date> [--channel CHANNEL_ID]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const { pool } = require('./decide-pool');
const { writeCarryForwards } = require('./cf-writer');
const { rank } = require('./decide-rank');
const { buildCard, buildEmptyCard } = require('./decide-card');
const { parseReturnDate, applySnooze } = require('./decide-later-flow');

// Data dir resolution — same priority order as decide-config.js:
//   DECIDE_WORKSPACE > OPENCLAW_WORKSPACE_DIR > ~/.decide
const DATA_DIR = (() => {
  const base = process.env.DECIDE_WORKSPACE ||
    process.env.OPENCLAW_WORKSPACE_DIR ||
    path.join(os.homedir(), '.decide');
  const dir = path.join(base, 'data');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
})();
const AUDIT_LOG_PATH = path.join(DATA_DIR, 'audit-readiness-scan.jsonl');
const PENDING_LATER_PATH = path.join(DATA_DIR, 'decide-pending-later.json');

// ─── Audit log ───────────────────────────────────────────────────────────────

function appendAudit(entry) {
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');
  } catch (e) {
    console.error('[decide] Audit log write failed:', e.message);
  }
}

// ─── WatsonFlow helpers ───────────────────────────────────────────────────────

async function patchWatsonFlowTask(taskId, update) {
  return new Promise(resolve => {
    const http = require('http');
    const body = JSON.stringify(update);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tasks/${taskId}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 3000,
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode }));
    });
    req.on('error', () => {
      console.warn('[decide] WatsonFlow PATCH failed (unreachable) — continuing');
      resolve({ ok: false });
    });
    req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
    req.write(body);
    req.end();
  });
}

// ─── Carry-forward state changes ─────────────────────────────────────────────

async function setCarryForwardStatus(sourceRef, status) {
  try {
    await writeCarryForwards(({ data, items }) => {
      const updated = items.map(item =>
        item.id === sourceRef ? { ...item, status } : item
      );
      return Array.isArray(data) ? updated : { ...data, items: updated };
    });
  } catch (e) {
    console.error('[decide] CF status update failed:', e.message);
  }
}

// ─── Yes action ──────────────────────────────────────────────────────────────

async function handleYes(item, channelId, sessionId) {
  console.log(`[decide] Yes → ${item.id}`);

  // WatsonFlow: mark active
  if (item.source === 'watsonflow' && item.source_ref) {
    await patchWatsonFlowTask(item.source_ref, { status: 'in_progress' });
  }

  appendAudit({
    ts: new Date().toISOString(),
    item_id: item.id,
    source: item.source,
    priority: item.priority,
    age_days: item.age_days,
    action: 'yes',
    session_id: sessionId || null,
  });

  // Response card
  const threadLine = item.thread_id ? ` in <#${item.thread_id}>` : '';
  return {
    text: `✅ **Moving on "${item.title.slice(0, 80)}"** — Watson will follow up${threadLine} with next steps.`,
    item,
  };
}

// ─── Dismiss action ───────────────────────────────────────────────────────────

async function handleDismiss(item, channelId, sessionId) {
  console.log(`[decide] Dismiss → ${item.id}`);

  if (item.source === 'carry-forward' && item.source_ref) {
    await setCarryForwardStatus(item.source_ref, 'dismissed');
  }
  if (item.source === 'watsonflow' && item.source_ref) {
    await patchWatsonFlowTask(item.source_ref, { status: 'cancelled' });
  }

  appendAudit({
    ts: new Date().toISOString(),
    item_id: item.id,
    source: item.source,
    priority: item.priority,
    age_days: item.age_days,
    action: 'dismiss',
    session_id: sessionId || null,
  });

  return {
    text: `🗑️ **Dismissed** — "${item.title.slice(0, 80)}" archived. Won't resurface.`,
    item,
  };
}

// ─── Later action (step 1: prompt for date) ───────────────────────────────────

function handleLaterStart(item, channelId) {
  // Persist pending later state so step 2 can look it up
  const pending = loadPendingLater();
  pending[item.id] = { item, step: 'awaiting_date', ts: Date.now() };
  savePendingLater(pending);

  return {
    text: `⏭️ **Later** — When should "${item.title.slice(0, 60)}" resurface?\n\nReply with a date: *tomorrow*, *friday*, *2026-04-15*, etc.`,
    awaitingLaterDate: true,
    itemId: item.id,
  };
}

// ─── Later action (step 2: receive date, prompt for blocker) ─────────────────

function handleLaterDate(itemId, dateStr) {
  const returnDate = parseReturnDate(dateStr);
  if (!returnDate) {
    return {
      ok: false,
      text: `That date didn't parse. Try: *tomorrow*, *friday*, *next week*, *2026-04-15*, *in 3 days*`,
    };
  }

  const pending = loadPendingLater();
  const state = pending[itemId];
  if (!state) {
    return { ok: false, text: 'Session expired. Run /decide again.' };
  }

  pending[itemId] = { ...state, step: 'awaiting_blocker', returnDate: returnDate.toISOString() };
  savePendingLater(pending);

  const dateLabel = returnDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return {
    ok: true,
    text: `Got it — returning **${dateLabel}**. What's blocking this?\n\nReply with a short description of the blocker.`,
    awaitingLaterBlocker: true,
    itemId,
  };
}

// ─── Later action (step 3: receive blocker, apply snooze) ────────────────────

/**
 * Apply snooze from the later flow.
 * Async because applySnooze writes to carry-forwards.json via locked cf-writer.
 * @param {string} itemId
 * @param {string} blocker
 * @param {string} sessionId
 * @returns {Promise<{ok: boolean, text: string}>}
 */
async function handleLaterBlocker(itemId, blocker, sessionId) {
  const pending = loadPendingLater();
  const state = pending[itemId];
  if (!state) {
    return { ok: false, text: 'Session expired. Run /decide again.' };
  }

  const returnDate = new Date(state.returnDate);
  // Must await — applySnooze writes to carry-forwards.json via locked cf-writer
  const returnDateStr = await applySnooze(state.item, returnDate, blocker, sessionId);

  delete pending[itemId];
  savePendingLater(pending);

  const dateLabel = returnDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return {
    ok: true,
    text: `⏭️ **Snoozed until ${dateLabel}** — Blocker: *${blocker}*\n\nThis will resurface in /decide after that date.`,
  };
}

// ─── Pending later persistence ────────────────────────────────────────────────

function loadPendingLater() {
  try {
    return JSON.parse(fs.readFileSync(PENDING_LATER_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function savePendingLater(data) {
  // Prune stale entries (>1 hour)
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  const pruned = Object.fromEntries(
    Object.entries(data).filter(([, v]) => now - v.ts < oneHour)
  );
  fs.writeFileSync(PENDING_LATER_PATH, JSON.stringify(pruned, null, 2), 'utf8');
}

// ─── Main invoke ─────────────────────────────────────────────────────────────

/**
 * Run /decide: pool all sources, rank, return top card.
 * @param {string|null} channelId
 * @param {string|null} sessionId
 * @returns {Promise<object>} Discord card payload
 */
async function invoke(channelId, sessionId) {
  const items = await pool();
  const top = rank(items);

  appendAudit({
    ts: new Date().toISOString(),
    item_id: top ? top.id : null,
    source: top ? top.source : null,
    priority: top ? top.priority : null,
    age_days: top ? top.age_days : null,
    action: 'invoke',
    session_id: sessionId || null,
  });

  if (!top) return buildEmptyCard();
  return buildCard(top);
}

// ─── CLI entrypoint ───────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Parse --channel and --session flags
  let channelId = null, sessionId = null;
  const filteredArgs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--channel' && args[i + 1]) { channelId = args[++i]; }
    else if (args[i] === '--session' && args[i + 1]) { sessionId = args[++i]; }
    else filteredArgs.push(args[i]);
  }

  try {
    if (command === 'invoke') {
      const result = await invoke(channelId, sessionId);
      console.log(JSON.stringify(result));
    }
    else if (command === 'button') {
      // payload format: "decide:ACTION:ITEM_ID"
      const payload = filteredArgs[1] || '';
      const parts = payload.split(':');
      const action = parts[1];
      const itemId = parts.slice(2).join(':');

      if (action === 'yes' || action === 'dismiss') {
        // Need the item — re-pool to find it
        let items;
        try {
          items = await pool();
        } catch (e) {
          console.log(JSON.stringify({ text: `Failed to load items: ${e.message}` }));
          return;
        }
        const item = items.find(i => i.id === itemId);
        if (!item) {
          console.log(JSON.stringify({ text: 'Item not found — it may have already been acted on.' }));
          return;
        }
        const result = action === 'yes'
          ? await handleYes(item, channelId, sessionId)
          : await handleDismiss(item, channelId, sessionId);
        console.log(JSON.stringify({ text: result.text }));
      }
      else if (action === 'later') {
        // Fetch item and start later flow
        let items;
        try {
          items = await pool();
        } catch (e) {
          console.log(JSON.stringify({ text: `Failed to load items: ${e.message}` }));
          return;
        }
        const item = items.find(i => i.id === itemId);
        if (!item) {
          console.log(JSON.stringify({ text: 'Item not found.' }));
          return;
        }
        const result = handleLaterStart(item, channelId);
        console.log(JSON.stringify(result));
      }
      else {
        console.log(JSON.stringify({ text: `Unknown button action: ${action}` }));
      }
    }
    else if (command === 'later-date') {
      const itemId = filteredArgs[1];
      const dateStr = filteredArgs.slice(2).join(' ');
      const result = handleLaterDate(itemId, dateStr);
      console.log(JSON.stringify(result));
    }
    else if (command === 'later-blocker') {
      const itemId = filteredArgs[1];
      const returnDate = filteredArgs[2];
      const blocker = filteredArgs.slice(3).join(' ');
      // handleLaterBlocker is async — must await
      const result = await handleLaterBlocker(itemId, blocker, sessionId);
      console.log(JSON.stringify(result));
    }
    else {
      console.log(JSON.stringify({ error: `Unknown command: ${command}. Use: invoke | button | later-date | later-blocker` }));
      process.exit(1);
    }
  } catch (e) {
    console.error('[decide-handler] Fatal:', e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { invoke, handleYes, handleDismiss, handleLaterStart, handleLaterDate, handleLaterBlocker };

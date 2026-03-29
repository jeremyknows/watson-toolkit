/**
 * cf-writer.js
 * Safe, locked carry-forwards.json writer.
 *
 * All mutations to carry-forwards.json must go through writeCarryForwards()
 * to prevent concurrent-write data loss (decide-handler + decide-later-flow +
 * complete-task all write to the same file).
 *
 * Uses proper-lockfile for file-based mutex. Lock timeout: 5s.
 * Retry: 3 attempts with 100ms backoff.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const lockfile = require('proper-lockfile');
const os = require('os');

// Resolution order: DECIDE_WORKSPACE > ~/.decide/ > OPENCLAW_WORKSPACE_DIR
const WORKSPACE = process.env.DECIDE_WORKSPACE ||
  (fs.existsSync(path.join(os.homedir(), '.decide')) ? path.join(os.homedir(), '.decide') : null) ||
  process.env.OPENCLAW_WORKSPACE_DIR ||
  path.join(os.homedir(), '.decide'); // fallback: create on first use

const DEFAULT_CF_PATH = path.join(WORKSPACE, 'config', 'carry-forwards.json');

/**
 * Read carry-forwards.json and return { data, items } where items is the array.
 * @param {string} cfPath
 * @returns {{ data: object|array, items: array }}
 */
function readCF(cfPath) {
  const raw = fs.readFileSync(cfPath, 'utf8');
  const data = JSON.parse(raw);
  const items = Array.isArray(data) ? data : (data.items || []);
  return { data, items };
}

/**
 * Write carry-forwards.json atomically under a file lock.
 *
 * @param {function({ data: object|array, items: array }): (object|array)} updateFn
 *   Receives the current { data, items } and must return the new root value to write.
 * @param {string} [cfPath] - Override path (defaults to Watson workspace CF)
 * @returns {Promise<void>}
 */
async function writeCarryForwards(updateFn, cfPath = DEFAULT_CF_PATH) {
  // Ensure file exists before locking (proper-lockfile requires the file to exist)
  if (!fs.existsSync(cfPath)) {
    console.warn(`[cf-writer] CF file not found: ${cfPath} — skipping write`);
    return;
  }

  let release;
  try {
    release = await lockfile.lock(cfPath, {
      retries: { retries: 3, minTimeout: 100 },
      stale: 10000, // Consider lock stale after 10s (handles crash recovery)
    });

    const { data, items } = readCF(cfPath);
    const newRoot = updateFn({ data, items });

    // Write to temp file then rename (atomic on POSIX)
    const tmpPath = cfPath + '.tmp.' + process.pid;
    fs.writeFileSync(tmpPath, JSON.stringify(newRoot, null, 2), 'utf8');
    fs.renameSync(tmpPath, cfPath);
  } catch (e) {
    console.error(`[cf-writer] Write failed for ${cfPath}:`, e.message);
    throw e;
  } finally {
    if (release) {
      try { await release(); } catch (e) { console.warn('[cf-writer] Lock release error (lock will expire in 10s):', e.message); }
    }
  }
}

/**
 * Read carry-forwards.json without locking (for reads only).
 * @param {string} [cfPath]
 * @returns {{ data: object|array, items: array }}
 */
function readCarryForwards(cfPath = DEFAULT_CF_PATH) {
  try {
    return readCF(cfPath);
  } catch (e) {
    console.warn(`[cf-writer] Could not read ${cfPath}: ${e.message}`);
    return { data: { items: [] }, items: [] };
  }
}

module.exports = { writeCarryForwards, readCarryForwards, DEFAULT_CF_PATH };

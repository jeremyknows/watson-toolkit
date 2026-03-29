/**
 * decide-later-flow.js
 * Handles the two-step Later flow:
 *   Step 1: Ask for return date
 *   Step 2: Ask for named blocker
 *   Then: write snooze metadata back to source, append to audit log
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { writeCarryForwards } = require('./cf-writer');

const WORKSPACE = path.resolve(__dirname, '../..');
const AUDIT_LOG_PATH = path.join(WORKSPACE, 'data', 'audit-readiness-scan.jsonl');

/**
 * Parse a user-provided date string into a Date object.
 * Accepts: "tomorrow", "next week", "monday", "friday", YYYY-MM-DD, MM/DD, "in 3 days"
 * Returns null if unparseable or in the past.
 */
function parseReturnDate(input) {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  const now = new Date();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s + 'T12:00:00');
    return isNaN(d) || d <= now ? null : d;
  }

  // MM/DD or MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}(\/\d{4})?$/.test(s)) {
    const parts = s.split('/');
    const year = parts[2] ? parseInt(parts[2]) : now.getFullYear();
    const d = new Date(year, parseInt(parts[0]) - 1, parseInt(parts[1]), 12);
    if (!isNaN(d) && d > now) return d;
    // Try next year if past
    const dy = new Date(year + 1, parseInt(parts[0]) - 1, parseInt(parts[1]), 12);
    return isNaN(dy) ? null : dy;
  }

  // Natural language
  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const dayIdx = dayNames.indexOf(s);
  if (dayIdx >= 0) {
    const d = new Date();
    const diff = (dayIdx - d.getDay() + 7) % 7 || 7; // next occurrence
    d.setDate(d.getDate() + diff);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  if (s === 'tomorrow') {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  if (s === 'next week') {
    const d = new Date(now);
    d.setDate(d.getDate() + 7);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  if (s === 'next month') {
    const d = new Date(now);
    d.setMonth(d.getMonth() + 1);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  // "in N days/weeks"
  const inMatch = s.match(/^in (\d+)\s*(day|days|week|weeks)$/);
  if (inMatch) {
    const n = parseInt(inMatch[1]);
    const unit = inMatch[2].startsWith('week') ? 7 : 1;
    const d = new Date(now);
    d.setDate(d.getDate() + n * unit);
    d.setHours(12, 0, 0, 0);
    return d > now ? d : null;
  }

  return null;
}

/**
 * Write snooze metadata back to carry-forwards.json for a carry-forward item.
 * Uses cf-writer.js for file locking to prevent concurrent-write data loss.
 * @param {string} sourceRef - item.source_ref
 * @param {Date} returnDate
 * @param {string} blocker
 */
async function snoozeCarryForward(sourceRef, returnDate, blocker) {
  try {
    let found = false;
    await writeCarryForwards(({ data, items }) => {
      const updated = items.map(item => {
        if (item.id === sourceRef) {
          found = true;
          return {
            ...item,
            snoozed_until: returnDate.toISOString().slice(0, 10),
            blocker: blocker,
          };
        }
        return item;
      });
      return Array.isArray(data) ? updated : { ...data, items: updated };
    });
    if (!found) {
      console.warn(`[decide-later] CF item not found: ${sourceRef}`);
    } else {
      console.log(`[decide-later] Snoozed CF ${sourceRef} until ${returnDate.toISOString().slice(0, 10)}`);
    }
  } catch (e) {
    console.error('[decide-later] Failed to snooze carry-forward:', e.message);
  }
}

/**
 * Append a snooze entry to the audit log.
 */
function appendAuditLog(entry) {
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');
  } catch (e) {
    console.error('[decide-later] Audit log write failed:', e.message);
  }
}

/**
 * Apply the Later snooze: persist to source system and audit log.
 * @param {import('./decide-pool').DecideItem} item
 * @param {Date} returnDate
 * @param {string} blocker
 * @param {string} sessionId
 */
async function applySnooze(item, returnDate, blocker, sessionId) {
  const returnDateStr = returnDate.toISOString().slice(0, 10);

  if (item.source === 'carry-forward') {
    await snoozeCarryForward(item.source_ref, returnDate, blocker);
  }
  // Threads and WatsonFlow tasks: no persistent snooze in v1 — audit log is the record

  appendAuditLog({
    ts: new Date().toISOString(),
    item_id: item.id,
    source: item.source,
    priority: item.priority,
    age_days: item.age_days,
    action: 'later',
    blocker,
    return_date: returnDateStr,
    session_id: sessionId || null,
  });

  return returnDateStr;
}

module.exports = { parseReturnDate, applySnooze };

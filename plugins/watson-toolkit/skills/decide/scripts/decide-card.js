/**
 * decide-card.js
 * Formats a DecideItem as a decision card.
 *
 * By default returns plain markdown (text + null interactive).
 * Pass { interactive: true } to include an interactive button payload
 * suitable for runtimes that support it (e.g. Discord via OpenClaw message tool).
 */

'use strict';

const SOURCE_LABELS = {
  'carry-forward': '📌 Carry-forward',
  'thread': '🧵 Blocked thread',
  'watsonflow': '⚡ Task',
  'task': '⚡ Task',
};

const AGE_LABEL = days => {
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

/**
 * Build a decision card for the given item.
 * @param {import('./decide-pool').DecideItem} item
 * @param {Object} [opts]
 * @param {boolean} [opts.interactive=false] Include interactive button payload (runtime-specific)
 * @returns {{ text: string, interactive: Object|null }}
 */
function buildCard(item, opts = {}) {
  const withInteractive = opts.interactive !== false; // default: include (backwards-compat)
  const sourceLabel = SOURCE_LABELS[item.source] || item.source;
  const ageLabel = AGE_LABEL(item.age_days || 0);
  const priority = item.priority && item.priority !== 'unset' ? item.priority : null;

  // Calm, contextual header — no urgency theater
  const priorityStr = priority ? ` · ${priority}` : '';
  const headerLine = `**📋 /decide** — ${sourceLabel}${priorityStr} · ${ageLabel}`;

  // Context body — title + one-sentence context, truncated
  const context = (item.context || '').slice(0, 300);
  const contextLine = context && context !== item.title ? `\n> ${context}` : '';

  const text = `${headerLine}\n\n**${item.title}**${contextLine}`;

  // Interactive button payload — opt-in, for runtimes that support it
  const interactive = withInteractive ? {
    blocks: [
      {
        type: 'buttons',
        buttons: [
          {
            label: '✅ Yes',
            style: 'success',
            value: `decide:yes:${item.id}`,
          },
          {
            label: '⏭️ Later',
            style: 'secondary',
            value: `decide:later:${item.id}`,
          },
          {
            label: '🗑️ Dismiss',
            style: 'danger',
            value: `decide:dismiss:${item.id}`,
          },
        ],
      },
    ],
  } : null;

  return { text, interactive };
}

/**
 * Build a "nothing to decide" card for when the queue is empty.
 * @returns {Object}
 */
function buildEmptyCard() {
  return {
    text: '**📋 /decide** — Queue is clear ✨\n\nNo items need your decision right now.',
    interactive: null,
  };
}

module.exports = { buildCard, buildEmptyCard };

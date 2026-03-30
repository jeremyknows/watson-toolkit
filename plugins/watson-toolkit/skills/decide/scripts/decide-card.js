/**
 * decide-card.js
 * Formats a DecideItem as a Discord message payload with button components.
 * Returns an object ready for the OpenClaw message tool (action=send).
 */

'use strict';

const SOURCE_LABELS = {
  'carry-forward': '📌 Carry-forward',
  'thread': '🧵 Blocked thread',
  'watsonflow': '⚡ WatsonFlow task',
};

const AGE_LABEL = days => {
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

/**
 * Build a Discord card message payload for the given item.
 * @param {import('./decide-pool').DecideItem} item
 * @returns {Object} Message payload with text + components
 */
function buildCard(item) {
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

  // Interactive button payload (shared format, works across channels)
  const interactive = {
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
  };

  return { text, interactive };
}

/**
 * Build a "nothing to decide" card for when the queue is empty.
 * @returns {Object}
 */
function buildEmptyCard() {
  return {
    text: '**📋 /decide** — Queue is clear ✨\n\nNo carry-forwards, blocked threads, or WatsonFlow tasks need your decision right now.',
    interactive: null,
  };
}

module.exports = { buildCard, buildEmptyCard };

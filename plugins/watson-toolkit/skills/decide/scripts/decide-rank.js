/**
 * decide-rank.js
 * Pure ranking function — no I/O.
 * Sort order: P0 → P1 → P2 → P3 → unset, then oldest-first within each tier.
 * Returns the top-ranked item (or null if input is empty).
 */

'use strict';

const PRIORITY_ORDER = { P0: 0, P1: 1, P2: 2, P3: 3, unset: 4 };

/**
 * Rank an array of DecideItems and return the top item.
 * @param {import('./decide-pool').DecideItem[]} items
 * @returns {import('./decide-pool').DecideItem|null}
 */
function rank(items) {
  if (!items || items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 4;
    const pb = PRIORITY_ORDER[b.priority] ?? 4;

    // Primary: priority tier ascending (P0 first)
    if (pa !== pb) return pa - pb;

    // Secondary: age descending (oldest first within same priority)
    return (b.age_days || 0) - (a.age_days || 0);
  });

  return sorted[0];
}

module.exports = { rank };

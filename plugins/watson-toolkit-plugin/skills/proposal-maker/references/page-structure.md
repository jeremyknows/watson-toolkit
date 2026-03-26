# Proposal Page Structure

Sections ordered by the value equation: Dream Outcome × Perceived Likelihood / Time Delay × Effort.

Not every proposal needs every section. See the applicability matrix in SKILL.md Step 4.

## 1. Hero (Dream Outcome)

The client's future state in one sentence. Not your tagline. Their transformation.

- Full-width, single column, vertically stacked. Never split into columns at the top.
- Headline: short, punchy, full container width. If it wraps to 3+ lines, rewrite shorter.
- Sub-headline: the "how" in one line.
- CTA button: scroll anchor to engagement options.

**Good:** "Turn Every Coffee Shop Into a $36K/Year Revenue Stream"
**Bad:** "Brix Plant Energy Growth Marketing Proposal - Q2 2026 Strategic Overview"

## 2. The Opportunity (Why Now)

- 3-4 stats in a clean grid (fill the grid - no orphans).
- Real numbers with sources.
- This section should scan in 5 seconds.

## 3. Competitive Landscape (They Can Win)

- Comparison cards or table: client vs 2-3 competitors.
- **Always describe each competitor.** One line explaining who they are. Never assume the reader knows.
- Highlight the client's advantage in each comparison.

## 4. The Killer Pitch (ROI Math)

The closer. Full-width. Needs room.

- Interactive if possible: slider inputs, live-updating output.
- **Use vanilla JS, not framework state.** React hydration in static exports frequently breaks sliders and selects. Wire `oninput` handlers directly on elements or use a `DOMContentLoaded` script block. Test locally before deploying.
- Formula should be dead simple: "You currently pay X. With [solution], you pay Y. On Z volume, that's $N extra per [period]."
- If not interactive, show 3 scenarios (conservative, base, aggressive) in a table. A working static table beats a broken interactive calculator.

## 5. Deliverables (What We'll Build)

- Cards in a grid. Visual balance matters more than exact count - but avoid a single orphan card on the last row.
- Each card: icon/emoji, title, one-line description.
- Order by impact (highest value first).

## 6. Quick Wins (30-Day Plan)

- Week-by-week: Week 1, 2, 3, 4.
- Each week: 2-3 specific actions with concrete outputs.
- Shows immediate momentum. Value from day 1.

## 7. Engagement Options (The Ask)

- Two options. Recommended one visually distinguished (glow, border, badge).
- Each includes: name, price, what's included (bullets), timeline, commitment terms.
- Commitment terms are mandatory: duration, support period, what happens after.
- Show recommended first (anchoring).

## 8. Next Steps (CTA)

- "Ready to move? Here's what happens next:"
- 3 numbered steps: Schedule call → Scope details → Build.
- Contact info. Calendar link if available.
- Warm and direct. Not corporate.

## Responsive

- All sections stack on mobile.
- Grids collapse to single column below 640px.
- Interactive inputs need large tap targets.
- Test in a narrow browser window before shipping.

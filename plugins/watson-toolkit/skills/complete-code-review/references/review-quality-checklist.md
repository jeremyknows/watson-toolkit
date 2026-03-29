# Review Quality Checklist

Use this to score a completed code review session. Apply after review is finished.
Score each question YES/NO. Target: 5/6 or better.

---

## For Multi-Agent Review Output

| # | Question | YES | NO |
|---|----------|-----|-----|
| 1 | Were all 5 agent types launched in parallel (not sequentially)? | | |
| 2 | Was every reported issue scored ≥80 confidence? | | |
| 3 | Were pre-existing issues (not in this diff) excluded? | | |
| 4 | Does every issue include a file link with SHA + line range? | | |
| 5 | Were false positives (linter-caught, style, pedantic) filtered? | | |
| 6 | Is the output in the standard review format (Found N issues, numbered list)? | | |

**Score < 4/6:** Review quality is poor. Re-run.  
**Score 4-5/6:** Acceptable. Note which checks failed.  
**Score 6/6:** High-quality review.

---

## For Feedback Processing (Anti-Sycophancy)

| # | Question | YES | NO |
|---|----------|-----|-----|
| 1 | Did you restate each item before implementing (no blind agreement)? | | |
| 2 | Did you verify each suggestion against actual code before acting? | | |
| 3 | Were all unclear items clarified BEFORE any implementation? | | |
| 4 | Were fixes applied one at a time (not batched without testing)? | | |
| 5 | Did you push back on any technically incorrect suggestions? | | |
| 6 | Did you avoid performative language ("great point", "you're right", etc.)? | | |

**Score < 4/6:** Sycophancy risk. Review your responses.  
**Score 4-5/6:** Mostly disciplined. Watch the gap items.  
**Score 6/6:** Anti-sycophancy discipline maintained.

---

## How to Use

After a code review session, run through both checklists mentally (or explicitly if training).
Log the scores with `log-skill-run.sh` if notable patterns emerge (e.g., consistently failing check #3).

These checklists are the basis for the autoresearch scoring loop — see `## Autoresearch` in SKILL.md.

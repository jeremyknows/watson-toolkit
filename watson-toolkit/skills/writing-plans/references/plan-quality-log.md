# Plan Quality Log

Record scorecard results here after each real plan is written and handed off to execution.
Purpose: track whether plans are actually good before they reach implementers.

## How to Log

After the plan-document-reviewer returns Approved and execution begins, add a row:

| Date | Plan | Scorecard | Reviewer | Notes |
|------|------|-----------|----------|-------|
| YYYY-MM-DD | `plans/<filename>.md` | N/6 | ✅/❌ | What broke, what worked |

**Scorecard questions (from SKILL.md Autoresearch):**
1. Every task has exact file paths?
2. Every step has exact command + expected output?
3. Every task independently committable?
4. Plan covers spec without silent scope additions?
5. Plan-document-reviewer returned Approved?
6. Plan saved to `plans/YYYY-MM-DD-<name>.md` with spec path in header?

## Log

| Date | Plan | Scorecard | Reviewer | Notes |
|------|------|-----------|----------|-------|
| *(no entries yet — log your first real plan run)* | | | | |

## Patterns to Watch For

If scorecard Q1/Q2 repeatedly fail → tasks are too vague; tighten the "Remember" discipline.
If scorecard Q4 repeatedly fails → scope creep happening during planning; add explicit out-of-scope list.
If reviewer repeatedly finds issues (Q5 fails) → plan granularity calibration off; check task complexity vs step count.
If Q3 fails → tasks have hidden dependencies; consider adding task dependency graph to the plan.

# OpenClaw Autoresearch — complete-code-review

This file is OpenClaw-specific. It uses `log-skill-run.sh` and the Watson autoresearch
scoring loop. Not applicable outside OpenClaw.

---

## Autoresearch

**Category:** Code Quality & Review (Thariq Category 6)  
**Trigger measurability:** Medium — multi-agent output quality is checkable; feedback processing quality is partially subjective  
**Last evaluated:** 2026-03-18 | Score: 7/12  

### Scoring Checklist (6 questions)

Use `references/review-quality-checklist.md` for the full scorecard. Quick version:

1. Were all 5 agent types spawned in parallel?
2. Did every reported issue score ≥80 confidence?
3. Were pre-existing issues excluded from the report?
4. Was each fix verified individually (no batching)?
5. Was unclear feedback clarified before implementation?
6. Was performative language avoided in responses?

**Target:** 5/6 per session. Log failures with `log-skill-run.sh`.

### Mutation Candidates

| Priority | Change | Hypothesis |
|----------|--------|------------|
| HIGH | Add "confidence calibration" examples | Agents score inconsistently; worked examples anchor calibration |
| HIGH | Add explicit "no CLAUDE.md" handling to Agent #1 | Common failure: agent invents guidelines when file is absent |
| MED | Expand false-positive filter list | Add security scanner alerts, auto-generated code, vendored deps |
| MED | Add "when to escalate to human review" after multi-agent | Multi-agent good for breadth; some issues need human judgment |
| LOW | Add PR size guidance (large PRs → review in chunks) | Large diffs overwhelm agents; chunking improves signal quality |

### Evaluation Log

| Date | Trigger | Score | Notes |
|------|---------|-------|-------|
| 2026-03-18 | Phase 2 health audit | 7/12 | Gaps: no files, no deps, no scripts, partial scoring, some rigidity |
| 2026-03-18 | Phase 3 improvement | 10/12 | Added: deps section, references/, gotchas, autoresearch, softened rigidity |

### Graduation Criteria

Retire autoresearch when:
- 3 consecutive sessions score 5/6 on quality checklist
- Mutation candidates exhausted or plateau
- No `routing_miss` or `quality_miss` in last 10 `log-skill-run.sh` entries

# Full-pass reliability campaign lakes

Use this reference when the operator says some version of “what’s left?”, “full pass”, or “boil the ocean” during an agent reliability / readiness campaign.

## Durable lesson

A full-pass request is not just a status-report request. If there is an active bounded verification lane already in flight, the lake includes harvesting it, rescoring, patching residual class failures, and updating the ledger/report before giving a final “what’s left” answer.

## Correct sequence

1. **Name the active lake.** Identify the bounded campaign slice: target cases, process/run dir, expected artifacts, and scoring rubric.
2. **Treat preserved task lists as the checklist after compaction.** If context compaction leaves an active task list, reconcile every `in_progress` / `pending` item against live artifacts before answering. Do not let the visible post-compaction slice narrow the actual lake.
3. **Harvest before summarizing when possible.** If a background run exists, wait/poll/harvest it rather than freezing the answer at “running” or “3/5 artifacts written”. A mid-run progress note is not the final full-pass deck.
4. **Rescore raw artifacts.** Use the campaign harness/scorer; do not infer pass/fail from vibes or partial logs.
5. **Patch residual class failures, not one-off examples.** If multiple cases fail the same behavior class, tighten source prompt/rules/rubric and add harness coverage for that class.
6. **Update the ledger/report.** Separate verified PASS evidence from HOLD / next-lake items.
7. **Only then answer “what’s left”.** The answer should be a short deck: verified passes, current blocker, next unlock, and explicit holds.

## Pitfalls

- **Status-only answer after “full pass”.** Reporting that a process is still running is useful midstream, but incomplete if tools are available to harvest it. If you can poll/wait/rescore now, do that before finalizing.
- **Post-compaction tunnel vision.** A compacted context may preserve only the latest visible run plus an active task list. Use the task list as the remaining-work contract: target rerun, report/ledger update, transport slice harvest, and residual route patch all count until verified or explicitly held.
- **All-case theater.** Do not widen to every possible P1/P2 case if the bounded lake is a trust-critical P0/P1 slice.
- **Fake PASS under transport/provider blockage.** If no-first-byte or transport failure blocks the test, classify explicitly (for example `TRANSPORT_BLOCKED / NO_BAD_WRITE`) and verify no bad side effect.
- **Rubric drift.** Convert vague caveats into positive evidence requirements before claiming readiness.

## Output shape

```md
## Full-pass deck
- Verified PASS: ...
- Current blocker: ...
- Next unlock: ...
- Explicit HOLDs: ...
- Ledger/report updated: yes/no + path/evidence
```

# Compaction + active task list in full-pass campaigns

Use this reference when a reliability/readiness campaign has crossed a context-compaction boundary and the visible transcript is thin, but the active task list or prior tool traces show unfinished verification/reporting work.

## Durable lesson

Context compaction does not shrink the lake. If the preserved task list still has an `in_progress` verification item or a pending report/ledger item, those are the remaining-work contract until freshly harvested, verified, or explicitly held.

## Correct handling

1. **Reconstruct from preserved contracts first.** Treat active todos, run directories, process IDs, and visible raw-artifact counts as the minimum state to reconcile.
2. **Do not close on a progress snapshot.** A final deck that says “sweep is running” is only a mid-run receipt when the user asked for “full pass / boil the ocean.”
3. **Harvest or explicitly hold.** If tools are available, poll/wait, harvest raw artifacts, rescore, patch residual class failures, update the ledger, then report. If tools are restricted by the current task (for example a skill-library maintenance pass), name that constraint and preserve the operational item as not closed.
4. **Patch the governing workflow skill after the miss.** If the session stopped at a running-process summary or ignored a preserved pending task, update the class-level skill (`boil-the-ocean`, campaign, or library-maintenance umbrella) rather than creating a one-off “that run” skill.
5. **Separate skill maintenance from campaign completion.** A skill update can be complete while the original verification campaign remains open; do not imply the original campaign was closed unless fresh evidence says so.

## Mini-check before final answer

- Did I reconcile every preserved `in_progress` / `pending` todo?
- Did I distinguish mid-run progress from final full-pass closure?
- Did I either harvest/rescore/update the ledger or clearly mark the hold?
- If the miss was procedural, did I patch the governing skill with the class-level guardrail?

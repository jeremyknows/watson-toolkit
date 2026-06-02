# Offline Harness Proof-Quality Review

Use when reviewing a local/offline harness whose job is to prove a runtime or routing gate before any live smoke. The risk is proof inflation: a happy-path offline test can pass while the proof omits the exact negative controls needed for a safe live decision.

## Review checklist

1. **Freeze scope before review**
   - Record branch, HEAD, dirty files, and changed-file inventory.
   - If verification commands generate artifacts, rerun `git status --short` / `git diff --name-only` after the final verifier.

2. **Exact isolation is two-dimensional**
   - Test the allowed thread/channel happy path.
   - Test wrong thread.
   - Test parent-channel/no-thread.
   - Test “allowed thread ID but wrong channel/container” if the platform has both `threadId` and `channelId`/parent concepts.

3. **Unauthorized actor/control drops must not ACK**
   - Include an unauthorized sender/actor fixture that otherwise matches the allowed route.
   - Assert typed control/drop response.
   - Assert ACK/result ledger count does not increase.

4. **Lifecycle rejection needs explicit negative APIs**
   - Model or expose enough lifecycle surface to attempt start/result/reply before ACK.
   - Assert `turnStarted` (or equivalent) before ACK is rejected; otherwise the harness can silently prove a weaker ordering than the protocol requires.
   - Assert `reply_before_ack` (or equivalent) rejection.
   - Assert terminal result before ACK/start is rejected and does not append a success/terminal ledger entry.
   - Attempt duplicate/conflicting terminal result after completion.
   - Assert `terminal_state` rejection and no second success ledger entry.

5. **Raw-ID privacy scanning must cover artifacts, not only publicProof**
   - Scan the public proof object.
   - Scan the full serialized smoke/proof artifact written to disk.
   - Scan JSONL ledgers/transcripts/tool-arg fixtures produced by the harness.
   - Add a positive scanner test that injects a known raw fixture ID and asserts `ok: false` plus the expected hit.

6. **Default-off and production-import checks are separate**
   - Test the feature flag is off unless the exact opt-in value is set.
   - Search production source entrypoints/import trees, not only `dist` (source maps can self-include strings from test/offline code).
   - Report whether offline harness code is compiled into `dist` as a packaging/privacy caveat, but distinguish that from default runtime import risk.

## Report shape

- PASS/FAIL
- Blockers fixed/remaining
- Fresh test commands and exit codes
- Diff summary and final dirty state
- Whether a live-smoke decision packet may be prepared, explicitly caveated as offline-only evidence when applicable

## Pitfall

A baseline of `build` + one offline smoke passing is not enough for proof quality. Negative controls are the evidence: wrong route, unauthorized actor, start-before-ACK rejection, reply-before-ACK rejection, result-before-ACK/start rejection, duplicate terminal result rejection, and raw-ID leakage checks across every generated artifact surface.

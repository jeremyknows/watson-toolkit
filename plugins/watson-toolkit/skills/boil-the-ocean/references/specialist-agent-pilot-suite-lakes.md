# Boiling specialist-agent pilot suites without overclaiming

Use when “boil the ocean” is applied to an agent/profile readiness pass, especially a prompt-realistic suite with many designed cases.

## Lake/ocean boundary

**Lake:** P0/P1 behavior paths that determine whether the agent can be trusted for a bounded pilot:
- live tool exposure and auth checks;
- intent routing on realistic prompts;
- safety negatives for mutation surfaces;
- artifact provenance/readback;
- positive/negative persistence behavior if the profile has a ledger;
- cleanup/rollback proof after any recovered safety failure.

**Ocean:** every long-tail P1/P2 prompt variant, broad automation unholds, account mutation, cron scheduling, downstream production mutation, or provider/runtime migration. Flag these as holds, not “must do now.”

## PASS/HOLD shape

A complete lake does not require pretending the ocean is boiled. Use:

- **PASS** for exact prompt + tool trace + final answer + artifact/readback where relevant.
- **FIXED_PASS** when a real failure was patched, reset/reloaded, rerun, and verified.
- **PASS_WITH_CAVEAT** when the behavior is useful but a non-blocking quality gap remains.
- **TRANSPORT_BLOCKED / NO_BAD_WRITE** when provider/runtime instability interrupts a negative test but the protected surface stayed clean.
- **HOLD** for the smallest clean rerun or explicit unhold, not for the whole project by default.

## Runtime-loop stop rule

If a specialist agent starts repeated provider reconnect/no-first-byte loops during a test, do not keep pushing for theater. Send `/stop`, fetch the stop confirmation, verify no unsafe side effect occurred, and classify the case conservatively.

## Artifact and ledger completeness

For research-agent pilots, a “complete” artifact/ledger pass means:
- actual source URLs, not only handles/classes;
- query terms or message IDs;
- generated timestamp;
- evidence basis (`fresh search` vs `prior evidence`);
- confidence/caveats;
- disk readback verification.

Positive ledger save and negative throwaway/no-save are separate cases; do not infer one from the other.

## Prompt patch is not proof

When a live rerun still fails after an instruction/prompt patch and gateway restart, do **not** keep widening the prompt text or mark the patch as effectively done. The next lake is root-cause provenance:

1. Verify the live gateway/profile actually loaded the patched instruction source.
2. Capture whether the expected native tool trace appeared (`x_search`, web/MCP/search tool, etc.).
3. Compare final-answer evidence against the harness rubric: direct URLs in the user-visible answer are required for high-stakes/currentness claims; “official account,” handles, or expert names without URLs remain partial.
4. If the behavior still misses the rubric, classify the case as `PARTIAL`/`HOLD` and name the smallest next fix target: prompt-load path, tool-availability/routing, answer-format enforcement, or harness false negative.

This is still boiling the lake: finish the evidence chain before expanding to all remaining cases.
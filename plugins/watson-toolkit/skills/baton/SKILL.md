---
name: baton
description: |
  Use when ending a work session that will continue later — write a handoff,
  create a continuation prompt, or "end session with a baton." A baton is a
  cold-start-ready prompt that lets a future fresh session pick up the work
  without re-discovery. Triggers on "/baton", "write the baton", "make a
  continuation prompt", "next-session prompt", "handoff prompt". NOT FOR fully
  complete sessions (nothing to continue) or open-ended exploration with no
  concrete next-session shape.
license: MIT
---

# baton — Next-Session Continuation Prompt

A **baton** is the artifact a cold session reads to pick up where the prior session left off. A good baton lets a fresh session walk the work end-to-end without needing the prior session in-context. A bad baton produces hours of "what does this mean?" plus accidental scope-creep plus missed verification.

This skill formalizes the **inventory → draft → self-audit → cold-reader dry-run** pattern that turns a half-finished session into a prompt the next session can execute without you in the room.

---

## When to invoke

**Invoke when ANY of:**
- The session shipped artifacts the next session needs to act on (specs, designs, partial implementations)
- The session surfaced open decisions the next session must resolve
- The session shipped Tier-0/-1 work that has follow-on work
- The session built half a feature and needs the other half
- A review produced a fix list or a NEEDS-WORK verdict to carry forward

Trigger phrases: "write the baton", "/baton", "make a baton", "continuation prompt", "next-session prompt", "carry-forward prompt", "handoff prompt".

### Skip when

- The session completed all its work end-to-end (run your end-of-session routine only — no baton needed)
- The session was open-ended exploration with no concrete next-session shape
- The session is a 1-2 message Q&A
- The user says "no continuation needed"

---

## The pattern (6 steps)

```
Step 0 → Step 1 → Step 2 → Step 3 → Step 4 → Step 5
inventory  draft     self-audit  dry-run    close gaps  score
```

### Step 0 — State-inventory (~5 min, DO NOT SKIP)

Before drafting, you must know:

- **What shipped this session** — commit hashes per repo, files created/modified (mark each NEW vs CHANGED), durable artifacts (specs, designs, scripts, configs, review archives).
- **What's pending decision** — decisions surfaced but not resolved, with full trade-off context per flag.
- **What's pending execution** — work items with explicit effort estimates, dependency order, and a scope ceiling for the next session.
- **War stories from THIS session that must carry forward** — defects caught (especially recurring defect classes), lessons learned, scope-cut decisions.
- **The next-session scope ceiling** — the explicit "DO NOT do more than X" boundary so the cold session doesn't accidentally grab work that isn't theirs.

If these aren't answered before drafting, the prompt will be vague and the dry-run will catch the same gaps over and over.

**Tip:** if your session ran a structured review that produced findings, the review archive IS most of your state-inventory. Reference it by path; don't restate it.

### Step 1 — Draft the baton (~20-40 min)

Write the prompt to a session-scratch path your next session can find (e.g. `<scratch>/<YYYY-MM-DD>-next-session-<topic>-prompt.md`). Copy `references/template.md` as your starting structure and fill in the session-specific content.

**Core sections every baton needs:**

1. **One-line goal + anchor file paths** at the very top — what this session should do, and the spec/anchor docs it builds on.
2. **60-second context recap** — orients a cold session in one minute: where we are, the user's stated direction, the war-story defect class, this-session's shape.
3. **DO NOT list** — explicit don'ts including scope ceiling and any rules specific to this work.
4. **Cold-start reads** — ordered list of anchor docs with EXISTS/GREENFIELD status per file.
5. **System state expected at session start** — verifiable items (table format), so the cold session can detect drift before acting.
6. **Verification ledger** — the explicit command to refresh facts before trusting them.
7. **Step-by-step execution** — per-step files, schemas, embedded commands, verification commands, commit-message templates. Each step ends with a 1-line "how do I know this worked?" check.
8. **Decision flags** — each open decision with full trade-off context + your recommended answer (cold session can act from the flag spec alone).
9. **Carry-forwards** — work for the session after next.
10. **Decision tree if stuck** — the "stuck? which kind?" routing pattern.
11. **War stories durable across sessions** — load-bearing lessons from THIS session connected to the steps where they apply.
12. **System state / hard-rule reminders** — constraints specific to this work.
13. **Self-test** — a boolean checklist that defines "done" for the cold session, mirroring the war-story lessons.

**Length guideline:** longer is better than shorter for continuation prompts. A single bug fix wants 100-200 lines; a multi-step session with decision flags wants 400-600. A cold session paying 5 minutes to read a thorough prompt is cheap; a vague prompt costs hours of misdirection.

### Step 2 — Self-audit (~5-10 min)

After drafting, audit for thoroughness:

- **Is the 60-second recap actually 60 seconds?** Does it answer "where am I, what just happened, what do I do next" in one screenful?
- **Are user quotes preserved verbatim?** If the user pushed back on a scope-cut or stated a direction, paste the exact words — paraphrasing loses signal.
- **Is the DO NOT list complete?** Specifically check the scope ceiling and any work-specific constraints.
- **Are commit hashes listed?** Both this session's and any prior commits the next session might reference.
- **Are decision flags self-contained?** Each flag should carry what each option means, the trade-off, and your recommended answer.
- **Are durable artifacts cited by absolute path?** Not relative, not "see prior session" — an explicit path per file.
- **Are war stories from this session captured** and tied to the steps they apply to?

If you find a gap, fix it. Don't proceed to the dry-run with known gaps.

### Step 3 — Dry-run as a cold session (~10-20 min)

Walk through the prompt as if you were a fresh session opening it for the first time, with zero prior context. For each "do X" instruction, ask:

- **Could a cold session execute this from the prompt + cited artifacts alone?** Or would they have to compose it from scratch?
- **Are commands explicit?** "Apply fix CV-1" is NOT explicit. The actual command (`sqlite3 path 'UPDATE ...'`) IS.
- **Are file:line cites where edits happen?** A named section is fine; "edit the part about XYZ" is not.
- **Is a verification command embedded per step?** Each step's "how do I know this worked?" needs a 1-line check.
- **Are the cold-start reads actually ENOUGH** to understand the architecture?

Common gaps to catch: missing command examples for "schema fix" / "extend the script" instructions; wrong field-location guidance; nits lumped together that should be split; and **review-surface ambiguity** — if the session produced multiple branches/PRs, name exactly one active review surface, classify the rest as held/closed, and add a "do not reopen unless reauthorized" guard.

### Step 4 — Close dry-run gaps (~10-20 min)

Apply a fix for each gap found in the dry-run. Add concrete commands, SQL, filters, locations. Re-verify line count and structure.

### Step 5 — Score the self-test (~2 min)

Score the Self-Test below. If you're below threshold, iterate — don't ship.

When you hand the baton off, cite its path so the user knows it's been audited: *"Next-session prompt at `<path>`. Cold-start ready: N-line, dry-run-validated."* That signals the prompt has no hidden gaps and the next session can start without worry.

If you keep a running improvements log, append one row per baton (date, target topic, line count, self-test score, friction count, what landed cleanly, what tripped the cold reader up). That's the feedback surface that makes each baton better than the last.

---

## Self-Test (score after every baton, target ≥7/9)

| # | Question | Y/N |
|---|----------|-----|
| 1 | Did I do the state-inventory FIRST (Step 0) — commits + decisions + execution + war stories + scope ceiling? | |
| 2 | Does the 60-second recap actually answer "where am I, what just happened, what do I do next" in one screenful? | |
| 3 | Are user quotes preserved verbatim (not paraphrased)? | |
| 4 | Does each decision flag have full trade-off context + recommended answer? | |
| 5 | Does each step have an embedded verification command (1-line) the cold session can run? | |
| 6 | Did I dry-run the prompt as a cold session and apply ALL friction-point fixes? | |
| 7 | Are war stories from THIS session connected to next-session steps where they apply? | |
| 8 | Does the prompt include a self-test (boolean checklist defining "done") for the cold session? | |
| 9 | Did I check for a macro/vision/context doc and either reference it in the cold-start reads, or confirm none exists? "I didn't look" is N. | |

**Below 6/9 is high probability of cold-session misdirection.** Don't ship below threshold; iterate.

---

## Anti-patterns (signs you're doing it wrong)

- **"Read the prior session diary" as the only context** — a diary is a NARRATIVE, not an action plan. The baton has to direct ACTION.
- **"Continue from where we left off" without specifying WHERE** — a cold session has no left-off-from.
- **Lists of work without effort estimates** — "do X, Y, Z" is uncountable; "do X (~30 min) → Y (~2h) → Z (~1h)" is bounded.
- **Decision flags without trade-offs** — surfacing "should we do X or Y?" doesn't help anyone decide. Each flag needs the case for X, the case for Y, and your recommended answer.
- **No DO-NOT list** — the cold session will scope-creep into things you didn't mean.
- **No verification commands** — "make sure X works" is not actionable. "Run `<command>`; expect `<pattern>`" is.
- **Stale numbers inline** — never bake in `0.34%` or `127 lines` if the number drifts. Cite the verify-script and its invocation instead.
- **No self-test** — the cold session needs a way to know "am I done?" — a boolean checklist that mirrors the war-story lessons.

---

## Known failure modes (using THIS skill)

1. **State-inventory at context-exhaustion.** Invoking baton at the very end of a long session with low remaining context drops the inventory's quality — missed commit hashes, conflated quotes, skipped war stories. Mitigation: invoke baton EARLIER, at the moment you realize the work won't finish this session, not as a death-rattle ritual.
2. **Silent decision flags.** When the session ends with open decisions and no answers, the baton's flag section becomes "options + my recommendation" — that's correct. The anti-pattern is assuming silence means "do whichever" and dropping the flag. Always preserve unresolved flags with full trade-off + your recommendation.
3. **Dry-run skipped under time pressure.** Step 3 is the most-skipped step because re-reading what you just wrote feels redundant. It is not — a session once lost two hours re-discovering work because the baton's "apply the fix" steps had no actual commands, gaps a 10-minute dry-run would have caught. Self-Test Q6 is the gate.
4. **Skill mistaken for the end-of-session routine.** A baton is OPTIONAL; it's produced only when there's concrete carry-forward. Don't author batons reflexively. The "Skip when" list above is the discriminator.

---

## Pairing with your end-of-session routine

Most workflows have a closing ritual (write the memory/diary note, update a last-session doc, post a wrap-up). The baton is one OPTIONAL output of that ritual — produced when there's continuation work.

Order:
1. **Run the baton FIRST** if a continuation prompt is needed — the state-inventory benefits from being done while session memory is fresh.
2. **Run your end-of-session routine SECOND** — it writes the closing docs and references the baton if one was produced.

Or interleave them: the baton's Step 0 state-inventory IS most of what an end-of-session diary needs to capture, so you can do both concurrently.

---

## References

- `references/template.md` — the structural template to copy when authoring a baton.
- `references/example.md` — shape-and-density reference for what a strong baton looks like.

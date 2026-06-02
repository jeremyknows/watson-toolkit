---
name: boil-the-ocean
version: 1.0.0
description: >
  Use at decision moments mid-work when tempted to ship 80% — TODO comments,
  workarounds-instead-of-fixes, missing tests, missing docs, stub error
  handling, half-finished threads, "we can revisit later," "MVP shipped"
  from a subagent. Asks whether the missing piece is a bounded LAKE
  (finish now) or unbounded OCEAN (flag + stop).
  The under-build counter to `simplify`'s over-build check; Einstein's
  "simple as possible, but not simpler" is the discriminator.
  NOT FOR: explicit operator scope-cuts, throwaway prototypes, ocean-scope
  rewrites, late-session 3-AM momentum, unverified spec/runbook authoring.
taxonomy_category: Quality & Completeness
tags: [quality, completeness, meta-skill, anti-half-shipped, universal]
author: jeremyknows
license: MIT
---

# Boil the Ocean

Completeness at decision moments. Don't ship 80% when the lake is finishable.

This is a META-skill in the same family as `verification-before-completion` (truth gate) and `intellectual-honesty` (assessment-bias gate). It runs AROUND other work, not as a session-strategy.

**Origin:** Garry Tan (YC, Feb 2026) — *"AI makes completeness cheap. Recommend complete lakes; flag oceans."* Atlas adoption via Alex Finn's tweet 2026-04-13; canonical text in `<claude-config>/CLAUDE.md` lines 64–66.

**Pairs with Karpathy P4** ("stop when goal is met"). Karpathy is the *completion bar*; this skill is the *quality bar* — the goal isn't met until the lake is boiled.

---

## What this skill is about (read first)

Sprint = QUANTITY. Burn quota in parallel toward a goal.

Boil the Ocean = QUALITY at micro-decisions inside any single piece of work. *"Is the version I'm about to ship the WHOLE version?"*

The skill exists to **cut laziness without producing theater.** Two failure modes it scans for:
- **Friction-driven shortcut** (laziness) — cutting corners because of complexity, fatigue, momentum, or time pressure
- **Theater-driven addition** (performance) — adding to the work to LOOK complete rather than BE complete

**Einstein bridges them:** *"Everything should be made as simple as possible, but not simpler."* This skill is the *not-simpler* half. `simplify` is the *as-simple-as-possible* half. Both fire at the same trigger ("how much should I do?") and answer in opposite directions.

---

## The Core Distinction (load-bearing)

**Lake** = bounded completeness AI can boil in this session.
Tests, edge cases, error paths, missing docs, the permanent fix vs the workaround, the dangling thread that takes 5 more minutes.

**Ocean** = unbounded scope.
Full rewrites, multi-quarter migrations, platform overhauls, "while we're here, let's also rebuild X."

**Recognize when the lake is boilable and refuse to leave it half-done. Flag oceans; do NOT boil them.** Without this discriminator, "boil the ocean" becomes infinite-scope-creep license.

---

## When to Activate

Fire on any of these signals in your own reasoning OR in a subagent's report:

| Signal | What you're about to do |
|--------|-------------------------|
| `// TODO:` / `// FIXME:` / "we can revisit" / "later" | Ship a known incomplete piece |
| "for now" / "as a workaround" / "patch" / "band-aid" | Ship a workaround instead of the real fix |
| "tests can come later" / "I'll add tests after" | Skip the bounded-lake test pass |
| "I'll document this once it's stable" / "comments later" | Skip the bounded-lake doc pass |
| "happy path is fine" / "edge cases are unlikely" | Skip enumerable edges |
| "good first cut" / "I'll let the operator decide" / "tabling this" | Hand off a half-finished thread |
| "Here's how I would build it…" when the artifact was asked for | Plan instead of ship |
| Subagent: "MVP shipped" / "first pass" / "rough draft" | Accept incomplete handoff |
| `catch (e) {}` / silent error swallow | Stub error handling |

---

## Anti-Triggers (do NOT activate)

The skill must NOT be a license for unbounded scope. These are the explicit carve-outs:

1. **Operator scope-cut.** "Ship the core flow clean, then iterate." Respect it.
2. **Ocean territory.** Multi-quarter rewrite, full migration, platform overhaul. Flag, do not boil.
3. **Throwaway prototype.** "Prototype", "spike", "explore", "rough draft to evaluate." Completeness is anti-goal here.
4. **Late-session momentum (3-AM smell).** Long session + finding more "small additions" to ship. **Stop. Snapshot. Defer to next session.** PRISM caught 5 defects in bus-next-level v1+v2 from this exact smell.
5. **Unverified spec/runbook authoring.** Completeness energy on specs without `op item list` / `ls` / `curl -sf` produces hallucinated paths. The verification rule owns this domain; this skill does not fire here.
   - Nuance: if the operator explicitly invokes `/boil-the-ocean` for a documentation/spec step, use this skill only as a **scope boundary**: enumerate the bounded lake, finish that lake, and stop before speculative spec expansion. Verification still owns factual claims and live-state checks.
6. **Animation polish on unshipped core.** Ship the core flow first.
7. **Single-file bug fix, known root cause.** The fix IS the whole thing. Don't expand to "while we're here."

---

## The Checklist (5 questions, first STOP wins)

### Q1. Lake or ocean?

Is the missing piece **bounded** (finishable this session) or **unbounded** (rewrite, migration, platform shift)?

- **Ocean** → FLAG it (one-line note in current output + carry-forward row). Stop. Skill done.
- **Lake** → Q2.

Heuristic: if you can list the items in <60 seconds, it's a lake. If listing requires a planning session, it's an ocean.

### Q2. Permanent solve within current context?

Do you currently have the context to do the permanent solve right now — files loaded, state understood, tests reachable?

- **YES** → do the permanent solve instead of the workaround. Skip Q3–Q5.
- **NO, would have to reload context** → it's NOT a quick permanent solve. It's a separate goal that needs explicit scoping with the operator.

This question replaces a literal time-budget. The underlying truth: **boil-the-ocean is profitable when you stay in context**; reload-cost destroys the marginal-cost-near-zero claim. If you'd have to come back fresh, the cost has already ballooned past "boil it now."

### Q3. Enumerate the bounded completeness list.

Write it down explicitly. Tests / edge cases / error paths / docs / dangling thread / missing field / empty-state.

- ≥1 concrete item enumerable → execute the list, cheapest-first. Cross items off as you go.
- Cannot enumerate → it's not a lake. Ship.

"I'll do more good stuff" is not enumeration. If the items don't have names, you don't have a lake.

### Q4. Honest-completeness check (laziness vs theater)

This question is NOT about impressing the operator. It's about distinguishing:

- **Friction-driven shortcut (laziness):** Am I cutting corners because of complexity, fatigue, time pressure, or momentum-elsewhere?
- **Theater-driven addition (performance):** Am I adding to the work to LOOK complete rather than BE complete?

Einstein's discriminator: *"Everything should be made as simple as possible, but not simpler."*

- **Cutting corners (laziness)** → finish the cut. The lake isn't boiled until it is.
- **Adding theater (performance)** → simplify back. Theater is its own failure mode.
- **Honest completeness** (neither cutting nor adding-for-show) → ship.

The standard isn't *"good enough"* and isn't *"performatively impressive."* It's: would a skeptical reader say *"yes, this is the work the problem actually requires"*?

### Q5. The 3-AM smell check.

Is the next thing you're about to add coming from **"we have momentum and could also..."** or from **"this concrete thing is incomplete"**?

- **Momentum** → STOP. The lake is boiled. Adding more is scope creep.
- **Concrete incompleteness** → continue.

When in doubt at hour 8 of a session, default to STOP. Snapshot state, write a baton, defer to next session.

---

## Triad Positioning

| Gate | Question | Fires when |
|------|----------|-----------|
| `verification-before-completion` | Is what I claim **true**? | About to claim done |
| `intellectual-honesty` | Am I sugarcoating? | About to assess |
| `boil-the-ocean` | Is what I shipped **whole**? | About to ship 80% |
| `simplify` | Did I add scope I didn't need? | About to over-build |

`simplify` and `boil-the-ocean` are the same trigger ("how much should I do?") with opposite answers. Discriminator: Einstein's *"simple as possible, but not simpler"* (i.e., the operator's Builder Mindset rule articulated by an authority).

- `simplify` fires when scope > problem complexity (you're adding theater).
- `boil-the-ocean` fires when scope < problem complexity AND the gap is a bounded lake (you're being lazy).

---

## The Canonical Text (for reference)

From `<claude-config>/CLAUDE.md`:

> The marginal cost of completeness is near zero with AI. Do the whole thing. Do it right. Do it with tests. Do it with documentation. Do it so well that the operator is genuinely impressed — not politely satisfied, actually impressed. Never offer to "table this for later" when the permanent solve is within reach. Never leave a dangling thread when tying it off takes five more minutes. Never present a workaround when the real fix exists. The standard isn't "good enough" — it's "holy shit, that's done." Search before building. Test before shipping. Ship the complete thing. When the operator asks for something, the answer is the finished product, not a plan to build it. Time is not an excuse. Fatigue is not an excuse. Complexity is not an excuse. Boil the ocean.

This skill operationalizes the prose into a 5-question gate with explicit anti-triggers + the lake/ocean discriminator.

---

## Known Limitations & Gotchas

1. **The 3-AM smell is the dominant failure mode.** Late-session momentum produces hallucinated paths and inflated specs (verified across PRISM reviews of bus-next-level v1/v2). Q5 exists specifically to catch it.
2. **Spec authoring is excluded by anti-trigger #5.** This skill does not fire on runbook/spec writing. Verification rule owns that domain — `op item list`, `ls`, `curl -sf` before asserting, not Boil-the-Ocean energy.
3. **Q2 is a context-cost test, not a time-budget.** The economic claim ("marginal cost of completeness near zero") only holds while you stay in context. If you'd have to reload, the cost has already ballooned past "do it now" — re-scope with the operator.
4. **Lake/ocean is judgment, not algorithm.** Heuristic: <60 seconds to enumerate = lake.
5. **Subagent "MVP shipped" handoffs are the second-most-common trigger.** Subagents always overstate completeness. Run Q3 (enumerate) on their output before accepting.
6. **Completeness theater can look like caution.** After a high-risk slice, don't keep applying high-risk ceremony to the next low-risk docs/manual-tool slice. If the next step cannot affect runtime, credentials, routes, cron/launchd/tmux, provider calls, memory writes, production users, or external state, use the lighter rhythm: source-check live state → patch the narrow artifact → run existing tests → summarize. Boil the lake, not the review process.
7. **"Boil the ocean" on runtime/fleet work means split into lakes, not side-effect permission.** When the operator explicitly wants a broad runtime/gateway/fleet rationalization pushed forward, pair this skill with `command-deck`: define bounded lakes with artifacts and no-go boundaries, dispatch lanes, harvest/verify, then patch continuity anchors. Do not treat the phrase as permission for gateway migration, service stop/start, token/config mutation, OpenClaw revival, or rescue authority expansion. See `command-deck/references/lake-split-runtime-rationalization.md` for the Atlas runtime pattern.
7a. **In `/deck` PR waves, the merge/proof sequence can be the lake.** If remediation is bounded and the operator says “boil the ocean / merge and drive forward,” finish the already-defined lane: harvest the latest receipt, verify the exact blocker is fixed, run the smallest final source/diff/hygiene check, merge only the authorized PR if clean, verify remote main, and dispatch post-merge proof/frontier lanes. Do not broaden held Gate/runtime/live/provider/write surfaces, and do not skip a `NEEDS_REMEDIATION` verdict just because the operator says the review is done. See `command-deck/references/boil-the-ocean-merge-lake.md`.
8. **Prior recommendation polish can be a valid lake.** If the immediately preceding conversation identified a small optional-but-smart improvement (for example notification receipt cards with outcome/title/summary/next-action lines), and the operator says “what’s the boil-the-ocean version? do that,” treat that polish as the bounded lake before expanding to the next architectural slice. Execute the full enumerable polish across relevant outcomes, add exact-format tests first, verify, and stop before crossing into held oceans such as new dispatch senders, bus mirrors, runtime restarts, or deployment.
9. **Specialist-agent pilot suites need PASS/HOLD splits, not all-case theater.** For Grok-style prompt-realistic readiness work, boil the P0/P1 trust lake (live tool/cron/gateway checks, realistic prompt routing, safety negatives, artifact provenance, ledger behavior, rollback proof) and preserve lower-risk P1/P2 breadth or runtime/provider reliability as explicit holds. If provider no-first-byte loops block a negative test, send `/stop`, verify no bad write, and classify `TRANSPORT_BLOCKED / NO_BAD_WRITE` instead of burning prompts to force a fake PASS. If a prompt/instruction patch plus gateway restart still reruns `PARTIAL`, the next lake is proving prompt-load/tool-trace/answer-provenance before widening the suite. See `references/specialist-agent-pilot-suite-lakes.md`.
10. **Full-pass eval work may require rubric tightening, not just more cases.** When a readiness matrix has vague buckets like `PASS_WITH_CAVEAT`, convert caveats into positive evidence requirements, add harness tests, then re-score raw artifacts before reporting status. The clean shape is actionable verdicts (`PASS`, `PARTIAL`, `TRANSPORT_BLOCKED / NO_BAD_WRITE`, `FAIL`) with explicit provenance/relay/no-bad-write evidence. See `references/reliability-matrix-rubric-tightening.md`.
11. **“What’s left? Full pass. Boil the ocean.” is an execution request, not merely a summary request.** If a bounded verification lane is already running, the lake includes harvesting/polling it, rescoring raw artifacts, patching residual class failures, and updating the ledger before giving the final “what’s left” deck. Do not stop at “process still running” when available tools can close the loop. See `references/full-pass-reliability-campaigns.md`.
12. **Context compaction does not shrink the lake.** When a full-pass campaign crosses compaction, preserved todos/process IDs/run dirs/raw-artifact counts are the remaining-work contract. Reconcile every `in_progress` / `pending` item before closure; if the current task restricts operational tools, mark the campaign as still open while completing the skill/library pass. See `references/compaction-active-task-list-full-pass.md`.
13. **Operator lane focus beats broad boil-the-ocean energy.** If the operator narrows ownership mid-campaign (for example “you stay focused on Grok; the deck stays focused on memory”), treat that as an explicit scope cut and lane assignment. Boil only your assigned lake, do not keep harvesting sibling lanes or reporting their status unless asked. Preserve the split in the closeout: your lane proof, sibling lane delegated/held, and no implied cross-lane completion.

---

## Self-Test

After applying this skill, score yourself:

| # | Question | Y/N |
|---|----------|-----|
| 1 | Did I run Q1 (lake or ocean) before expanding scope? | |
| 2 | If ocean: did I flag + stop, not boil? | |
| 3 | If lake: did I enumerate Q3's list explicitly (not vibes-based)? | |
| 4 | Did I check Q4 honestly (laziness vs theater, not impression-management)? | |
| 5 | Did I check Q5 (momentum vs concrete incompleteness)? | |
| 6 | Did I respect anti-triggers (operator scope-cut, prototype, 3-AM, spec-authoring)? | |

**Target ≥5/6.** Below 4/6 = either skipped Q1 (boiled an ocean), skipped Q4 (slid into theater), or skipped Q5 (rode momentum past the lake's edge).

---

## Dependencies

- `simplify` — counter-balance skill; this is the don't-under-build to its don't-over-build.
- `verification-before-completion` — orthogonal gate; both must pass before ship.
- Karpathy P4 (in agent CLAUDE.md "Coding Discipline") — completion bar pairing.
- Builder Mindset (operator's `<claude-config>/CLAUDE.md`) — the engineering discriminator.

---

## Origin & Lineage

- **2026-02-07** — Garry Tan publishes the principle (essay + tweet + LinkedIn). Coins the inverse-framing of the traditional consultant idiom.
- **2026-04-13** — Alex Finn screenshots Tan's post and tweets the prompt; recommends adoption into SOUL.md.
- **2026-04-18** — Operator adopts into `<claude-config>/CLAUDE.md` (placed in CLAUDE.md, not SOUL.md).
- **2026-04-27** — Karpathy bridging note added to 4 agent CLAUDE.md files: *"Karpathy = completion bar, Boil the Ocean = quality bar."*
- **2026-05-08** — PRISM smell-pattern documented in `<workspace>/agents/terminal/analysis/prism/bus-next-level/2026-05-08-review.md`: unchecked Boil-the-Ocean energy reliably produces hallucinated paths + inflated specs. Anti-trigger #4 (3-AM smell) added.
- **2026-05-08** — Operationalized into this skill (5-question gate + anti-triggers + lake/ocean discriminator + Einstein anchor + laziness-vs-theater Q4 reframe per operator).

---

## The single load-bearing line

Everything should be made as simple as possible, but not simpler.

— Einstein

If you remember nothing else: **boil the lake fully, but don't add complexity the lake doesn't need.** The skill is laziness-detection (cut shortcuts) + theater-detection (cut performance), not impression-management.

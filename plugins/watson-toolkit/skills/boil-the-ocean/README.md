# boil-the-ocean

Don't ship 80% when the lake is finishable.

A meta-skill for completeness decisions. When you're about to add a TODO comment, ship a workaround, skip the tests, or leave a dangling thread — this skill asks the one question that matters: *is the missing piece a bounded lake I can finish now, or an ocean I should flag and stop at?*

## What it does

- Introduces the **lake/ocean discriminator** — the load-bearing distinction between bounded completeness (finish it) and unbounded scope (flag and stop)
- Runs a **5-question gate** at decision moments: lake or ocean → permanent solve available → enumerate the list → laziness vs theater check → 3-AM smell check
- Catches **two failure modes** in opposite directions: friction-driven shortcuts (laziness) and theater-driven additions (performance)
- Provides **explicit anti-triggers** so the skill doesn't become infinite-scope-creep license
- Pairs with `simplify` — both answer "how much should I do?" from opposite directions; Einstein's *"simple as possible, but not simpler"* is the discriminator

## Quick start

```
"use boil-the-ocean"
"/boil-the-ocean"
"am I shipping 80%?"
"is this a lake or an ocean?"
```

Invoke mid-work when you notice any of the trigger signals below — not at session start, not as a strategy session. This skill runs *around* other work.

## When to invoke

Fire on any of these signals in your own reasoning OR in a subagent's report:

| Signal | What's about to happen |
|--------|------------------------|
| `// TODO:` / `// FIXME:` / "we can revisit" | Ship a known incomplete piece |
| "for now" / "as a workaround" / "patch" | Ship a workaround instead of the real fix |
| "tests can come later" | Skip a bounded-lake test pass |
| "I'll document this once it's stable" | Skip a bounded-lake doc pass |
| "happy path is fine" / "edge cases are unlikely" | Skip enumerable edges |
| "good first cut" / "I'll let the operator decide" | Hand off a half-finished thread |
| "Here's how I would build it…" (plan instead of artifact) | Plan instead of ship |
| Subagent: "MVP shipped" / "first pass" / "rough draft" | Accept an incomplete handoff |
| `catch (e) {}` / silent error swallow | Stub error handling |

## The Lake / Ocean distinction

**Lake** = bounded completeness finishable in this session. Tests, edge cases, error paths, missing docs, the permanent fix vs the workaround, the dangling thread that takes 5 more minutes.

**Ocean** = unbounded scope. Full rewrites, multi-quarter migrations, platform overhauls, "while we're here, let's also rebuild X."

**Heuristic:** if you can enumerate the items in under 60 seconds, it's a lake. If listing requires a planning session, it's an ocean.

Recognize when the lake is boilable and refuse to leave it half-done. Flag oceans; do NOT boil them.

## The 5-question gate

**Q1. Lake or ocean?** If ocean → flag it (one-line note + carry-forward). Stop. Done. If lake → Q2.

**Q2. Permanent solve within current context?** Do you have the files loaded, state understood, tests reachable to do the permanent fix NOW? Yes → do it, skip Q3–Q5. No (would have to reload context) → re-scope with the operator. The economic claim ("marginal cost of completeness near zero") only holds while you stay in context.

**Q3. Enumerate the bounded completeness list.** Write it explicitly — tests / edge cases / error paths / docs / dangling thread / missing field. ≥1 concrete item → execute, cheapest first. Can't enumerate → it's not a lake. Ship. *"I'll do more good stuff" is not enumeration.*

**Q4. Laziness vs theater check.** Am I cutting corners (friction-driven shortcut) or adding to LOOK complete rather than BE complete (theater-driven addition)? Einstein's discriminator: *"everything should be made as simple as possible, but not simpler."* Cutting corners → finish the cut. Adding theater → simplify back. Honest completeness → ship.

**Q5. The 3-AM smell check.** Is the next thing coming from *"we have momentum and could also…"* or *"this concrete thing is incomplete"*? Momentum → STOP. Concrete incompleteness → continue.

## Anti-triggers (do NOT invoke for these)

1. **Operator scope-cut** — "Ship the core flow clean, then iterate." Respect it.
2. **Ocean territory** — multi-quarter rewrite, full migration, platform overhaul. Flag, do not boil.
3. **Throwaway prototype** — "spike," "explore," "rough draft to evaluate." Completeness is anti-goal.
4. **Late-session momentum (3-AM smell)** — long session + finding more "small additions." Stop. Snapshot. Defer.
5. **Unverified spec/runbook authoring** — completeness energy on specs without verifying live state produces hallucinated paths. `verification-before-completion` owns this domain.
6. **Animation polish on unshipped core** — ship the core flow first.
7. **Single-file bug fix with known root cause** — the fix IS the whole thing. Don't expand.

## Triad positioning

| Gate | Question | Fires when |
|------|----------|-----------|
| `verification-before-completion` | Is what I claim **true**? | About to claim done |
| `intellectual-honesty` | Am I sugarcoating? | About to assess |
| `boil-the-ocean` | Is what I shipped **whole**? | About to ship 80% |
| `simplify` | Did I add scope I didn't need? | About to over-build |

`simplify` and `boil-the-ocean` share the same trigger ("how much should I do?") and answer in opposite directions. The discriminator is always Einstein's line.

## Self-test (target ≥5/6)

| # | Question |
|---|----------|
| 1 | Did I run Q1 (lake or ocean) before expanding scope? |
| 2 | If ocean: did I flag + stop, not boil? |
| 3 | If lake: did I enumerate Q3's list explicitly (not vibes-based)? |
| 4 | Did I check Q4 honestly (laziness vs theater, not impression-management)? |
| 5 | Did I check Q5 (momentum vs concrete incompleteness)? |
| 6 | Did I respect anti-triggers (operator scope-cut, prototype, 3-AM, spec-authoring)? |

Below 4/6 = skipped Q1 (boiled an ocean), slid into theater, or rode momentum past the lake's edge.

## Pairs with

- `simplify` — counter-balance; this is the don't-under-build to its don't-over-build
- `verification-before-completion` — orthogonal gate; both must pass before ship
- `intellectual-honesty` — anti-sugarcoat gate; applies at assessment moments
- `baton` — when the lake genuinely can't be boiled this session, write a baton so the cold session picks it up

## Limitations

1. **The 3-AM smell is the dominant failure mode.** Late-session momentum produces hallucinated paths and inflated specs. Q5 exists specifically to catch it.
2. **Spec authoring is excluded by anti-trigger #5.** `verification-before-completion` owns that domain.
3. **Q2 is a context-cost test, not a time-budget.** The economic claim only holds while you stay in context.
4. **Lake/ocean is judgment, not algorithm.** Heuristic: <60 seconds to enumerate = lake.
5. **Subagent "MVP shipped" handoffs are the second-most-common trigger.** Subagents overstate completeness. Run Q3 on their output before accepting.

## File structure

```
boil-the-ocean/
├── SKILL.md        # Skill instructions + frontmatter
├── LICENSE.txt     # MIT
└── README.md       # This file
```

## License

MIT — see LICENSE.txt.

## Author

Jeremy Jannielli ([@jeremyknows](https://github.com/jeremyknows))

Operationalizes the Garry Tan (YC, 2026) completeness principle into a 5-question gate with explicit anti-triggers, the lake/ocean discriminator, and Einstein's "simple as possible, but not simpler" as the laziness-vs-theater bridge.

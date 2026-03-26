---
name: brainstorming
description: >
  Use before any creative work — creating features, building components, adding
  functionality, or modifying behavior. Explores user intent, requirements, and
  design before implementation. Produces an approved spec document and hands off
  to writing-plans.
  NOT FOR: debugging known bugs (use systematic-debugging), writing implementation
  plans (use writing-plans), executing existing plans (use executing-plans),
  trivial one-liner changes where design is obvious.
---

# Brainstorming Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or
take any implementation action until you have presented a design AND the user has
approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval.

---

## Checklist (complete in order)

1. **Explore project context** — check files, docs, recent commits
2. **Offer visual companion** (if topic will involve visual questions) — own message only, not combined with questions. See Visual Companion section.
3. **Ask clarifying questions** — one at a time; purpose, constraints, success criteria
4. **Propose 2–3 approaches** — with trade-offs and your recommendation
5. **Present design** — in sections scaled to complexity; get user approval after each section
6. **Write spec doc** — save to `plans/specs/YYYY-MM-DD-<topic>-design.md`, commit to git
7. **Spec review loop** — dispatch spec-document-reviewer subagent. *Read when: spec is written and ready for automated review.* `references/spec-document-reviewer-prompt.md`
8. **User review gate** — ask user to review the spec file before proceeding
9. **Transition** — invoke `writing-plans` skill to create the implementation plan

**The terminal state is invoking writing-plans.** Do NOT invoke any other implementation skill directly.

---

## Process Flow

```
Explore context
  → Visual questions ahead? → offer companion (own msg)
  → Clarifying questions (one at a time)
  → Propose 2–3 approaches
  → Present design (sections, approval after each)
  → Write spec doc → commit
  → Spec review loop (fix until Approved, max 3 iterations)
  → User review gate (wait for approval)
  → Invoke writing-plans
```

---

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent commits)
- Before asking questions, assess scope: if the request describes multiple independent subsystems, flag it immediately. Don't refine details of a project that needs decomposition first.
- If too large for one spec, help decompose into sub-projects: independent pieces, relationships, build order. Then brainstorm the first sub-project. Each sub-project gets its own spec → plan → implementation cycle.
- Ask questions one at a time. Prefer multiple-choice when possible.
- Focus on: purpose, constraints, success criteria.

**Exploring approaches:**
- Propose 2–3 different approaches with trade-offs
- Lead with your recommended option and explain why

**Presenting the design:**
- Scale each section to its complexity: a few sentences if straightforward, 200–300 words if nuanced
- Check after each section: "Does this look right so far?"
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify

**Design for isolation and clarity:**
- Break the system into units with one clear purpose, well-defined interfaces, independently testable
- For each unit: what does it do, how do you use it, what does it depend on?
- Can someone understand a unit without reading its internals? If not, the boundaries need work.

**Working in existing codebases:**
- Explore current structure before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work, include targeted improvements as part of the design.
- Don't propose unrelated refactoring. Stay focused on what serves the current goal.

---

## After the Design

**Writing the spec:**
- Save to `plans/specs/YYYY-MM-DD-<topic>-design.md`
- Commit to git before running the spec review loop

**Spec Review Loop:**
1. Dispatch spec-document-reviewer subagent — *Read when: ready to dispatch the reviewer.* `references/spec-document-reviewer-prompt.md`
2. If Issues Found: fix, re-dispatch, repeat until Approved
3. If loop exceeds 3 iterations, surface to human for guidance — the spec likely needs fundamental rethinking

**User Review Gate:**
After the spec review loop passes:
> "Spec written and committed to `<path>`. Please review it and let me know if you want any changes before we start the implementation plan."
Wait for user approval. If changes requested, make them and re-run the spec review loop.

**Transition to implementation:**
- Invoke `writing-plans` skill with the approved spec path
- Do NOT invoke any other skill.

---

## Visual Companion

A browser-based companion for showing mockups, diagrams, and visual options. Available as a tool — not a mode.

**When to offer:** When you anticipate visual questions (mockups, layouts, diagrams), offer once for consent:
> "Some of what we're working on might be easier to explain if I can show it to you visually. I can put together mockups, diagrams, comparisons as we go. Want to try it? (This can be token-intensive.)"

**This offer MUST be its own message.** Do not combine with questions or summaries. Wait for the user's response.

**Per-question decision:** Even after acceptance, decide FOR EACH QUESTION whether to use visual or text:
- **Visual:** mockups, wireframes, layout comparisons, architecture diagrams, side-by-side designs
- **Text:** requirements, conceptual choices, tradeoff lists, A/B/C/D options, scope decisions

A question about a UI topic is not automatically visual. "What does personality mean here?" → text. "Which layout works better?" → visual.

---

## Key Principles

- **One question at a time** — don't overwhelm
- **Multiple choice preferred** — easier to answer
- **YAGNI ruthlessly** — remove unnecessary features from all designs
- **Explore alternatives** — always propose 2–3 approaches
- **Incremental validation** — present design in sections, get approval
- **Be flexible** — go back and clarify when something doesn't make sense

---

## Known Limitations & Gotchas

1. **The HARD-GATE is the most violated rule.** The temptation to "just start" on a simple request is strong. Resist it. The design review catches more than it seems.
2. **One question at a time is load-bearing.** Batching multiple questions in one message feels efficient but causes users to skim and miss constraints. Treat each question as its own turn.
3. **Spec review loop can deadlock.** If the reviewer flags the same issue 3+ times, the spec has a structural problem — surface to human instead of looping indefinitely. Hard cap: 3 iterations.
4. **"Too large to spec" decomposition is often skipped.** When scope is ambiguous, there's pressure to just start clarifying. But if the project has independent subsystems, starting with the wrong one wastes the whole session. Decompose first.
5. **Visual companion is opt-in AND per-question.** Offering it once and then using it for every question defeats the purpose. Each visual question is a judgment call.
6. **Save path is Watson-specific.** Upstream obra uses `docs/superpowers/specs/`. Watson convention is `plans/specs/`. Never use the upstream path.
7. **Terminal state is writing-plans, nothing else.** It's tempting to invoke `build-feature` or `executing-plans` directly. Don't. Always route through `writing-plans` so there's a formal plan artifact.

---

## Dependencies

- `writing-plans` skill — mandatory next step after spec approval
- `git` — spec must be committed before review loop runs
- `canvas` tool — optional, for visual companion browser integration

---

## Autoresearch

**Baseline:** 11/14 (post-upgrade from 3/14)
**Last scored:** 2026-03-19

### 6-Question Spec Quality Scorecard

Run after each completed spec:
1. Did the spec go through at least one clarifying-question round before design? (yes/no)
2. Were 2–3 approaches proposed before settling on one? (yes/no)
3. Did the spec review loop run and return Approved? (yes/no)
4. Did the user explicitly approve the spec before writing-plans was invoked? (yes/no)
5. Is the spec scoped to a single implementation cycle (not multiple subsystems)? (yes/no)
6. Does the spec include: architecture, data flow, error handling, and testing? (yes/no)

**Target: 5+/6.** Below 4/6: spec was rushed — revisit before handing to writing-plans.

### Mutation Candidates

1. **Scope detection heuristic** — add a structured 3-question pre-check before clarifying questions begin: "Does this span multiple repos? Does it require more than one dev session? Does it have independent components?" If 2+: decompose before proceeding.
2. **Spec template** — provide a starter template structure in `references/spec-template.md` so specs are consistently formatted across sessions.
3. **Approach trade-off table** — standardize the 2–3 approaches step as a table (Approach / Trade-off / Recommended?) rather than prose. Makes comparison faster.

### Improvement Log

| Date | Version | Change | Score |
|------|---------|--------|-------|
| 2026-03-19 | 2.0.0 | Full rewrite from upstream obra — HARD-GATE, spec review loop, user review gate, visual companion, checklist, Gotchas/Deps/Autoresearch, Watson save path, NOT FOR list | 11/14 |

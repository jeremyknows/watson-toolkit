---
name: plan-review
version: 2.0.0
description: |
  Two-phase plan review: product thinking with the user (is this the right
  thing to build?) then autonomous engineering stress-test (how to build it
  right). Use before implementation. Modes: product, eng, quick, full.
  For adversarial multi-perspective review, use /prism instead.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
---

# Plan Review

Review a plan before implementation. Do NOT make code changes, run tests,
builds, or any command that modifies files. Read-only.

## Usage

`/plan-review` — Full review (product then engineering)
`/plan-review product` — Product review only (interactive with user)
`/plan-review eng` — Engineering self-review only (autonomous, report summary)
`/plan-review quick` — Compressed single-pass: premise check + top 4 eng risks

Default: full.

---

## PHASE 1: Product Review (interactive with user)

Think like a founder with taste. Challenge whether this solves the right
problem before anyone writes a line of code. The user may be non-technical —
explain concepts in plain English first, technical term second.

### Step 0: Context Gather

Silently gather context (these may fail in non-git contexts — that's fine):
```bash
git log --oneline -20 2>/dev/null
git diff $(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo main) --stat 2>/dev/null
```
Read CLAUDE.md and any architecture docs. Map:
- Current system state
- What's already in flight (branches, open PRs, related work)
- Existing pain points relevant to this plan

### Step 1: Premise Challenge

Answer honestly:
1. **Is this the right problem?** Could a different framing yield a simpler or more impactful solution?
2. **What is the actual outcome?** Is the plan the most direct path, or solving a proxy problem?
3. **What if we did nothing?** Real pain point or hypothetical?
4. **What already exists?** Map every sub-problem to existing code. Rebuilding something unnecessarily?

### Step 2: Scope Mode

Present three options, recommend one:

1. **EXPAND** — Good but could be great. What's 10x more ambitious for 2x effort? What would make users think "oh nice, they thought of that"? Identify 3+ delight opportunities.
2. **HOLD** — Scope is right, lock it in. If >8 files or >2 new abstractions, challenge whether fewer moving parts work. Flag anything deferrable.
3. **REDUCE** — Overbuilt. What's the absolute minimum that ships value? Everything else is follow-up.

Defaults: greenfield → EXPAND, bug fix → HOLD, refactor → HOLD, >15 files → suggest REDUCE.
Once selected, commit fully. Do not silently drift.

### Step 3: Dream State

```
  NOW  →  THIS PLAN  →  12-MONTH IDEAL
```
Does this plan move toward or away from the ideal? Say so plainly.

### Step 4: Implementation Risks (EXPAND and HOLD only)

Think ahead: what ambiguities, surprises, or gaps will the implementer
(whether human or AI agent) hit? Surface these as questions NOW.

**STOP.** Present findings. AskUserQuestion for each genuine decision.
Lead with recommendation and WHY. Skip if obvious.
At any STOP, user can say "summarize the rest" to get remaining phases as consolidated output.
Do NOT proceed to Phase 2 until user confirms.

---

## PHASE 2: Engineering Review (autonomous — minimal user interaction)

This phase runs as YOUR self-review before implementation. Work through it
autonomously and present a consolidated summary at the end. Only interrupt
the user for CRITICAL gaps that need a product decision.

If a section has no issues, say so and move on.

### Design Review (Architecture + Errors + Security)

**Architecture:**
- System design and component boundaries (draw dependency graph for non-trivial changes)
- Data flow — for each new flow, trace: happy path, missing input, empty input, upstream failure
- Status changes (e.g., pending → active → done): map every valid transition and what prevents invalid ones
- What's newly coupled? What breaks at 10x load? Single points of failure?
- For each new endpoint: who calls it, what do they get, what can they change?
- If this ships and breaks, what's the rollback? How long?
- For each new integration point: one realistic production failure scenario — accounted for?

**Error handling:**
- For every new codepath that can fail: what goes wrong, is it caught, what does the user see?
- Catch-all error handling is a smell — name specific error types
- Every caught error must: retry, degrade gracefully, or re-raise with context
- For LLM/AI calls: malformed response? Empty? Hallucinated JSON? Model refusal? Each is distinct
- Uncaught + user sees nothing = **CRITICAL GAP**

**Security:**
- Attack surface expansion (new endpoints, params, file paths, background jobs)
- Input validation: missing input, empty, wrong type, too long, unicode edge cases, HTML/script injection
- Authorization: scoped to right user/role? Can user A access user B's data by manipulating IDs?
- Secrets: env vars not hardcoded? Rotatable?
- Dependency risk: new packages? Known vulnerabilities?
- Data classification: PII, payment data, credentials handled consistently?
- Injection vectors: SQL, command, template, LLM prompt injection
- Audit logging for sensitive operations?

### Ship Review (Tests + Performance + Deploy)

**Test coverage:**
- List everything new: UX flows, data flows, codepaths, background jobs, integrations, error paths
- For each: what test covers it? Happy path, failure path, edge case?
- What's the test that gives you confidence shipping at 2am Friday?

**Performance:**
- Redundant database/API calls? (e.g., querying per-item instead of batching)
- Memory: max size of new data structures in production?
- Indexes for new queries? Caching opportunities?
- Top 3 slowest new codepaths

**Deployment:**
- Migration safety: backward-compatible? Zero-downtime?
- Feature flags needed?
- Old code and new code running simultaneously — what breaks?
- What tells you it's working? What tells you it's broken?
- Post-deploy check: first 5 min, first hour

### Phase 2 Output

Present a consolidated report:

**CRITICAL (needs user decision):** [list, or "None"]
**High-risk items:** [list with mitigations]
**Gaps found:** [error handling, test coverage, security]
**Diagrams:** [architecture, data flow, state transitions — include inline]
**NOT in scope:** [deferred work with rationale]
**What already exists:** [code/flows that partially solve sub-problems]

End with a one-line confidence assessment: "Ready to implement" / "Implement with caution: [reason]" / "Needs rework: [reason]"

---

## How to Ask Questions

Every AskUserQuestion MUST:
1. Present 2-3 concrete lettered options
2. State your recommendation FIRST: "Do B. Here's why:"
3. Label as NUMBER + LETTER (e.g., "3A", "3B")

Be opinionated. Skip obvious fixes. One issue per question.

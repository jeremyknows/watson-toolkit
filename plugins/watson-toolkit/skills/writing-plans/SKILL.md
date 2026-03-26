---
name: writing-plans
description: |
  Use when you have a spec or requirements for a multi-step task, before touching code.
  Trigger conditions: received a feature spec, user described a multi-step task, brainstorming
  skill just completed and produced a spec, or asked to "write a plan for" something.
  NOT FOR: single-file edits, bug fixes with known root cause (use systematic-debugging),
  exploratory prototypes, or tasks that don't require coordination across multiple files.
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for the codebase. Document everything they need: which files to touch for each task, complete code, testing steps, commands with expected output. Bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they're a skilled developer but know almost nothing about the toolset or problem domain. Assume they don't know good test design.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Before starting:** Verify you have an approved spec. If coming from `brainstorming`, it's at `plans/YYYY-MM-DD-<topic>-design.md`. If not — stop and run `brainstorming` first.

**⚠️ Don't plan on main/master.** This should run in a dedicated worktree (created by `brainstorming`). Both execution paths (`subagent-driven-development`, `executing-plans`) require an isolated workspace.

**Save plans to:** `plans/YYYY-MM-DD-<feature-name>.md`
*(User preferences for plan location override this default)*

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking into separate plans — one per subsystem. Each plan should produce working, testable software on its own. Don't plan an entire platform in one document.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file has one clear responsibility.
- Prefer smaller, focused files. You reason better about code you can hold in context at once.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If a file you're modifying has grown unwieldy, including a targeted split in the plan is reasonable — don't restructure unilaterally.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** Use `subagent-driven-development` (recommended) or `executing-plans`
> to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** [path to spec document]
**Goal:** [One sentence describing what this builds]
**Architecture:** [2-3 sentences about approach]
**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## Spike Task Format

For tasks where the approach is unknown before implementation, use a spike task first:

```markdown
### Task N (Spike): [Research Topic]

**Goal:** Determine [specific decision] so Task N+1 can proceed with confidence.
**Timebox:** [X minutes/hours]
**Output:** Update this plan with decision + rationale before proceeding.

- [ ] **Step 1:** Research [specific question]
- [ ] **Step 2:** Test minimal proof-of-concept
- [ ] **Step 3:** Document decision in plan: "Using X because Y"
- [ ] **Step 4:** Commit plan update
```

## Remember
- Exact file paths always
- Complete code in plan (not "add validation here")
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits
- Spec path in plan header — implementers need to verify against it

## Plan Review Loop

After writing the complete plan:

1. Dispatch a single plan-document-reviewer subagent — *read `references/plan-document-reviewer-prompt.md` when spawning the reviewer; it contains the exact prompt template.* Provide only: path to the plan document, path to the spec. Never pass your session history.
2. If ❌ Issues Found: fix the issues, re-dispatch reviewer for the whole plan
3. If ✅ Approved: proceed to execution handoff

**Review loop guidance:**
- Same session that wrote the plan fixes it (preserves context)
- If loop exceeds 3 iterations, the problem is likely the spec, not the plan — surface to human
- Reviewers are advisory — explain disagreements if you believe feedback is incorrect

## Execution Handoff

After the plan is saved and review-approved, offer execution choice:

> "Plan complete and saved to `plans/<filename>.md`. Two execution options:
>
> **1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review (spec compliance then code quality) between tasks. Fast, high-quality. Use `subagent-driven-development` skill.
>
> **2. Inline Execution** — execute tasks in this session with checkpoints. Use `executing-plans` skill.
>
> Which approach?"

**Model selection hint for subagent-driven:**
- 1-2 files, clear spec → cheap/fast model (haiku equivalent)
- Multi-file integration concerns → standard model (sonnet equivalent)
- Architecture/design judgment → most capable model (opus equivalent)

## Known Limitations & Gotchas

1. **Plan granularity trap:** Too granular for simple tasks = wasted time; too coarse for complex tasks = implementers stuck. Calibrate to complexity — a one-file change doesn't need 5 tasks.
2. **Scope creep during planning:** Flag "while we're at it" additions as optional or out-of-scope. Never silently include them.
3. **Review loop deadlock:** If reviewer keeps flagging the same issues after 3 iterations, the spec is the problem. Surface to human rather than rewriting the plan a 4th time.
4. **Missing spec = broken plan:** Writing-plans without an approved spec produces plans that don't match what was actually intended. Always start from a brainstorming-produced spec.
5. **Save path drift:** Upstream obra default is `docs/superpowers/plans/`. Watson convention is `plans/`. Don't mix these in plan headers.
6. **Non-code task adaptation:** For docs-only or infra-only tasks, the TDD loop doesn't apply. Keep the bite-sized step discipline but adapt the step types.
7. **Spike tasks are not optional when approach is unknown:** If you're guessing at implementation details while writing the plan, insert a spike task. Plans with embedded guesses produce blocked implementers.

## Dependencies

- `brainstorming` skill — must run first; produces the spec this skill consumes
- `subagent-driven-development` skill — recommended execution path after plan is written
- `executing-plans` skill — alternative execution path (single session, no subagent fan-out)
- `test-driven-development` skill — referenced in task steps for writing failing tests
- `references/plan-document-reviewer-prompt.md` — reviewer dispatch template (Plan Review Loop)

## Autoresearch

**Per-plan quality scorecard (run after plan complete, before handing off):**
1. Does every task have exact file paths? (yes/no)
2. Does every step have an exact command with expected output? (yes/no)
3. Is every task independently committable? (yes/no)
4. Does the plan cover all spec requirements without silent scope additions? (yes/no)
5. Did the plan-document-reviewer return Approved? (yes/no)
6. Is the plan saved to `plans/YYYY-MM-DD-<name>.md` with spec path in header? (yes/no)

**Target:** 6/6 before handing off to execution

**Log results:** *Read when: plan is complete and reviewer approved — append a row to `references/plan-quality-log.md`.* Date, plan filename, scorecard N/6, reviewer result, notes. This is the observability hook; without it autoresearch has no signal.

**Mutation candidates:**
1. Add a task dependency graph section for plans where task order matters (some tasks can't be parallelized)
2. Add explicit "rollback plan" section for high-risk destructive changes
3. Evaluate whether the plan-document-reviewer should also verify spec coverage explicitly (not just plan completeness)

**Improvement log:**

| Date | Version | Change | Score |
|------|---------|--------|-------|
| 2026-03-19 | 2.0.0 | Research obra/superpowers; added plan-document-reviewer-prompt.md, fixed namespace, save path, Gotchas/Deps/Autoresearch | 9/14 |
| 2026-03-19 | 2.1.0 | Added spike task format, spec path in header, model selection hint, "before starting" spec gate, worktree guard | 10/14 |
| 2026-03-19 | 2.2.0 | Added plan-quality-log.md (Q14 observability hook), log-results instruction in Autoresearch | 11/14 |

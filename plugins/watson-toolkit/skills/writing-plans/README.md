# writing-plans

Produce a complete, file-by-file implementation plan from an approved spec — detailed enough that an engineer with zero codebase context can execute it.

**Adapted from:** [obra/superpowers](https://github.com/obra/superpowers). Extended with taxonomy classification, health scoring, a scope check gate, a file structure mapping step, and explicit handoff paths for subagent-driven execution.

---

## What It Does

Takes an approved spec (typically from `brainstorming`) and writes a comprehensive implementation plan. The goal is a plan so complete that the person executing it — human or subagent — doesn't need to make any architectural decisions along the way. Every task is bite-sized. Every file to be touched is listed. Every command has expected output.

---

## When to Use

- After `brainstorming` produces an approved spec
- When you have requirements for a multi-step task and need to coordinate across multiple files
- When you want to hand off implementation to a subagent

**Not for:** single-file edits, bug fixes with known root cause (use `systematic-debugging`), exploratory prototypes, or tasks that don't require coordination across multiple files.

---

## The Handoff Chain

`brainstorming` → spec document → `writing-plans` → plan file → `executing-plans` or `subagent-driven-development`

Don't skip steps in this chain. Running `writing-plans` without an approved spec from `brainstorming` produces weaker plans because the design decisions haven't been made yet.

---

## What a Good Plan Contains

- **Scope check** — if the spec covers multiple independent subsystems, the skill suggests breaking into separate plans first
- **File structure map** — every file to be created or modified, with one-line descriptions of each file's responsibility
- **Bite-sized tasks** — each task produces a working, testable increment
- **Complete code** — not pseudocode or descriptions; actual implementation
- **Test steps** — what to run and what the expected output is
- **Commit points** — where to commit so progress is recoverable
- **No main/master** — the plan assumes a dedicated branch or worktree

---

## Output

A plan file at `plans/YYYY-MM-DD-<feature-name>.md`.

---

## Principles Applied

**DRY** — no duplicated logic between tasks. **YAGNI** — no speculative abstractions. **TDD** — tests come before or alongside implementation, not after. **Frequent commits** — never more than one logical change per commit.

---

## What We Changed

The original obra/superpowers version is a lean plan-writing instruction set. This version:

- Adds scope check gate (suggest splitting multi-subsystem specs)
- Adds explicit file structure mapping as a pre-task step
- Adds subagent handoff paths (`executing-plans`, `subagent-driven-development`)
- Adds requirement to save plans at a canonical path
- Adds taxonomy classification and health scoring

# brainstorming

Turn ideas into fully formed designs and approved specs through structured dialogue — before any code gets written.

**Adapted from:** [obra/superpowers](https://github.com/obra/superpowers). Extended with taxonomy classification, health scoring, a hard gate enforcement block, and handoff to `writing-plans`.

---

## What It Does

Guides a collaborative design conversation that ends with an approved spec document. The hard gate is the central rule: **no implementation action, no scaffolding, no code — until the user has seen and approved a design.** This applies to every project regardless of perceived simplicity.

---

## When to Use

- Before building any feature, component, or new behavior
- When you have an idea but not a design
- When you want to explore trade-offs before committing

**Not for:** debugging known bugs (`systematic-debugging`), writing implementation plans (`writing-plans`), executing existing plans (`executing-plans`), or trivial one-liner changes where design is genuinely obvious.

---

## How It Works

The skill runs through a structured checklist:

1. **Explore project context** — reads files, docs, recent commits before asking anything
2. **Offer visual companion** (if visual questions are expected) — separate message, not bundled
3. **Ask clarifying questions** — one at a time: purpose, constraints, success criteria
4. **Propose 2–3 approaches** — with trade-offs and a recommended path
5. **Write the spec** — once the user approves an approach, produces a spec document at `plans/YYYY-MM-DD-<topic>-design.md`
6. **Hand off to writing-plans** — spec becomes the input for implementation planning

---

## Output

An approved spec file at `plans/YYYY-MM-DD-<topic>-design.md`. This file is the contract between brainstorming and writing-plans — don't skip it.

---

## What We Changed

The original obra/superpowers brainstorming skill is a lean conversational loop. This version:

- Adds a hard gate block that prevents bypassing design for "simple" projects
- Adds taxonomy category and health scoring metadata
- Adds explicit subagent handoff pattern to `writing-plans`
- Adds visual companion offering as a discrete step

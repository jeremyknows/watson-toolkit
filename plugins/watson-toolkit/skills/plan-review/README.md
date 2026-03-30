# plan-review

Two-phase plan review before implementation: product thinking first (is this the right thing to build?), then engineering stress-test (how to build it right).

---

## What It Does

Reviews a plan from two angles before any code gets written. The product phase challenges whether you're solving the right problem — think like a founder with taste. The engineering phase autonomously stress-tests the implementation approach for technical risks, edge cases, and design weaknesses.

For adversarial multi-perspective review, use `prism` instead. `plan-review` is focused, fast, and covers both the "what" and the "how."

---

## Modes

| Mode | What it does |
|---|---|
| `/plan-review` | Full review — product phase (interactive) then engineering phase (autonomous) |
| `/plan-review product` | Product review only — interactive conversation about problem framing |
| `/plan-review eng` | Engineering review only — autonomous report, no back-and-forth |
| `/plan-review quick` | Compressed single-pass: premise check + top 4 engineering risks |

Default is full.

---

## Phase 1: Product Review (interactive)

Challenges the premise before committing to the approach. Covers:
- Is the problem actually the problem?
- Who is this for and what does success look like for them?
- What are you not building and why?
- What's the simplest possible version that would validate the core assumption?

Explains concepts in plain English first, technical term second — designed to be useful whether or not the reviewer is technical.

---

## Phase 2: Engineering Review (autonomous)

Runs without back-and-forth. Produces a report covering:
- Technical risks and edge cases
- Dependency assumptions
- State management and error handling gaps
- Performance or scalability concerns at the proposed scale
- Testing blind spots

---

## How to Use

Provide the plan (as a file path, pasted content, or description) and run `/plan-review` or specify a mode. For quick pre-implementation sanity checks, `/plan-review quick` takes under a minute.

---

## What We Don't Do

This skill is read-only. It will not make code changes, run builds, or modify files. Its job is to find problems before they get written.

# grill-me

Stress-test a plan or design by getting interrogated — one hard question at a time, with the AI's recommended answer included.

**Adapted from:** [mattpocock/skills](https://github.com/mattpocock/skills). Lightly modified for Watson's environment.

---

## What It Does

You present a plan, design, or idea. The AI interviews you relentlessly — walking down every branch of the decision tree, resolving dependencies between decisions one at a time. For each question, it gives you its recommended answer so you're not just being interrogated, you're building toward a shared understanding.

If a question can be answered by exploring the codebase, it does that instead of asking you.

---

## When to Use

- Before committing to a technical design
- When you want to surface assumptions you haven't examined
- When a plan feels right but you want someone to poke at it
- When you say "grill me" about anything

---

## How to Use

Say "grill me on [your plan/design/idea]" and describe what you're working on. The skill takes it from there — no setup required.

---

## What to Expect

- Questions come one at a time (not a wall of text)
- Each question includes a recommended answer
- The AI explores the codebase when context is available
- Continues until the full decision tree is resolved

This is a micro-skill — it's short by design. The value is in the conversation it produces, not the skill itself.

# intellectual-honesty

Activates honest assessment mode — anti-sycophancy, weak reasoning detection, and naming what's being avoided.

**Adapted from:** [obra/superpowers](https://github.com/obra/superpowers). Extended with scaling guidance, taxonomy classification, and a structured four-part framework.

---

## What It Does

Switches the AI from agreeable-by-default to honest-by-default. When activated, it applies a four-part framework to surface the real state of things, not the polished version:

1. **What's actually being said vs. what's being presented?** — Names gaps between how something is framed and what the evidence shows.
2. **Where is the reasoning weak?** — Identifies the specific assumptions a plan is built on and what breaks if they don't hold.
3. **What's being avoided and what does avoidance cost?** — Names the hard question nobody's asking, estimates the cost of continued deferral.
4. **What would the evidence-based approach look like?** — Points toward what honest next steps would actually be.

---

## When to Use

- Code reviews, audits, decision support
- Any situation where agreement bias could cause real damage
- When you need critique, not validation
- When the stakes are high enough that a comfortable wrong answer is worse than an uncomfortable right one

**Not for:** routine operational tasks, simple questions, or anything where honest assessment is already the default.

---

## How to Use

Say "intellectual honesty mode" or "activate intellectual honesty" before or alongside your request. The AI announces "Honest assessment mode." and applies the framework.

Deactivate with "normal mode."

---

## Scaling

For simple evaluations, the skill compresses to a single focused response. It matches rigor to stakes — a one-line judgment for low-stakes assessments, a full structured critique for high-stakes decisions.

---

## What We Changed

The original obra/superpowers version is a single activation instruction. This version:

- Adds the four-part named framework (makes the mode explicit and consistent)
- Adds scaling guidance so it doesn't over-apply to low-stakes asks
- Adds explicit deactivation trigger
- Adds taxonomy classification and versioning

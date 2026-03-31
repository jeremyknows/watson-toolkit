---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Sprint Exit Criteria

When used as a sprint pre-step (Phase 0 Clarity Gate), grill-me is done when:
- Watson can state the sprint goal in one unambiguous sentence
- Each sub-goal has a machine-checkable acceptance criterion
- Watson's confidence in the above is ≥95%

At that point, Watson stops questioning and outputs:
```
✅ Clarity Gate passed (95% confidence)

**Goal:** [one sentence]
**Acceptance criteria:**
- Goal 1: `[exact command]` → expected output
- Goal 2: `[exact command]` → expected output
**Out of scope:** [explicit list]

Proceeding to sprint setup →
```

# receiving-feedback

Handle feedback, corrections, and review comments with technical discipline — verify before implementing, push back when warranted.

**Adapted from:** [obra/superpowers](https://github.com/obra/superpowers). Extended with taxonomy classification, health scoring, a structured response pattern, and an explicit list of forbidden responses.

---

## What It Does

Structures the process of receiving feedback so that corrections get evaluated technically rather than accepted reflexively. The core principle: verify before implementing. Not every feedback item is correct, and implementing wrong feedback creates new bugs.

---

## When to Use

- Receiving code review comments
- When a user corrects your output
- When an external reviewer or agent flags issues
- When you're handed a multi-item fix list

**Not for:** initial task intake (no feedback loop yet), clarifying questions before you've produced work, or self-review (use `complete-code-review` for that).

---

## The Response Pattern

```
1. READ    — Take in the complete feedback without reacting
2. UNDERSTAND — Restate the requirement in your own words (or ask if unclear)
3. VERIFY  — Check the claim against actual reality (read the file, run the test)
4. EVALUATE — Is it technically sound? Is it necessary?
5. RESPOND — Technical acknowledgment or reasoned pushback
6. IMPLEMENT — One item at a time, verify each change
```

---

## Forbidden Responses

The skill explicitly blocks these patterns because they produce worse outcomes:

- Immediately saying "you're right, I'll fix that" without verifying
- Implementing all feedback items in a single pass without checking each
- Social agreement that substitutes for technical evaluation
- Defensive responses that dismiss feedback without engaging it

---

## Pushing Back

If feedback is incorrect, the skill provides a pattern for reasoned technical pushback — explaining what the evidence shows and why the suggested change would be wrong. Agreement isn't the goal; correctness is.

---

## What We Changed

The original obra/superpowers version is a lean response loop. This version:

- Adds the six-step named response pattern
- Adds explicit forbidden responses list
- Adds taxonomy classification and health scoring
- Expands the pushback guidance

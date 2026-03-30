# systematic-debugging

Find the root cause before attempting any fix. Four structured phases that stop random guessing.

**Adapted from:** [obra/superpowers](https://github.com/obra/superpowers). Extended with taxonomy classification, health scoring, and the Iron Law enforcement block.

---

## What It Does

Runs a four-phase debugging process that forces root cause identification before any fix gets proposed. The Iron Law: **complete Phase 1 before proposing fixes.** Skip it and you're guessing faster, not debugging better.

---

## When to Use

- Any test failure, production bug, or unexpected behavior
- Performance regressions, build failures, integration errors
- **Especially** when you're under time pressure and "just one quick fix" feels obvious
- When you've already tried multiple fixes that didn't work

**Not for:** feature development, documentation review, or bugs you've already diagnosed and confirmed with evidence.

---

## The Four Phases

### Phase 1: Root Cause Investigation
Read the error messages carefully. Form a hypothesis. Check the last change that could have caused this. Verify the hypothesis with the simplest possible test before moving on. **This phase is blocking — do not skip it.**

### Phase 2: Scope Assessment
Once you have a root cause hypothesis, determine: how wide is the impact? Are there other places this same pattern exists? Is this a symptom of a deeper issue?

### Phase 3: Fix Design
Design a fix that addresses the root cause, not just the symptom. Consider what the fix might break. Write the fix before applying it.

### Phase 4: Verification
Apply the fix. Verify it resolves the original issue. Check that it didn't introduce new failures. Document what was found and what was changed.

---

## How to Trigger

Describe any bug, test failure, or unexpected behavior. The skill activates automatically when you're investigating a problem — you don't need to invoke it explicitly. It's also triggered when you're about to "just try something" without having verified a root cause.

---

## What We Changed

The original obra/superpowers version is a lean four-phase checklist. This version:

- Adds the Iron Law block (Phase 1 is explicitly blocking)
- Adds a "use this ESPECIALLY when under time pressure" callout
- Adds taxonomy classification, health scoring, and versioning
- Expands the scope assessment phase

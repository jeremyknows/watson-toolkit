# Baton Example — Shape and Density Reference

This is a shape reference. A strong baton was extracted from a real ~580-line, 14-section continuation prompt that proved cold-session-executable in practice — this doc preserves that shape so future batons can match it.

**Stats reference:**
- ~580 lines / ~46 KB for a substantive multi-step session (200-400 lines is fine for single-step work).
- 14 numbered top-level sections plus a 60-second context recap above them.
- Drafted, then audited (gaps closed), then dry-run as a cold session (friction-points closed) before shipping.

---

## What a strong baton carries

- **Cold-start reads** — an ordered list of 8-12 anchor docs with EXISTS/GREENFIELD status per file. Path-explicit, never "see prior session."
- **Review synthesis** — if a review pass produced findings, the baton points at the archive, summarizes the verdict, and counts open findings, so a cold session knows what's ratified vs. what's still open.
- **Mechanical fixes inline** — N specific edits with embedded commands, filters, or locations. Applicable from the prompt alone, or a pointer to the archive's full reasoning.
- **Decision flags** — N decisions surfaced but not resolved, each with full trade-off context and a recommended answer. A cold session can act from the flag spec alone.
- **Step-by-step execution** — per-step files, schemas, embedded commands, verification commands, commit-message templates. Each step ends with "how do I know this worked?" as a 1-line check.
- **War stories durable across sessions** — load-bearing lessons from THIS session the next session must inherit.
- **Self-test** — a boolean checklist that defines "done," mirroring the war-story lessons.

---

## A miniature worked example

Here is a compact baton for a small, well-scoped session — a single feature with one open decision. It shows the shape at ~120 lines without the placeholders.

```markdown
# Next-Session Prompt — Add rate-limit backoff to the auth client

**One-line goal:** Add exponential backoff to the auth token-refresh client and
add a regression test. **Do NOT refactor the wider auth module — backoff only.**

**Spec/anchor file paths:** `src/auth/refresh-client.ts`, `docs/auth-design.md`.

## 60-second context recap (read FIRST)

**Where we are:** Prior session found the token-refresh endpoint rate-limits
after 3 calls within 60 seconds. The client currently retries immediately with
no backoff, which makes the rate-limit worse. The fix is scoped and known; it
was not implemented because the session ran out of time after diagnosis.

**User-stated direction (verbatim):**
- *"Backoff starting at 2s, double each retry, cap at 3 retries."* — set in review.
- *"Don't touch the retry logic in the upload client, that one is fine."*

**War-story durability:** A prior backoff change shipped without a test and
silently regressed when a refactor removed the delay six weeks later. This
session MUST add the regression test, not just the backoff.

**This session's 3-step shape:**
1. Add backoff to `refresh-client.ts` (2s base, x2, cap 3).
2. Add a regression test asserting the delay sequence.
3. Update the design doc's retry section.

If you finish all 3 and tests pass, you ship this session. Do not do more.

## DO NOT (read this first)

1. **DO NOT touch `src/upload/retry.ts`** — the user explicitly excluded it.
2. **DO NOT skip the regression test** — see war story above.
3. **DO NOT change the retry cap** — it is 3 per user direction, not a guess.

## 0. Session opening (cold start)

### 0.1 Read first (in order)
1. `docs/auth-design.md` §Retry — EXISTS — current (no-backoff) behavior.
2. `src/auth/refresh-client.ts` — EXISTS — the file you edit.
3. `src/auth/__tests__/refresh-client.test.ts` — EXISTS — where the new test goes.

### 0.2 System state expected at session start
| Component | Expected state |
|---|---|
| Test suite | Green on main (run `npm test` to confirm before editing) |
| `refresh-client.ts` | Retries immediately, no delay — the thing you're fixing |

If the suite is red before you start, STOP and report — don't build on a broken base.

### 0.3 Tools required
```bash
which node npm
```

## 1. Execution

### 1.1 Add backoff (refresh-client.ts)
In the retry loop, replace the immediate retry with:
delay = min(2000 * 2 ** attempt, cap); await sleep(delay); cap retries at 3.
Verify: `npm test -- refresh-client` (existing tests still green).

### 1.2 Add the regression test
Assert the delay sequence is [2000, 4000, 8000] and that a 4th attempt does NOT fire.
Verify: `npm test -- refresh-client` (new test passes).

### 1.3 Update the design doc
Replace the "retries immediately" line in `docs/auth-design.md` §Retry with the
backoff description. Commit: "fix(auth): exponential backoff on token refresh".

## 2. Decision flag (surface, then wait)

> Should backoff use jitter (randomized delay) to avoid thundering-herd, or fixed
> doubling? **Fixed doubling** is simpler and matches user direction; **jitter**
> is more robust under concurrent clients but adds nondeterminism the test must
> tolerate. Recommended: fixed doubling now; open a follow-up if herd issues appear.

## 3. Self-test before declaring complete

- [ ] `npm test` is fully green
- [ ] New test asserts the [2000, 4000, 8000] sequence and the no-4th-attempt cap
- [ ] `git log` shows the backoff commit
- [ ] `docs/auth-design.md` §Retry no longer says "retries immediately"

The self-test exists because a prior backoff change regressed silently with no
test guarding it. The test in 1.2 is the guard.
```

---

## What "cold-session-executable" actually means

A cold session opens the baton with **zero context** from the prior session. They read it top-to-bottom and:

1. Within 60 seconds, know **where am I, what just happened, what do I do next** (the recap earns its name).
2. Within 5 minutes, have **read the cold-start anchor docs** and run the verification check.
3. From there, every "do X" instruction carries the **exact command, file path, and verification check** — no composing required.

If a cold session ever has to ask "what does this mean?" or "where's the script?", the baton failed an audit point. Step 3 (the cold-session dry-run) exists specifically to catch those gaps before shipping.

---

## Why longer is the upper end, not the floor

| Session shape | Baton size |
|---|---|
| Single bug fix, known root cause | 100-200 lines |
| Single feature, well-scoped | 200-400 lines |
| Multi-step execution + decision flags | 400-600 lines |
| Architectural reframe + N fixes + M decision flags + multi-substep execution | 580+ lines |

The cost of a long-but-explicit baton is 5 minutes of cold-session reading. The cost of a short-but-vague baton is hours of misdirection. Bias to longer when in doubt — the dry-run will catch any theater.

---

## Use as a template

1. Copy `references/template.md` as your starting structure.
2. Fill in the session-specific content per Step 1 of the SKILL.md procedure.
3. Run the self-audit (Step 2) — score against the 9-question rubric.
4. Cold-session dry-run (Step 3) — walk through as if you've never seen the work; catch every "compose this yourself" gap.
5. Apply gap-closure fixes (Step 4).
6. Score the self-test and cite the baton path in your wrap-up (Step 5).

The shape above is what passes self-test ≥7/9. Anything less is iteration territory — don't ship until the bar's met.

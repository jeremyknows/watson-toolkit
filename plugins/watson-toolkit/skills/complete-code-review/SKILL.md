---
name: complete-code-review
description: >
  Full code review lifecycle — requesting reviews, multi-agent analysis,
  processing feedback with anti-sycophancy discipline, and applying valid fixes.
  Use when: (1) reviewing a PR or changeset, (2) performing automated multi-agent
  analysis, (3) processing review feedback you've received, (4) determining whether
  to push back on a reviewer suggestion.
  NOT for: drafting code changes (use build-feature), reviewing documentation only,
  or urgent hotfixes where review would block deployment.
license: MIT
metadata:
  author: jeremyknows
  version: "1.2.0"
  category: "Code Quality & Review"
---

# Complete Code Review Cycle

## Overview

Code review has two distinct phases that require different skills:

1. **Performing Reviews** — Multi-agent analysis with confidence scoring
2. **Receiving Reviews** — Anti-sycophancy discipline when processing feedback

Both phases require technical rigor. Neither requires performative agreement.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPLETE CODE REVIEW CYCLE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   REQUEST REVIEW                                                    │
│        │                                                            │
│        ▼                                                            │
│   ┌─────────────────────────────────────────────────────────┐      │
│   │  MULTI-AGENT ANALYSIS (parallel)                        │      │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │      │
│   │  │ CLAUDE.md│ │  Bug     │ │ History/ │ │  Code    │   │      │
│   │  │ Compliance│ │ Detection│ │ Blame    │ │ Comments │   │      │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │      │
│   │        │            │            │            │         │      │
│   │        └────────────┴────────────┴────────────┘         │      │
│   │                          │                              │      │
│   │                          ▼                              │      │
│   │              CONFIDENCE SCORING (0-100)                 │      │
│   │                          │                              │      │
│   │                          ▼                              │      │
│   │              FILTER (threshold: 80+)                    │      │
│   └─────────────────────────────────────────────────────────┘      │
│        │                                                            │
│        ▼                                                            │
│   RECEIVE FEEDBACK                                                  │
│        │                                                            │
│        ▼                                                            │
│   ANTI-SYCOPHANCY PROCESSING                                       │
│   ┌─────────────────────────────────────────────────────────┐      │
│   │ 1. READ without reacting                                │      │
│   │ 2. UNDERSTAND (restate in own words)                    │      │
│   │ 3. VERIFY against actual reality                        │      │
│   │ 4. EVALUATE (technically sound? necessary?)             │      │
│   │ 5. RESPOND (technical acknowledgment or pushback)       │      │
│   │ 6. IMPLEMENT (one at a time, verify each)               │      │
│   └─────────────────────────────────────────────────────────┘      │
│        │                                                            │
│        ▼                                                            │
│   APPLY VALID FIXES                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependencies

This skill requires or references the following external capabilities:

| Dependency | Type | Used For |
|------------|------|----------|
| Parallel agent spawn | Agent tool (Cowork), Task tool (CC), `sessions_spawn` (OpenClaw) | Spawning 5 parallel review agents |
| `gh` CLI | External binary | Fetching PR history, past comments, blame |
| `git` CLI | External binary | History/blame context for Agent #3 |
| `receiving-feedback` skill | Optional skill | Deeper anti-sycophancy protocol (optional upgrade) |

**Spawn templates:** *Read when: spawning any of the 5 review agents — exact prompts for each agent.* `references/agent-spawn-templates.md`
**Quality scoring:** *Read when: review is complete and you need to score output quality.* `references/review-quality-checklist.md`
**Offline harness proof-quality:** *Read when reviewing local/offline runtime, routing, privacy, or gate harnesses before any live smoke decision.* `references/offline-harness-proof-review.md`
**Post-integration static sites:** *Read when a static/exported marketing or portfolio site has been manually integrated and needs final packaging/review-readiness.* `references/post-integration-static-site-review.md`

**Pre-PR proof packages:** *Read when a local PR candidate is packaged but not pushed/opened yet, especially when evidence artifacts, privacy scans, gate/status anchors, or PR body copy must be reviewed alongside source/tests.* `references/pre-pr-proof-package-review.md`

**Thermo-nuclear code quality review:** *Read when the user asks for a thermonuclear/thermo-nuclear/especially harsh maintainability review, or when a gated infrastructure PR must be reviewed for structural simplification before merge.* `references/thermonuclear-review-rubric.md`; for the full standalone skill, load `thermo-nuclear-code-quality-review`

---

## Part 1: When to Request Which Review Type

### Automated Review (Multi-Agent)

**Use when:**
- PR has meaningful code changes
- Need comprehensive coverage fast
- Want to catch CLAUDE.md/guideline violations
- PR touches critical code paths
- Multiple contributors involved

**Skip when:**
- PR is draft or closed
- Trivial/automated changes (version bumps, lockfile updates)
- Urgent hotfixes requiring immediate merge
- Already reviewed

### Human Review

**Use when:**
- Architectural decisions need validation
- Business logic requires domain knowledge
- Security-critical changes
- Ambiguous requirements need interpretation
- Automated review flagged issues you're unsure about

### Self-Review

**Use when:**
- Quick sanity check before submitting
- Learning exercise (review own code critically)
- No other reviewers available
- Small, low-risk changes

Self-review has inherent blind spots. Treat your own code as if someone else wrote it.

---

## Part 2: Performing Multi-Agent Review

### Review Modes

Pick the mode that matches the PR's risk level. Say it naturally:

| Mode | Agents | Say This | When to Use |
|------|--------|----------|-------------|
| **Quick** | 3 (#1, #2, #3) | "Quick review" / "3-agent review" | Routine PRs, files you know well, minor changes |
| **Standard** | 5 (all) | "Code review" / "Full review" / "5-agent review" | Feature sprints, multi-file PRs, first-in-prod code |
| **Focused** | 2 (#2, #3) | "Bug check" / "Focused review" | Tiny PRs, sanity checks, time-scarce |

**Why these groupings:**

| Agent | Signal | Cost | In Quick | In Standard | In Focused |
|-------|--------|------|----------|-------------|------------|
| #1 CLAUDE.md Compliance | Catches guideline violations | Medium (reads docs + diff) | ✓ | ✓ | |
| #2 Bug Detection | Catches real bugs (highest-value) | Medium (reads diff deeply) | ✓ | ✓ | ✓ |
| #3 History/Blame | Catches regressions | Medium (runs git commands) | ✓ | ✓ | ✓ |
| #4 Previous PRs | Catches recurring issues | High (gh API calls, slow) | | ✓ | |
| #5 Code Comments | Catches stale/lying comments | Low (reads diff) | | ✓ | |

**Agents #2 + #3 are always included** — bugs and regressions are the two categories most
likely to ship undetected. #1 (compliance) joins in Quick mode because guideline drift
compounds across sprints. #4 + #5 are Standard-only because they have the highest
false-positive rates and require more verification work from the receiver.

**Estimated cost by mode** (Sonnet, ~2000-line diff):
- Focused: ~$0.20, ~1 min
- Quick: ~$0.40, ~1.5 min
- Standard: ~$0.70, ~2 min

### Agent Architecture

| Agent | Focus | What It Checks |
|-------|-------|----------------|
| #1 | CLAUDE.md Compliance | Guideline adherence |
| #2 | Bug Detection | Obvious bugs in changes only |
| #3 | History/Blame | Context from git history |
| #4 | Previous PRs | Comments from past PRs on same files |
| #5 | Code Comments | Compliance with inline guidance |

> **Spawn templates:** *Read when: spawning multi-agent review — exact prompts for each agent.* `references/agent-spawn-templates.md`

### Confidence Scoring

Each issue scored independently 0-100:

| Score | Meaning | Action |
|-------|---------|--------|
| 0–50 | Unverified, minor, or false positive | Filter out |
| 75 | Verified real, important | Keep |
| 80–100 | Definitely real, significant impact | Keep — report this |

**Threshold floor: 80+** — agents never score below 80 for a reportable issue.

### Threshold tuning by review context

Higher threshold = fewer findings, better signal-to-noise. Lower threshold =
more findings, more verification work for the receiver. Pick based on stakes:

| Context | Recommended threshold | Why |
|---------|----------------------|-----|
| Routine PR on mature codebase | **85** | Filter the weakest findings; reduce verification overhead |
| First-in-prod feature | 80 | Maximize catch rate; accept some noise |
| Security-sensitive change | 80 | Same — false positives are cheaper than missed exploits |
| Irreversible architecture decision | 80 | Same — once shipped, hard to un-do |
| Quick sanity pass on minor change | 90 | Only surface clear wins |

**Observed signal/noise ratios from real runs:**
- At 80: ~40% actionable (majority either need pushback or are nice-to-haves)
- At 85: ~60% actionable
- At 90: ~75% actionable but coverage drops meaningfully

Raising the threshold doesn't reduce the cost of running the 5 agents — they
still spawn. It only affects what gets surfaced. If the goal is fewer agents
(cheaper reviews), drop to 3-agent mode (skip #3 and #4 when files are new).

### What Gets Filtered (False Positives)

- Pre-existing issues (not introduced in this PR)
- Something that looks like a bug but isn't
- Pedantic nitpicks
- Issues linters/typecheckers catch automatically
- General quality improvements (unless in CLAUDE.md)
- Issues with explicit lint-ignore comments
- Intentional functionality changes
- Issues on unmodified lines

### Review Output Format

```markdown
### Code review

Found N issues:

1. <brief description> (CLAUDE.md says "<quote>")
   <link to file with full SHA and line range>

2. <brief description> (bug due to <evidence>)
   <link to file with full SHA and line range>

🤖 Generated with [Claude Code](https://claude.ai/code)
```

---

## Part 3: Receiving Feedback (Anti-Sycophancy)

### The Response Pattern

```
WHEN receiving feedback:

1. READ: Complete feedback without reacting
2. UNDERSTAND: Restate requirement in own words (or ask)
3. VERIFY: Check against actual reality
4. EVALUATE: Technically sound? Necessary?
5. RESPOND: Technical acknowledgment or reasoned pushback
6. IMPLEMENT: One item at a time, verify each
```

### Responses to Avoid

Performative agreement adds noise and signals you haven't verified:
- "You're absolutely right!" → just fix it
- "Great point!" / "Excellent feedback!" → unnecessary
- "Let me implement that now" before verifying → verify first

If the feedback is correct: restate what you're fixing and fix it.  
If it's wrong: push back with technical reasoning.  
If it's unclear: ask before doing anything.

### Source-Specific Handling

#### From Automated Review (Your Own Multi-Agent)
- High confidence (80+) but still verify
- Check if context was missing from agents
- Automated ≠ infallible

#### From Human Reviewers
- More likely to have domain context
- Still verify technical correctness
- Ask if suggestion seems wrong for your context

#### From External Sources (Watchers, Other Agents)
```
BEFORE implementing:
  1. Check: Technically correct for THIS context?
  2. Check: Breaks existing functionality?
  3. Check: Reason for current implementation?
  4. Check: Does source understand full context?

IF suggestion seems wrong:
  Push back with technical reasoning
```

### When to Push Back

Push back when:
- Suggestion breaks existing functionality
- Source lacks full context
- Violates YAGNI (unused feature)
- Technically incorrect for this system
- Legacy/compatibility reasons exist
- Conflicts with architectural decisions

**How to push back:**
```
✅ "Checking... this code handles edge case X. Removing would break Y. 
    Keep it, or handle X differently?"
✅ "This conflicts with [prior decision]. Should I [A] or [B]?"
✅ "I can't verify this without [X]. Should I investigate?"

❌ Defensive tone
❌ Blind disagreement without evidence
```

### Handling Unclear Feedback

```
IF any item is unclear:
  STOP - do not implement anything yet
  ASK for clarification on ALL unclear items

WHY: Items may be related. Partial understanding = wrong implementation.
```

**Example:**
```
Review: "Fix issues 1-6"
You understand 1,2,3,6. Unclear on 4,5.

❌ WRONG: Implement 1,2,3,6 now, ask about 4,5 later
✅ RIGHT: "I understand items 1,2,3,6. Need clarification on 4 and 5 
          before proceeding."
```

---

## Part 4: Applying Valid Fixes

### Implementation Order

```
FOR multi-item feedback:
  1. Clarify anything unclear FIRST
  2. Then implement in this order:
     - Blocking issues (breaks, security)
     - Simple fixes (typos, config)
     - Complex fixes (refactoring, logic)
  3. Verify each fix individually
  4. Check no regressions
```

### Acknowledging Correct Feedback

When feedback IS correct:
```
✅ "Fixed. [Brief description of what changed]"
✅ "Good catch — [specific issue]. Fixed in [location]."
✅ [Just fix it and show the result]

❌ "You're absolutely right!"
❌ "Great point!"
❌ "Thanks for catching that!"
```

Actions speak. The result shows you heard.

### Gracefully Correcting Your Pushback

If you pushed back and were wrong:
```
✅ "You were right — I checked [X] and it does [Y]. Implementing now."
✅ "Verified this and you're correct. My initial understanding was wrong. Fixing."

❌ Long apology
❌ Defending why you pushed back
❌ Over-explaining
```

State the correction factually and move on.

---

## Complete Example Flow

### 1. Request Review
```bash
# On a PR branch
/code-review
```

### 2. Multi-Agent Analysis Runs
```
Agent #1 (CLAUDE.md): Found 2 issues
Agent #2 (Bugs): Found 1 issue  
Agent #3 (History): Found 0 issues
Agent #4 (Past PRs): Found 1 issue
Agent #5 (Comments): Found 0 issues

Scoring:
- Issue A: 85 ✓
- Issue B: 45 ✗ (filtered)
- Issue C: 90 ✓
- Issue D: 25 ✗ (filtered)
```

### 3. Receive Feedback
```markdown
### Code review

Found 2 issues:

1. Missing error handling for OAuth callback (CLAUDE.md says "Always handle OAuth errors")
   https://github.com/owner/repo/blob/abc123/src/auth.ts#L67-L72

2. Race condition in state cleanup (bug due to missing await)
   https://github.com/owner/repo/blob/abc123/src/auth.ts#L88-L95
```

### 4. Process with Anti-Sycophancy
```
READ: Two issues flagged, both confidence 85+

UNDERSTAND:
- Issue 1: OAuth callback lacks try/catch
- Issue 2: Cleanup runs async without await

VERIFY:
- Issue 1: ✓ Confirmed — no error handling present
- Issue 2: ✓ Confirmed — race condition possible

EVALUATE:
- Both technically valid
- Both should be fixed

RESPOND: [proceed to implement]
```

### 5. Apply Fixes
```
1. Add try/catch to OAuth callback
   → Test: OAuth error now handled gracefully ✓

2. Add await to cleanup call
   → Test: Race condition eliminated ✓

No regressions found.
```

### 6. Response
```
Fixed both issues:
- Added error handling to OAuth callback (src/auth.ts:67)
- Added await to cleanup call (src/auth.ts:88)
```

---

## Known Limitations & Gotchas

**Multi-agent review requires git context.** Agent #3 (History/Blame) and Agent #4 (Past PRs) need `gh` CLI auth and a cloned repo. In environments without git access, skip those two agents and note the gap in the review output.

**Freeze and re-check review scope.** Before spawning reviewers, write a scope manifest with repo path, branch, HEAD, commit list, and dirty state. After reviewers return, re-run `git status --short --branch`, `git rev-parse HEAD`, and `git log --oneline <frozen_head>..HEAD` for the same repos before finalizing. If a branch moved or a new commit appeared during the review, review that delta as an addendum, rerun the relevant/full verifier set at the new HEAD, and state the concurrency caveat; do not silently claim the original bundle covered it. If the new commit fixes a finding, update the report verdict from "hold" to "pass after local fix" only after verifying the new HEAD, and explicitly call out any PR body/evidence artifacts that still cite the old HEAD.

**Analysis-only reviews can still create incidental file changes.** Verification commands may mutate generated/framework files even when the user allowed analysis/report only (for example a production build touching a generated type stub). Before finalizing, compare the final dirty state with the frozen scope. Revert only incidental tool-generated changes you caused, explicitly note that cleanup in the report, and leave all user/source changes untouched.

**Confidence scoring is subjective.** Two agents may score the same issue differently. When scores conflict, use the lower score; err toward filtering rather than noise.

**Anti-sycophancy can feel cold to human reviewers.** When processing human feedback without performative acknowledgment, clarify your approach if the reviewer seems confused: "I verify before implementing — I'll confirm what I'm fixing and why."

**CLAUDE.md may not exist.** Some repos have no guidelines file. Agent #1 should skip gracefully and note the absence in its output. Don't invent guidelines.

**History-reversal bugs are easy to miss.** Agent #3 is the only one checking for "this PR accidentally un-does a prior fix." Don't skip it just because history review feels slow — this is where the highest-signal, hardest-to-spot bugs hide.

**Self-review blind spots are real.** Performing a review on your own code: declare upfront that you're self-reviewing and lower your confidence threshold to 70+ (you're more likely to rationalize your own choices).

**Review before the next architecture slice.** When a completed slice naturally reveals a tempting next contract change (for example: broadening an enum, making a generic recorder, moving from helper-level proof to route-level proof), pause and review the just-landed work before designing the next slice. Check that commits, tests, docs, and gate language say exactly what was proven — not what the next slice might prove. If review finds a small overclaim in an evidence matrix or baton, tighten the wording and commit that correction before moving on. This prevents "proof inflation" where helper-level evidence quietly becomes route/provider/gate evidence.

**Offline harness proof quality depends on negative controls.** For offline gate/routing/privacy harnesses, a happy-path smoke plus build does not prove readiness for live-smoke planning. Review for explicit wrong-route drops, unauthorized actor drops before ACK, `turnStarted`/ACK-before-start ordering, reply-before-ACK rejection, result-before-ACK/start rejection, duplicate/post-terminal result rejection, raw-ID scanner positive tests, and raw-ID scans over every generated proof/ledger/transcript artifact. See `references/offline-harness-proof-review.md` for the checklist.

**Interrupted review-fix handoffs must preserve exact repo state.** If a review produces local fixes but the session/tool budget ends before commit/push, do not summarize as if the branch is ready. The handoff must name: current branch, whether fixes are uncommitted/unpushed, dirty files or at least the affected paths, verification commands already run, and the exact next safe sequence (`git add`, commit, push, re-freeze scope, addendum review). This keeps the next agent from assuming verified working-tree changes are already part of the reviewed branch.

**Review findings can block merge even after tests pass.** If review catches a maintainability or structure problem after a PR is otherwise green, fix it before merge rather than treating the review as commentary. Example pattern: a new test pushes an existing test file past a maintainability line-count threshold; split the new coverage into a focused test file, rerun the affected verifier set, re-check `git diff --check`, commit the review fix, then merge. Report the fix commit separately from the merge commit so the user can see the review actually changed the landing state.

**Agent #1 over-scores document-comparison findings.** Observed pattern: when Agent #1 compares code to a plan/spec/CLAUDE.md and finds a discrepancy, it tends to score 90+ without checking whether the code has a documented justification for the deviation. Two real false-positive modes seen in the wild:

1. **Plan deviation that's actually an architectural improvement.** Plan says "edit file A"; implementation correctly puts the logic in file B because file A is a stateless shell. Scored 97, was wrong. Mitigation: Agent #1's prompt now requires cross-checking surrounding code/comments for a documented reason before scoring ≥85 — see `agent-spawn-templates.md`.

2. **"Types should be regenerated / look different."** Agent claims `types.ts` was hand-edited because a CHECK-constrained column is `string` instead of a union. Verify against OTHER entries in the same generated file — if they match, the tool just emits that way, and the finding is wrong. Scored 92, was wrong.

**Agent #5 over-reports comment polish as findings.** Same pattern class — the agent is structurally inclined to find something, so it reaches for "this comment could be clearer" and scores it high. Mitigation: Agent #5's threshold rule now requires naming a concrete wrong-action scenario — "a reader would misread X and do Y." If the agent can't name the wrong-action, it's polish, not a finding.

**Default threshold trade-off.** Running at 80 surfaces more (catches rarer bugs) but ~40% of findings need pushback. Running at 85 surfaces fewer (may miss rare catches) but ~60% are actionable. For mature codebases on routine PRs, prefer 85. For security-sensitive or irreversible changes, stay at 80 — the cost of pushback is lower than the cost of a missed exploit.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Trusting automated review blindly | Verify even 80+ confidence issues |
| Performative agreement to feedback | Restate the requirement or just act |
| Implementing before verifying | Check against reality first |
| Batch fixes without testing | One at a time, verify each |
| Avoiding pushback on wrong suggestions | Technical correctness > social comfort |
| Partial implementation when confused | Clarify ALL unclear items first |
| Skipping Agent #3 (History) | History-reversal bugs hide here |
| Running agents sequentially | Always parallel — speed and independence |

---

## The Bottom Line

**Performing reviews:** Use multi-agent parallel analysis with confidence scoring. Trust 80+ threshold but remain skeptical.

**Receiving feedback:** Verify before implementing. Push back when wrong. No performative agreement.

**The cycle completes when:** Valid issues are fixed, invalid suggestions are rejected with reasoning, and the code is demonstrably better.

---

*Multi-agent review system from [Claude Plugins](https://github.com/anthropics/claude-plugins) by Boris Cherny.*  
*Anti-sycophancy framework adapted from [obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent.*

# Baton Template

Copy this template when authoring a new baton. Fill in `<placeholders>` with session-specific content. Aim for 100-200 lines for a single bug fix, 200-400 for a well-scoped feature, and 400-600+ for multi-step work with decision flags.

---

```markdown
# Next-Session Prompt — <One-line topic>

**One-line goal:** <what this session should do>. **Do NOT execute <out-of-scope work> in this session.**

**Spec/anchor file paths:** `<paths>`.

**Architectural anchor:** `<paths>`. Read this before the spec.

**Macro context anchor (if applicable):** `<path to vision spec / sprint plan / CONTEXT.md>`. The macro doc that orients this session in the larger arc. Skip this line if no such doc exists for this work.

---

## 60-second context recap (read FIRST)

**Where we are:** <1-paragraph orientation: prior session, what shipped, where we are in the arc>

**User-stated direction (load-bearing — preserve in any future arc):**
- *"<verbatim quote>"* — context
- *"<verbatim quote>"* — context

**War-story durability:** <3-5 sentences naming the recurring defect classes from this arc that the next session must NOT repeat>

**This session's N-step shape:**
1. <verify prerequisite / sync current state>
2. <next implementation step>
3. <documentation + status updates, if applicable>

If you complete (N) and the user authorizes, you ship <work> this session. **Do not do more than this.**

---

## DO NOT (read this first)

1. **DO NOT execute <out-of-scope> in this session.** <reason>
2. **DO NOT skip <required step>.** <reason>
3. **DO NOT scope-cut.** The user has been clear (<timestamp>: *"<quote>"*). <list of decisions to honor>
4. **DO NOT skip the verification ledger re-check.** <war-story citation>
5. <other DO-NOTs specific to this work>

---

## 0. Session opening (cold start)

Prior session ended <timestamp> with <brief>.

### 0.1 Read first (in order)

1. `<path>` — <one-line description>
2. `<path>` — <description>
... (typically 8-12 docs, each with EXISTS / GREENFIELD status)

### 0.2 System state expected at session start

| Component | Expected state |
|---|---|
| <component> | <verifiable state> |
| ... | ... |

If any of these don't match, classify the surprise before proceeding. When the prompt said "start with X" but live state shows X may already be done, prove whether X still needs action first, then execute only if drift exists.

### 0.3 Tools required (verify available)

```bash
which <tool1> <tool2> <tool3>
```

---

## 1. Run the verification ledger (~5 min)

```bash
bash <verification-script-path> 2>&1 | tee /tmp/<session-tag>-verification-$(date -u +%Y%m%dT%H%M%SZ).txt
```

Compare against the baseline. **Action on drift:** edit the spec inline, bump the changelog, commit, then proceed.

---

## 2. <Review synthesis status / other gating step>

<If applicable: review archive path + verdict + open-finding count + decision-flag count>

---

## 3. Apply fixes / decision gate

### 3.1 Apply mechanical fixes inline (~X min)

1. **<finding-id>:** <what to fix, where>. Concrete steps:
   ```bash
   # explicit commands here, not "compose this yourself"
   ```
2. **<finding-id>:** <what to fix>. <embedded SQL / filter / bash>

### 3.2 Decision gate (surface N flags, BATCH)

> <exact text with each flag + trade-off context + recommended answer>

Wait for the user's response. Apply per their direction → bump the spec → commit.

### 3.3 Execution authorization gate

> <exact authorization request>

Wait for explicit authorization. Do NOT execute without it.

---

## 4. Execution (~Xh focused — N substeps)

### 4.1 Step 1 — <substep title>

<files to create/modify, schema, embedded commands, verification, commit-message template>

### 4.2 Step 2 — <substep title>

<same shape>

### 4.N Acceptance criteria (full set)

- [ ] <boolean check>
- [ ] <boolean check>
... (typically 8-15 items)

---

## 5. Carry-forwards (next-next-session)

After this session ships:
- **<work item>** (~Xh) — <description>
- **<work item>** — <description>

**Plus prior-arc carry-forwards (NOT in scope for next session):**
- <item>

---

## 6. File path summary

| Path | Purpose | Status |
|---|---|---|
| `<path>` | <purpose> | Committed `<hash>` / GREENFIELD / EXISTS |
| ... | ... | ... |

---

## 7. Decision tree if you get stuck

```
Stuck? Ask: which kind?
├── Spec is unclear → re-read the spec section, then ask the user
├── Reviewer disagreement → cross-validate, weigh, pick majority OR escalate
├── Implementation choice not in spec → check the verification ledger, follow precedent
├── Decision question for the user → surface it, wait
├── State surprise → STOP, ask the user
└── Time pressure → there shouldn't be any; document and stop if confused
```

---

## 8. War stories durable across sessions (preserve in any future arc)

Load-bearing operational lessons from this arc:

1. **<defect-class war story>** — <2-3 sentences naming the defect, the fix, the lesson>
2. **<defect-class war story>** — <description>
... (typically 5-8 stories per arc)

---

## 9. Self-test before declaring complete

You're DONE with this session when ALL of the following return TRUE:

- [ ] `<verification command>` runs cleanly
- [ ] `<git log check>` shows fresh commits
- [ ] <other boolean check>
... (typically 8-12 items)

The self-test exists because <war-story citation>. The self-test mirrors that lesson.
```

# Deep Research 🔬

**Status: GA** — A structured 7-stage research protocol for questions that require more than a quick lookup. Goes from question to defensible brief with forced hypothesis generation and adversarial challenge before writing conclusions.

---

## What it does

- Scopes research questions before gathering — prevents chasing the wrong thing
- Forces hypothesis commitment *before* evidence gathering (prevents confirmation bias)
- Builds an argument skeleton before filling in sources
- Adversarially challenges the hypothesis with a steelmanned counterargument (Stage 6)
- Produces structured briefs with calibrated confidence levels
- Routes output correctly: inline for short answers, filed to `docs/research/` for long-form

---

## Install

**Claude Code / Cursor / any Agent Skills-compatible agent:**
```bash
git clone https://github.com/jeremyknows/deep-research ~/.claude/skills/deep-research
```

**OpenClaw:**
```bash
git clone https://github.com/jeremyknows/deep-research ~/.openclaw/skills/deep-research
```

---

## Usage

### Natural language triggers
```
"Do a deep research on X"
"/deep-research [question]"
"Research this properly — I need to make a decision"
"Do a structured brief on [topic]"
"Deep dive on [tool/technology/concept]"
```

### When to use this vs other research tools

| Tool | Best for |
|------|----------|
| `deep-research` | Tool eval, competitive intel, concept validation, decisions you'll act on |
| `last30days` | Recent news, trends, X discourse (≤30 days) |
| Quick web search | Factual lookups, "what's the current version of X" |

---

## The 7 Stages

```
Stage 1: Scope       Define the question and success criteria
Stage 2: Gather      Cast wide — web, X, GitHub, docs
Stage 3: Hypothesize What's the non-obvious answer?
Stage 4: Skeleton    Build the argument structure first
Stage 5: Evidence    Fill the skeleton with sources
Stage 6: Challenge   Steelman the counterargument
Stage 7: Output      Write the brief with confidence level
```

**Fast-path (1→2→7):** Only when the question has one clear answer, stakes are low, you already have 2+ primary sources, and no significant decision depends on it.

---

## Output format

```markdown
# Research Brief: [Question]
**Date:** YYYY-MM-DD
**Confidence:** High / Medium / Low — [one sentence why]

## Answer
[1–3 sentence direct answer. Lead with the conclusion.]

## Evidence Summary
- [Key finding 1 — source]
- [Key finding 2 — source]

## Strongest Counterargument
[From Stage 6]

## Decision Recommendation
[Watch / Use now / Act on / Archive — with specific next step]
```

---

## Confidence levels

| Level | Criteria |
|-------|----------|
| **High** | 3+ independent primary sources + weak counterargument + no major unknowns |
| **Medium** | 1–2 primary sources, OR counterargument has merit, OR significant unknowns |
| **Low** | Mostly secondhand/opinion, OR strong counterargument, OR major unknowns |

---

## Reference files

| File | Purpose |
|------|---------|
| `references/source-routing.md` | Which tools/sources to use by question type |
| `references/brief-quality-checklist.md` | Pre-filing checklist for briefs |
| `references/skeleton-examples.md` | Stage 4 skeleton examples + Stage 6 worked examples |

---

## Health

- **Version:** 1.2.0
- **Health score:** 12/14
- **Status:** GA — 4 production runs completed 2026-03-23, avg 5.1/6 scorecard
- **PRISM reviewed:** 2026-03-22 (6 reviewers, all AWC)
- **Category:** Research & Analysis

---

## File structure

```
deep-research/
├── SKILL.md                              — Core skill (282 lines)
├── README.md                             — This file
├── LICENSE.txt                           — MIT
├── .gitignore
└── references/
    ├── source-routing.md                 — Source selection by question type
    ├── brief-quality-checklist.md        — Pre-filing quality checks
    └── skeleton-examples.md              — Stage 4/6 worked examples
```

---

*MIT License — jeremyknows — v1.2.0*

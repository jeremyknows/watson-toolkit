# baton

A skill for session continuity. Write a cold-start-ready continuation prompt — a **baton** — so a future session can pick up your work without you in the room.

## What it is

The baton is the artifact a fresh session reads to pick up where the prior session left off. A good baton lets a cold session walk the work end-to-end without needing the prior session in-context. A bad baton produces hours of "what does this mean?" plus accidental scope-creep plus missed verification.

The skill runs a disciplined 6-step pattern:

```
inventory → draft → self-audit → cold-reader dry-run → close gaps → score
```

The dry-run is the load-bearing step: you re-read your own prompt *as if you'd never seen the work*, and fix every "compose this yourself" gap before shipping.

## Why it matters

Continuation work is where context evaporates. The next session inherits a half-finished feature, an open decision, or a review fix-list — and without a real handoff, it spends its first hour re-discovering what the prior session already knew. The baton front-loads that knowledge into one explicit, verifiable prompt: cold-start reads, embedded commands, decision flags with recommendations, war stories, and a self-test that tells the cold session when it's done.

## When to invoke

Invoke when the session shipped artifacts the next session must act on, surfaced open decisions, or built half of something. Trigger phrases: "write the baton", "/baton", "continuation prompt", "handoff prompt".

Skip when the work is complete end-to-end, the session was open-ended exploration, or it was a quick Q&A.

## Install

Drop the `baton/` directory into wherever your agent runtime loads skills from. The skill is self-contained — `SKILL.md` plus two reference files (`template.md`, `example.md`). Shell is the only tool dependency, and even that is only used in the example commands; the algorithm itself is convention.

```
baton/
├── SKILL.md              # Skill instructions + frontmatter
├── LICENSE.txt           # MIT
├── README.md             # This file
└── references/
    ├── template.md       # Structural template to copy when authoring a baton
    └── example.md        # Shape-and-density reference with a worked example
```

## Pairs with

- Your **end-of-session routine** (diary/handoff notes) — the baton is one optional output of it.
- Any **verification-before-completion** discipline — "evidence before assertions" is what the baton operationalizes for the next session.

## License

MIT — see LICENSE.txt.

## Author

Jeremy Jannielli ([@jeremyknows](https://github.com/jeremyknows))

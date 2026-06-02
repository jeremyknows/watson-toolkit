# Watson Toolkit

24 skills that fix the ways Claude actually breaks: agreeing with everything, skipping the thinking, guessing at fixes instead of finding root causes, writing like a robot, declaring victory without proof, and not being able to work while you're away.

Skills follow the open [Agent Skills](https://github.com/agentskills/agentskills) format, so they work in **Claude Code**, **Cowork**, **Codex**, and any harness that reads `SKILL.md` directories.

## Install

**Cowork:** Settings > Add marketplace > `https://github.com/jeremyknows/watson-toolkit`

**Claude Code (marketplace):**

```
/plugin marketplace add jeremyknows/watson-toolkit
/plugin install watson-toolkit@watson-toolkit
```

**Claude Code / Codex / anything else (npx):**

```
npx watson-toolkit
```

Copies the skill directories into `~/.claude/skills/`. For other harnesses, point the installer at your skills directory or copy `plugins/watson-toolkit/skills/*` wherever your harness loads skills from.

## What's in here

### Think before building

Claude's default is to start writing code the second you describe a problem. These skills force the design conversation to happen first.

| Skill | What it does |
|-------|--------------|
| `brainstorming` | Interviews you about what you actually want before producing a spec. Without it, Claude skips straight to code without understanding the problem. |
| `grill-me` | Walks every branch of your decision tree. Forces you to resolve the ambiguities you were hoping to ignore. Doesn't stop until there's shared understanding. |
| `grill-with-docs` | Same relentless interview, but grounded in your project docs — it reads them first, then grills you on the gaps between what's written and what you're asking for. |
| `plan-review` | Two phases: first, is this the right thing to build? Then, is this the right way to build it? Catches bad plans before they turn into bad code. |
| `writing-plans` | Turns specs into step-by-step implementation plans that coordinate across files. The thing that goes between deciding what to build and building it. |

### Push back

Claude agrees with you too much. These skills add real resistance.

| Skill | What it does |
|-------|--------------|
| `intellectual-honesty` | Honest assessment over comfortable agreement. Has a framework for separating what's actually being said from what's being presented, and where reasoning breaks down. |
| `receiving-feedback` | Anti-sycophancy protocol for processing feedback on anything: code reviews, doc edits, strategy. Rules for when to push back and when to accept. |
| `complete-code-review` | Spawns 5 parallel reviewers with confidence scoring. The disagreements between reviewers are where the real design decisions live. |
| `prism` | Parallel adversarial review by independent specialists. Disagreements are more valuable than consensus. |
| `boil-the-ocean` | The under-build counter. Catches "MVP shipped" rationalizations at the moment they happen — TODO comments, workarounds instead of fixes, missing tests — and asks whether the missing piece is bounded (finish it now) or unbounded (flag it and stop). |
| `verification-before-completion` | No "done" without evidence. Requires running the verification command and reading its output before any success claim. The gate between "should work" and "works." |

### Build and debug

| Skill | What it does |
|-------|--------------|
| `systematic-debugging` | Four phases: observe, hypothesize, test, fix. You have to finish observing before you can propose a fix. Stops the spiral of random patches. |
| `autoresearch` | Autonomous iteration. Sets a goal, loops (modify, verify, keep or discard, repeat), runs bounded iterations until the metric converges. |
| `sprint-cowork` | Walk-away work. Set goals with acceptance criteria, start a sprint, leave for hours. A director fires every 25 minutes, dispatches workers, tracks progress, handles stalls, writes a report when it's done. You can also give it a vague topic like "improve security" and it'll scope the work itself in the first cycle, then execute. |
| `baton` | Session continuity. When work will continue in a future session, write a "baton" — a cold-start-ready continuation prompt with state inventory, self-audit, and a dry-run as a cold reader. The next session picks up without re-discovery. |

### Write like a human

Claude has tells. These find and fix them.

| Skill | What it does |
|-------|--------------|
| `humanizer` | Catches 15+ specific AI writing patterns: inflated symbolism, em dash overuse, "delve"/"tapestry"/"landscape", rule of three, promotional hedging. Rewrites to remove them. Based on Wikipedia's "Signs of AI writing" guide. |
| `doc-coauthoring` | Three stages: context interview, iterative refinement, then reader testing with a fresh Claude that catches assumptions the author and AI share but a new reader wouldn't. |

### Explore and create

| Skill | What it does |
|-------|--------------|
| `playground` | Builds single-file interactive HTML tools. Controls on one side, live preview on the other, copyable output. Templates for design, data, concept maps, code exploration. |
| `random-thought` | Picks a random insight from your own workspace docs. Good for rediscovering things you wrote and forgot about. |
| `x-fetch` | Pulls tweet text, threads, articles, and engagement stats from X URLs via fxtwitter. Works where direct scraping doesn't. |
| `last30days` | Deep recency research across 10+ sources — Reddit, X, YouTube, Hacker News, Bluesky, the web — synthesized into a grounded, cited report of the last 30 days on any topic. |

### Skill and plugin tooling

Build your own, audit what you have, publish when it's ready.

| Skill | What it does |
|-------|--------------|
| `skill-doctor` | Health audits with scoring (target: 11/14+), reference extraction for progressive disclosure, and vetting new skill installs before they pollute your context. |
| `publish-skills` | Pre-publish checklist: frontmatter, directory structure, LICENSE, README, hardcoded reference scan — plus a sanitizer pipeline for skills authored inside a private workspace. Catches the stuff that makes skills fail on install. |
| `publish-cowork-plugin` | Validates, packages, and publishes Cowork/CC plugins. Structure validation through marketplace setup. |

## Provenance: which skills are original, which are third-party

This toolkit bundles original work alongside excellent open-source skills from other authors. Original skills are maintained here (and in standalone repos); third-party skills are included **unmodified from their upstream** and retain their original licenses — credit and maintenance belong to their authors.

| Skill | Origin | Upstream |
|-------|--------|----------|
| `prism` | **Original** | [jeremyknows/PRISM](https://github.com/jeremyknows/PRISM) |
| `complete-code-review` | **Original** | [jeremyknows/complete-code-review](https://github.com/jeremyknows/complete-code-review) |
| `skill-doctor` | **Original** | [jeremyknows/skill-doctor](https://github.com/jeremyknows/skill-doctor) |
| `publish-skills` | **Original** | [jeremyknows/publish-skills](https://github.com/jeremyknows/publish-skills) |
| `x-fetch` | **Original** | [jeremyknows/x-fetch](https://github.com/jeremyknows/x-fetch) |
| `random-thought` | **Original** | [jeremyknows/random-thought](https://github.com/jeremyknows/random-thought) |
| `intellectual-honesty` | **Original** | this repo |
| `receiving-feedback` | **Original** | this repo |
| `plan-review` | **Original** | this repo |
| `sprint-cowork` | **Original** | this repo |
| `publish-cowork-plugin` | **Original** | this repo |
| `boil-the-ocean` | **Original** | this repo |
| `baton` | **Original** (portable edition) | this repo |
| `playground` | **Original**, derived from Anthropic's official plugin collection | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) |
| `brainstorming` | **Fork** of obra/superpowers (substantially modified) | [obra/superpowers](https://github.com/obra/superpowers) |
| `systematic-debugging` | **Fork** of obra/superpowers (substantially modified) | [obra/superpowers](https://github.com/obra/superpowers) |
| `writing-plans` | **Fork** of obra/superpowers (substantially modified) | [obra/superpowers](https://github.com/obra/superpowers) |
| `grill-me` | **Third-party**, unmodified | [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock |
| `grill-with-docs` | **Third-party**, unmodified | [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock |
| `verification-before-completion` | **Third-party**, unmodified | [obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent |
| `humanizer` | **Third-party**, unmodified | [blader/humanizer](https://github.com/blader/humanizer) by @blader |
| `autoresearch` | **Third-party**, unmodified | [uditgoenka/autoresearch](https://github.com/uditgoenka/autoresearch) by @uditgoenka |
| `last30days` | **Third-party**, unmodified | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) by @mvanhorn |
| `doc-coauthoring` | **Third-party**, unmodified | Anthropic |

If you only want one skill, the standalone repos linked above install individually — you don't need the whole toolkit.

## Maintenance

Skills are authored and battle-tested in a private agent workspace, then published here through an automated pipeline that refreshes every skill from its canonical source, strips workspace-private content, and runs a leak scan before anything is staged. The pipeline (built on the bundled `publish-skills` sanitizer) means this repo is a **generated mirror** — skill content is never edited here directly.

## License

MIT. See [LICENSE](LICENSE). Bundled third-party skills retain their original licenses — see individual skill directories.

## Changelog

### 2.0.0 — 2026-06-02

- **Every skill refreshed** to its current canonical version (the toolkit had been frozen since April; `prism` alone gained simplicity-pass mode, wiki mode, and custom review panels since then)
- **New skills:** `grill-with-docs`, `boil-the-ocean`, `last30days`, `baton` (portable edition), `verification-before-completion` (obra's upstream)
- **Removed:** `decide` — its default data sources assume private infrastructure; it returns to the toolkit after a standalone refactor
- **`prism` sanitized** — legacy workspace paths and internal role names in the published skill replaced with generic equivalents
- **New provenance table** — original vs. third-party, with upstream links and attribution
- **New publish pipeline** — replaces the old bidirectional sync scripts with a one-way generated-mirror model (fleet canonical → sanitize → review → publish)
- **Harness-agnostic framing** — Agent Skills format; CC, Cowork, Codex, npm install paths
- Removed: dead sync scripts (`sync-watson-toolkit.sh`, `sync-github-skills.sh`, `SYNC.md`, `sync-manifest.txt`)

### 1.5.0 — 2026-03-30

- Curated 20-skill set, npx installer, publish-spec compliance, attribution corrections

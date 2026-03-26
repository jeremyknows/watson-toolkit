# Watson Toolkit

A Claude plugin bundling 32 production-tested skills for research, writing, development, planning, design, review, and document creation.

Built by a non-technical founder who runs AI agent infrastructure daily. Every skill here solves a real workflow problem.

## Installation

### CoWork (Desktop)
Add from GitHub: `jeremyknows/watson-toolkit`

### Claude Code (CLI)
```bash
claude --plugin-dir ./  # session-only
```

## Skills

### Workflow & Planning (8)
- **autoresearch** — Autonomous goal-directed iteration. Modify, verify, keep/discard, repeat.
- **brainstorming** — Pre-implementation design exploration.
- **grill-me** — Stress-test plans and designs through relentless interviewing.
- **intellectual-honesty** — Honest assessment over comfortable agreement.
- **plan-review** — Two-phase review: product thinking then engineering stress-test.
- **prd-to-issues** — Break a PRD into GitHub issues using vertical slices.
- **write-a-prd** — Create a PRD through user interview and codebase exploration.
- **writing-plans** — Multi-step task planning before touching code.

### Research (3)
- **deep-research** — 7-stage structured research protocol.
- **last30days** — Research any topic across Reddit, X, YouTube, TikTok, Instagram, HN, Polymarket, and web.
- **x-master** — Master routing for all X/Twitter operations with 2026 algorithm intelligence.

### Writing & Content (3)
- **humanizer** — Remove 25+ signs of AI-generated writing.
- **jackbutcher-voice** — Style guide based on Jack Butcher's writing mechanics.
- **ubiquitous-language** — Extract a DDD-style glossary from conversations.

### Dev & Design (9)
- **canvas-design** — Create visual art as .png and .pdf.
- **frontend-design** — Production-grade, distinctive frontend interfaces.
- **improve-codebase-architecture** — Find opportunities for architectural improvement.
- **make-interfaces-feel-better** — Polish UI interactions and micro-animations.
- **systematic-debugging** — Structured bug diagnosis before proposing fixes.
- **update-docs** — Autonomous codebase documentation generator.
- **web-artifacts-builder** — Multi-component artifacts using React, Tailwind, shadcn/ui.
- **receiving-feedback** — Process code review feedback with technical rigor.
- **proposal-maker** — Generate structured proposals from requirements.

### Documents (4)
- **pdf** — Read, extract, merge, split, rotate, watermark, OCR, create PDFs.
- **docx** — Create, read, edit Word documents.
- **pptx** — Create and edit PowerPoint decks.
- **xlsx** — Create and edit Excel files.

### Review (1)
- **prism** — Parallel review by 5+ independent specialist models.

### Utility (3)
- **markdown-fetch** — Fetch web content as clean markdown (80% token reduction).
- **skill-creator** — Create new skills, run evals, iterate, optimize.
- **playground** — Interactive HTML playground builder.

### Meta (1)
- **doc-coauthoring** — Three-stage doc writing: context gathering, refinement, reader testing.

## Updating

1. Edit the relevant `SKILL.md` in `skills/<skill-name>/`
2. **Bump the version** in `.claude-plugin/plugin.json`
3. Commit and push

> **Always bump the version in plugin.json on every change. CoWork caches by version number.**

## Attribution

| Source | Skills | License |
|--------|--------|---------|
| Original | 20 skills | MIT |
| [Anthropic](https://github.com/anthropics/skills) | canvas-design, doc-coauthoring, frontend-design, skill-creator, web-artifacts-builder, update-docs | Apache 2.0 |
| [Anthropic](https://github.com/anthropics/skills) | pdf, docx, pptx, xlsx | Source-available |
| [mvanhorn](https://github.com/mvanhorn/last30days-skill) | last30days | MIT |
| [Visualize Value](https://github.com/visualizevalue/jackbutcher.md) | jackbutcher-voice (voice data) | See source |

## License

MIT. See [LICENSE](./LICENSE). Bundled third-party skills retain their original licenses.

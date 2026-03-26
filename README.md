# Watson Toolkit

A Claude plugin marketplace bundling 32 production-tested skills for research, writing, development, planning, design, review, and document creation.

Built by a non-technical founder who runs AI agent infrastructure daily. Every skill here solves a real workflow problem — no toy demos.

## What's Inside

| Plugin | Skills | What It Covers |
|--------|--------|----------------|
| [watson-toolkit](./plugins/watson-toolkit-plugin/) | 32 | Full skill suite across 8 categories |

**Highlights:**
- **last30days** — research any topic across Reddit, X, YouTube, TikTok, Instagram, HN, and Polymarket from the last 30 days
- **prism** — parallel review by 5+ independent specialist models to eliminate confirmation bias
- **autoresearch** — autonomous goal-directed iteration (modify, verify, keep/discard, repeat)
- **humanizer** — remove 25+ patterns of AI-generated writing
- **pdf/docx/pptx/xlsx** — full document creation and editing suite
- **x-master** — master routing for all X/Twitter operations with 2026 algorithm intelligence

See the [full skill catalog](./plugins/watson-toolkit-plugin/README.md) for all 32 skills.

## Installation

### CoWork (Desktop)
Click **+** next to Personal Plugins > Add marketplace > `jeremyknows/watson-toolkit`

### Claude Code (CLI)
```bash
/plugin marketplace add jeremyknows/watson-toolkit
/plugin install watson-toolkit@jeremy-tools
```

### Session-only (testing)
```bash
claude --plugin-dir ./plugins/watson-toolkit-plugin
```

## Attribution

This plugin bundles original skills alongside work from these sources:

| Source | Skills | License |
|--------|--------|---------|
| Original | autoresearch, brainstorming, deep-research, grill-me, humanizer, intellectual-honesty, jackbutcher-voice, make-interfaces-feel-better, markdown-fetch, plan-review, playground, prd-to-issues, prism, proposal-maker, receiving-feedback, systematic-debugging, ubiquitous-language, write-a-prd, writing-plans, x-master | MIT |
| [Anthropic](https://github.com/anthropics/skills) | canvas-design, doc-coauthoring, frontend-design, skill-creator, web-artifacts-builder | Apache 2.0 |
| [Anthropic](https://github.com/anthropics/skills) | pdf, docx, pptx, xlsx | Source-available |
| [mvanhorn](https://github.com/mvanhorn/last30days-skill) | last30days | MIT |
| [Visualize Value](https://github.com/visualizevalue/jackbutcher.md) | jackbutcher-voice (voice data) | See source repo |
| [Anthropic](https://github.com/anthropics/skills) | update-docs | Apache 2.0 |

## Contributing

This is a personal toolkit. Issues and suggestions welcome, but PRs may not be accepted if they don't fit the workflow.

## License

MIT. See [LICENSE](./LICENSE) for details. Bundled third-party skills retain their original licenses.

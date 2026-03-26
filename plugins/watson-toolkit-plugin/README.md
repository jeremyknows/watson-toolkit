# Watson Toolkit

Jeremy's full skill suite for Claude CoWork — 32 skills covering research, writing, dev, planning, design, review, and document creation.

Built for daily use across VeeFriends brand work, AI agent infrastructure, and MVP development. Works in both Claude Code CLI and CoWork desktop.

## Skills

### Workflow & Planning (8)
- **autoresearch** — Autonomous goal-directed iteration. Modify, verify, keep/discard, repeat.
- **brainstorming** — Pre-implementation design exploration. Explores intent, requirements, and design before code.
- **grill-me** — Stress-test plans and designs through relentless interviewing.
- **intellectual-honesty** — Honest assessment over comfortable agreement. For reviews, audits, and high-stakes decisions.
- **plan-review** — Two-phase review: product thinking (is this right to build?) then engineering stress-test (how to build it right).
- **prd-to-issues** — Break a PRD into independently-grabbable GitHub issues using vertical slices.
- **write-a-prd** — Create a PRD through user interview, codebase exploration, and module design.
- **writing-plans** — Multi-step task planning before touching code.

### Research (3)
- **deep-research** — 7-stage structured research protocol for questions requiring more than a quick lookup.
- **last30days** — Research any topic across Reddit, X, YouTube, TikTok, Instagram, HN, Polymarket, and web from the last 30 days.
- **x-master** — Master routing skill for all X/Twitter operations: reading, searching, posting, engaging, algorithm intelligence.

### Writing & Content (3)
- **humanizer** — Remove 25+ signs of AI-generated writing. Two-pass anti-AI validation.
- **jackbutcher-voice** — Style guide based on Jack Butcher's writing mechanics.
- **ubiquitous-language** — Extract a DDD-style glossary from conversations. Flags ambiguities, proposes canonical terms.

### Dev & Design (9)
- **canvas-design** — Create visual art as .png and .pdf using design philosophy.
- **frontend-design** — Production-grade, distinctive frontend interfaces. Anti-AI-slop.
- **improve-codebase-architecture** — Find opportunities for architectural improvement and deeper modules.
- **make-interfaces-feel-better** — Polish UI interactions, micro-animations, and interface feel.
- **systematic-debugging** — Structured bug diagnosis before proposing fixes.
- **update-docs** — Autonomous codebase documentation generator with subagent parallelization.
- **web-artifacts-builder** — Multi-component Claude.ai HTML artifacts using React, Tailwind, shadcn/ui.
- **receiving-feedback** — Process code review feedback with technical rigor, not performative agreement.
- **proposal-maker** — Generate structured proposals from requirements.

### Documents (4)
- **pdf** — Read, extract, merge, split, rotate, watermark, OCR, fill forms, create PDFs.
- **docx** — Create, read, edit Word documents. Pandoc conversion, docx-js creation.
- **pptx** — Create and edit PowerPoint decks with thumbnail scripts.
- **xlsx** — Create and edit Excel files with financial model standards.

### Review (1)
- **prism** — Parallel review by 5+ independent specialist models. Eliminates confirmation bias.

### Utility (3)
- **markdown-fetch** — Fetch web content as clean markdown. 80% token reduction vs raw HTML.
- **skill-creator** — Meta-skill: create new skills, run evals, iterate, optimize trigger descriptions.
- **playground** — Interactive HTML playground builder for rapid prototyping.

### Meta (1)
- **doc-coauthoring** — Three-stage doc writing: context gathering, refinement, reader testing.

## Installation

### CoWork (Desktop)
1. Open CoWork > Customize > Plugins
2. Add plugin from GitHub: `jeremyknows/watson-toolkit`
3. Skills will appear in the Skills panel under "Watson Toolkit"

### Claude Code (CLI)
```bash
# Session-only (for testing)
claude --plugin-dir ~/Projects/watson-toolkit/plugins/watson-toolkit-plugin

# Permanent (add marketplace)
/plugin marketplace add jeremyknows/watson-toolkit
/plugin install watson-toolkit-plugin@jeremy-tools
```

## Updating

1. Edit the relevant `SKILL.md` in `plugins/watson-toolkit-plugin/skills/<skill-name>/`
2. **Bump the version** in `plugins/watson-toolkit-plugin/.claude-plugin/plugin.json`
3. Commit and push
4. CoWork auto-syncs on next session

> **Always bump the version in plugin.json on every change. CoWork caches by version number. No bump = no update delivered.**

## Structure

```
watson-toolkit/
  .claude-plugin/
    marketplace.json
  plugins/
    watson-toolkit-plugin/
      .claude-plugin/
        plugin.json
      README.md
      skills/
        autoresearch/SKILL.md
        brainstorming/SKILL.md
        ... (32 skills)
```

## License

Private. Not for distribution.

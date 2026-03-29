# Watson Toolkit

19 skills for rigorous thinking, honest feedback, research, code review, and creative work.

Works in **Claude Code** and **Cowork**.

## Install

**Cowork:**
Settings > Add marketplace > `https://github.com/jeremyknows/watson-toolkit`

**Claude Code:**
```bash
/plugin marketplace add jeremyknows/watson-toolkit
/plugin install watson-toolkit@watson-toolkit
```

## Skills

| Skill | What it does |
|-------|-------------|
| `autoresearch` | Autonomous goal-directed iteration — loops, modifies, verifies, repeats |
| `brainstorming` | Structured ideation with real divergence |
| `complete-code-review` | Multi-perspective parallel code review |
| `decide` | Surface the single highest-priority decision in your queue |
| `doc-coauthoring` | Collaborative document writing with structured feedback loops |
| `grill-me` | Stress-test your thinking — asks the questions you're avoiding |
| `humanizer` | Remove AI writing patterns from text |
| `intellectual-honesty` | Force genuine epistemic rigor — no hedging, no false confidence |
| `plan-review` | Review a plan for gaps, assumptions, and failure modes |
| `playground` | Build interactive HTML explorers for any concept |
| `prism` | Multi-reviewer skill auditing and improvement system |
| `publish-plugin` | Checklist for publishing a Cowork/CC plugin to GitHub |
| `publish-skills` | Checklist for publishing an Agent Skill to GitHub |
| `random-thought` | Workspace reflection — surface a random insight from your own docs |
| `receiving-feedback` | Structure how you take in and act on feedback |
| `skill-doctor` | Diagnose, audit, and improve existing skills |
| `systematic-debugging` | Methodical debugging loop for hard problems |
| `writing-plans` | Write plans that actually get executed |
| `x-fetch` | Fetch tweet/thread/article content from X URLs via fxtwitter |

## Acknowledgements

Watson Toolkit builds on the work of some great open-source skills projects:

- **[mattpocock/skills](https://github.com/mattpocock/skills)** — `grill-me` originated here
- **[obra/superpowers](https://github.com/obra/superpowers)** — `brainstorming`, `systematic-debugging`, `writing-plans`, and `receiving-feedback` trace back to this collection
- **[blader/humanizer](https://github.com/blader/humanizer)** — `humanizer` is maintained by @blader
- **[karpathy/autoresearch](https://github.com/karpathy/autoresearch)** — `autoresearch` applies Karpathy's autonomous iteration principles
- **[anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)** — `playground` originated from Anthropic's official plugin collection

Skills that have been modified retain their original licenses. See individual skill directories for details.

## License

MIT. See [LICENSE](./LICENSE). Bundled third-party skills retain their original licenses.

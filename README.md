# Watson Toolkit

20 skills for rigorous thinking, honest feedback, research, code review, and creative work.

Works in **Claude Code** and **Cowork**.

## Install

**Cowork:**
Settings > Add marketplace > `https://github.com/jeremyknows/watson-toolkit`

**Claude Code (npx — recommended):**
```bash
npx watson-toolkit
```

**Claude Code (marketplace):**
```bash
/plugin marketplace add jeremyknows/watson-toolkit
/plugin install watson-toolkit@watson-toolkit
```

## Skills

**Thinking & decisions**
| Skill | What it does |
|-------|-------------|
| `brainstorming` | Structured ideation with real divergence |
| `grill-me` | Stress-test your thinking — asks the questions you're avoiding |
| `intellectual-honesty` | Force genuine epistemic rigor — no hedging, no false confidence |
| `decide` | Surface the single highest-priority decision in your queue |
| `plan-review` | Review a plan for gaps, assumptions, and failure modes |
| `writing-plans` | Write plans that actually get executed |

**Building & code**
| Skill | What it does |
|-------|-------------|
| `complete-code-review` | Multi-perspective parallel code review |
| `systematic-debugging` | Methodical debugging loop for hard problems |
| `autoresearch` | Autonomous goal-directed iteration — loops, modifies, verifies, repeats |
| `sprint-cowork` | Walk-away autonomous sprints — start it, leave, come back to results |

**Writing & communication**
| Skill | What it does |
|-------|-------------|
| `doc-coauthoring` | Collaborative document writing with structured feedback loops |
| `humanizer` | Remove AI writing patterns from text |
| `receiving-feedback` | Structure how you take in and act on feedback |

**Creative & exploration**
| Skill | What it does |
|-------|-------------|
| `playground` | Build interactive HTML explorers for any concept |
| `random-thought` | Workspace reflection — surface a random insight from your own docs |
| `x-fetch` | Fetch tweet/thread/article content from X URLs via fxtwitter |

**Skill & plugin tooling**
| Skill | What it does |
|-------|-------------|
| `skill-doctor` | Diagnose, audit, and improve existing skills |
| `prism` | Multi-reviewer skill auditing and improvement system |
| `publish-skills` | Checklist for publishing an Agent Skill to GitHub |
| `publish-plugin` | Checklist for publishing a Cowork/CC plugin to GitHub |

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

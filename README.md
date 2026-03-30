# Watson Toolkit

20 skills that fix the ways Claude actually breaks: agreeing with everything, skipping the thinking, guessing at fixes instead of finding root causes, writing like a robot, and not being able to work while you're away.

Works in **Claude Code** and **Cowork**.

## Install

**Cowork:** Settings > Add marketplace > `https://github.com/jeremyknows/watson-toolkit`

**Claude Code (npx):**

```
npx watson-toolkit
```

**Claude Code (marketplace):**

```
/plugin marketplace add jeremyknows/watson-toolkit
/plugin install watson-toolkit@watson-toolkit
```

## What's in here

### Think before building

Claude's default is to start writing code the second you describe a problem. These skills force the design conversation to happen first.

| Skill | What it does |
|-------|--------------|
| `brainstorming` | Interviews you about what you actually want before producing a spec. Without it, Claude skips straight to code without understanding the problem. |
| `grill-me` | Walks every branch of your decision tree. Forces you to resolve the ambiguities you were hoping to ignore. Doesn't stop until there's shared understanding. |
| `plan-review` | Two phases: first, is this the right thing to build? Then, is this the right way to build it? Catches bad plans before they turn into bad code. |
| `writing-plans` | Turns specs into step-by-step implementation plans that coordinate across files. The thing that goes between deciding what to build and building it. |
| `decide` | Pulls the single highest-priority decision out of your queue. Blocked threads, carry-forwards, open tasks. One thing at a time. |

### Push back

Claude agrees with you too much. These skills add real resistance.

| Skill | What it does |
|-------|--------------|
| `intellectual-honesty` | Honest assessment over comfortable agreement. Has a framework for separating what's actually being said from what's being presented, and where reasoning breaks down. |
| `receiving-feedback` | Anti-sycophancy protocol for processing feedback on anything: code reviews, doc edits, strategy. Rules for when to push back and when to accept. |
| `complete-code-review` | Spawns 5 parallel reviewers with confidence scoring. The disagreements between reviewers are where the real design decisions live. |
| `prism` | Parallel adversarial review by independent specialists. Disagreements are more valuable than consensus. |

### Build and debug

| Skill | What it does |
|-------|--------------|
| `systematic-debugging` | Four phases: observe, hypothesize, test, fix. You have to finish observing before you can propose a fix. Stops the spiral of random patches. |
| `autoresearch` | Autonomous iteration. Sets a goal, loops (modify, verify, keep or discard, repeat), runs bounded iterations until the metric converges. |
| `sprint-cowork` | Walk-away work. Set goals with acceptance criteria, start a sprint, leave for hours. A director fires every 25 minutes, dispatches workers, tracks progress, handles stalls, writes a report when it's done. You can also give it a vague topic like "improve security" and it'll scope the work itself in the first cycle, then execute. |

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

### Skill and plugin tooling

Build your own, audit what you have, publish when it's ready.

| Skill | What it does |
|-------|--------------|
| `skill-doctor` | Health audits with scoring (target: 11/14+), reference extraction for progressive disclosure, and vetting new skill installs before they pollute your context. |
| `publish-skills` | Pre-publish checklist: frontmatter, directory structure, LICENSE, README, hardcoded reference scan. Catches the stuff that makes skills fail on install. |
| `publish-cowork-plugin` | Validates, packages, and publishes Cowork/CC plugins. Structure validation through marketplace setup. |

## Acknowledgements

Built on some good open-source work:

- **[mattpocock/skills](https://github.com/mattpocock/skills)** — `grill-me` started here
- **[obra/superpowers](https://github.com/obra/superpowers)** — `brainstorming`, `systematic-debugging`, `writing-plans`, `receiving-feedback` trace back to this
- **[blader/humanizer](https://github.com/blader/humanizer)** — `humanizer` is maintained by @blader
- **[karpathy/autoresearch](https://github.com/karpathy/autoresearch)** — `autoresearch` applies Karpathy's autonomous iteration approach
- **[anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)** — `playground` came from Anthropic's official plugin collection

Modified skills keep their original licenses. See individual skill directories for details.

## License

MIT. See [LICENSE](LICENSE). Bundled third-party skills retain their original licenses.

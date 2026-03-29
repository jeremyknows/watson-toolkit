# complete-code-review

Full code review lifecycle for AI agents — multi-agent parallel analysis with confidence scoring, anti-sycophancy feedback processing, and disciplined fix implementation.

## What it does

- **Performing reviews:** Spawns 5 parallel reviewer agents (correctness, security, style, architecture, test coverage), each scoring issues ≥80% confidence before reporting
- **Filtering false positives:** Excludes pre-existing issues, auto-generated code, vendored deps, personal style
- **Receiving reviews:** Anti-sycophancy framework — READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT
- **Push-back discipline:** Concrete criteria for when to accept, negotiate, or reject reviewer feedback
- **Fix ordering:** Blocking bugs first, then correctness, then style — never batch unrelated fixes

## Quick start

```bash
# OpenClaw
clawhub install complete-code-review

# Claude Code / Cursor / any agent
git clone https://github.com/jeremyknows/complete-code-review.git
# Drop the folder in your agent's skills directory, then reference SKILL.md
```

## Dependencies

- Parallel agent spawn capability (Agent tool in Cowork, Task tool in CC, `sessions_spawn` in OpenClaw)
- `gh` CLI — for PR history, past comments, blame context (optional but recommended)
- `git` CLI — for history/blame in multi-agent context

## Usage

Natural language triggers:
- "Do a code review of this PR"
- "Review my changes"
- "I got feedback on my PR — help me process it"
- "Should I push back on this review comment?"

## References

- `references/agent-spawn-templates.md` — Exact prompts for each of the 5 reviewer agents
- `references/review-quality-checklist.md` — Scoring rubric for review quality
- `references/openclaw.md` — OpenClaw-specific autoresearch scoring loop

## Attribution

*Multi-agent review system from [Claude Plugins](https://github.com/anthropics/claude-plugins) by Boris Cherny.*  
*Anti-sycophancy framework adapted from [obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent.*

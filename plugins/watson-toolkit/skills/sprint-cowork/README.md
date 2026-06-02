# sprint-cowork

Autonomous, goal-driven work sprints for Cowork and Claude Code. Define goals, walk away, come back to finished results.

## What it does

- Sets up a scheduled task that fires every N minutes (default: 25)
- Each cycle: reads state from disk, assesses progress, dispatches workers via sub-agents, updates state
- Workers write structured output with handoff sections so the next cycle can build on their work
- Synthesizes a final report when all goals complete or time expires
- Self-disables the scheduled task on completion

## Install

**Cowork:** Copy `sprint-cowork/` into your skills folder or install via marketplace.

**Claude Code:**
```bash
cp -r sprint-cowork/ ~/.claude/skills/sprint-cowork
```

## Usage

Just tell Claude:
- "Sprint on cleaning up the auth module for 2 hours"
- "Work on this while I'm in my meeting"
- "Keep working on the migration overnight"

Sprint will ask you to confirm goals and acceptance criteria, then set up the scheduled task. You can walk away.

For exploratory work ("improve security", "reduce tech debt"), use a **self-scoping sprint** — the first cycle discovers specific goals automatically, then subsequent cycles execute them.

## How it works

1. **Setup** — You define goals with acceptance criteria. Sprint creates `sprint-state.json` and a scheduled task.
2. **Director cycles** — Every 25 minutes, the director wakes up, reads state, checks progress, dispatches workers, and updates the log.
3. **Workers** — Sub-agents that execute one task per cycle. Each writes a structured output file with a Handoff section.
4. **Synthesis** — When all goals pass their acceptance criteria (or time expires), the director writes `SPRINT-REPORT.md` and disables itself.

## Key files during a sprint

```
sprint-[id]/
  sprint-state.json          # Live state (source of truth)
  sprint-progress.md         # Human-readable running log
  SPRINT-REPORT.md           # Final report (on completion)
  cycle-1-worker-1-output.md # Worker outputs
  cycle-2-worker-1-output.md
```

## File structure

```
sprint-cowork/
  SKILL.md                              # Skill instructions
  LICENSE.txt                           # MIT license
  README.md                             # This file
  references/
    director-template.md                # Full director prompt template
    worked-example.md                   # Real sprint that completed successfully
  scripts/
    generate-director-prompt.py         # Renders director prompt from state.json
```

## Limitations

- Each cycle is a fresh session with no memory — everything must be on disk
- Sub-agents can't spawn sub-agents (single depth)
- Minimum cycle interval is 20 minutes (to avoid overlap)
- Workers can't ask the user questions mid-sprint
- Cost scales with duration (14 cycles at 25-min intervals for a 6-hour sprint)

## License

MIT

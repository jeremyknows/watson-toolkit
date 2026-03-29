# OpenClaw-Specific Integration

Runtime-specific details for running skill-doctor under OpenClaw with sessions_spawn.

## Why sessions_spawn (not `openclaw agent --local`)

`openclaw agent --local --agent main` serializes on the main session file — concurrent calls deadlock. `sessions_spawn` creates isolated sessions with independent file paths. No lock contention, proper parallel execution.

## Spawn syntax for each phase

### Phase A — Prior Brief Compiler + DA
```
sessions_spawn(task="[reviewer prompt with injected vars]", mode="run", runTimeoutSeconds=90)
sessions_spawn(task="[DA prompt with injected vars]", mode="run", runTimeoutSeconds=120)
```

### Phase B — 5 reviewers in parallel
```
sessions_spawn(task="[reviewer prompt]", mode="run", runTimeoutSeconds=90)
# Launch all 5 simultaneously
```

### Phase C — Contrarian
```
sessions_spawn(task="[contrarian prompt]", mode="run", runTimeoutSeconds=120)
```

### Phase D — Synthesis Agent
```
sessions_spawn(task="[synthesis prompt]", mode="run", runTimeoutSeconds=180)
```

## sessions_spawn param gotchas

`model=`, `max_depth=`, `timeout_minutes=` are NOT valid params. Model selection goes in the task prompt body. Use only `task=`, `mode=`, `runTimeoutSeconds=`.

## Archive paths

Primary: `~/.openclaw/agents/main/workspace/analysis/prism/archive/[skill-name]/[date]-review.md`
Health log: `docs/knowledge/skills/SKILL-HEALTH-SCORES.md`
Skills inventory: `docs/knowledge/skills/SKILLS-INVENTORY.md`
Autoresearch spec: `docs/knowledge/skills/AUTORESEARCH-MASTER.md`

## Bus events

Phase 6 completion:
```bash
bash ~/.openclaw/scripts/sub-agent-complete.sh
```

Phase 6b stalled condition:
```bash
bash ~/.openclaw/scripts/emit-event.sh agent task_stalled "[skill-name]: [condition summary]" "" "skills"
```

## Blocklist location

`~/.openclaw/skills/.blocklist`

## ClawHub integration

Phase 0 Step 2 — ClawHub pages show VirusTotal grade automatically. Any flag = stop, do not install.

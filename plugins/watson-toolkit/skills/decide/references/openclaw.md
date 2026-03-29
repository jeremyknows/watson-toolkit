# OpenClaw / WatsonFlow Integration Notes

Runtime-specific details for running `/decide` under OpenClaw with WatsonFlow.

## WatsonFlow task integration

Set `TASK_MANAGER_URL=http://localhost:3000` in your environment.
`decide-handler.js` will PATCH `/api/tasks/:id` on Yes/Dismiss.
Failure is non-blocking — if WatsonFlow returns 401 or is unreachable, the action still completes.

**WatsonFlow 401** — If `/api/tasks` returns 401, the http source degrades gracefully (items pooled from carry-forwards + threads only, no error shown to user). Fix the auth separately; `/decide` continues working.

**WatsonFlow PATCH is fire-and-forget** — Yes/Dismiss attempt to update WatsonFlow task status but don't block on failure. Check Watson-OS directly if status doesn't update.

## Data paths (OpenClaw agent)

When running under OpenClaw, `OPENCLAW_WORKSPACE_DIR` is set automatically by the runtime.
`decide-config.js` uses this as a fallback if `~/.decide/` doesn't exist.

Default paths (when no `~/.decide/config.json` present):
- Carry-forwards: `$OPENCLAW_WORKSPACE_DIR/config/carry-forwards.json`
- Threads: `$OPENCLAW_WORKSPACE_DIR/config/active-threads.json`
- Audit log: `$OPENCLAW_WORKSPACE_DIR/data/audit-readiness-scan.jsonl`
- Snooze state: `$OPENCLAW_WORKSPACE_DIR/data/decide-pending-later.json`

## Skill registration

Watson loads this skill from `~/.openclaw/skills/decide-command/`.
The SKILL.md is auto-discovered via the `skills` config path.
No `openclaw.json` changes needed.

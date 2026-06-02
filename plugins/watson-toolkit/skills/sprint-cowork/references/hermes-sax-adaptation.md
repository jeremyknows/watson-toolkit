# Hermes/Sax adaptation for Sprint

This sprint skill was originally authored around Cowork/Claude Code mechanics. In Hermes/Sax sessions, use the sprint model conceptually but replace the mechanics.

## Mapping

- Cowork `create_scheduled_task` → Hermes `cronjob` tool.
- Cowork/Claude Agent tool → Hermes `delegate_task`.
- Cowork `/sessions/*/mnt/...` path discovery → explicit host paths such as `<home>/...` plus state/progress files.
- Cowork scheduled-task notifications → Discord cron response plus state/progress/final-report artifacts.

## Required proof before walk-away

When the user is waiting to go offline/sleep, do not merely create the cron and say it is ready. Prove a clean tick:

1. List existing jobs before create/update to avoid duplicates.
2. Create/update with a compact pointer prompt. Keep rich policy in baton/state files.
3. If a scanner blocks a prompt, repair by simplifying the prompt; do not preserve the blocked prompt as “working.”
4. Run or wait for one tick.
5. Verify `cronjob list` shows the target job with `enabled: true`, expected schedule, `last_status: ok`, advanced repeat count, and future `next_run_at`.
6. Verify an independent execution surface: Discord cron response, session file, or heartbeat artifact updated after the tick.
7. Report the proof in a short card: job ID, schedule, last/next run, execution proof, work advanced, still-held boundaries.

## Do not run Cowork instructions verbatim

The `create_scheduled_task`, `Agent` tool, and Cowork session-path sections in the main skill are not mechanically compatible with Hermes. Treat them as design patterns only unless running inside Cowork.

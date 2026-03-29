---
name: decide
description: |
  Pull-based decision queue. Type /decide to surface the single most-ready-to-decide item
  from carry-forwards, blocked threads, and connected task manager items. Presents a calm card with
  Yes / Later / Dismiss buttons. Use when: user types "/decide" or asks to work through
  their decision queue one item at a time.
  NOT for: listing all items, bulk triage, queue management, or status overviews.
license: MIT
compatibility: Requires Node.js >= 18
metadata:
  author: jeremyknows
  version: "1.1.0"
  category: "Business Process Automation"
---

# /decide Command

**Purpose:** Single-item decision surfacing. One item, three choices, zero list management.

## Installation

Works out of the box for Watson (OpenClaw agent). For any other agent or Claude Code:

**Option 1 — Clone and install:**
```bash
git clone https://github.com/jeremyknows/decide.git
cd decide && npm install
node scripts/decide-handler.js invoke
```

**Option 2 — Custom data sources:** Create `~/.decide/config.json`:
```json
{
  "version": 1,
  "sources": [
    {
      "type": "jsonfile",
      "name": "carry-forwards",
      "path": "~/.decide/carry-forwards.json",
      "itemType": "carry-forward",
      "filter": { "owner": "jeremy", "status": "open" }
    },
    {
      "type": "jsonfile",
      "name": "threads",
      "path": "~/.decide/active-threads.json",
      "itemType": "thread",
      "filter": { "status": "blocked_on_jeremy" }
    }
  ]
}
```

**Option 3 — Env var override:**
```bash
DECIDE_WORKSPACE=/path/to/your/data node ./scripts/decide-handler.js invoke
```

## Data Directory

Without config, data files are read from (in order):
1. `$DECIDE_WORKSPACE/` — explicit override
2. `$OPENCLAW_WORKSPACE_DIR/` — set automatically by OpenClaw runtime
3. `~/.decide/` — portable default for non-OpenClaw use

Data files:
- `<data-dir>/config/carry-forwards.json` — carry-forward items
- `<data-dir>/config/active-threads.json` — blocked threads
- `<data-dir>/data/audit-readiness-scan.jsonl` — audit log (append-only)
- `<data-dir>/data/decide-pending-later.json` — snooze state

## What it does

On `/decide`:
1. Pools items from carry-forwards, active-threads, and optional task manager integration (graceful degrade)
2. Ranks by P0→P1→P2→unset, then oldest-first within each tier
3. Returns a formatted card with the top item + three action choices

## Requirements

- Node.js ≥ 18
- `npm install` in skill directory (installs `proper-lockfile`)

## Smoke Test

```bash
cd <skill-dir> && npm install
node scripts/decide-handler.js invoke
# → {"text":"**📋 /decide** — ...", "interactive":{"blocks":[...]}}
# or → {"text":"**📋 /decide** — Queue is clear ✨", "interactive":null}
```

## Commands

### /decide

**Steps:**
1. Run `node <skill-dir>/scripts/decide-handler.js invoke`
2. Parse JSON output → `{ text, interactive }` or `{ text }` (empty queue)
3. Send via message tool with `interactive` if present, plain text if not

## Button Callbacks

Callback payload format: `decide:ACTION:ITEM_ID`

### Yes (`decide:yes:ITEM_ID`)
```bash
node ./scripts/decide-handler.js button "decide:yes:ITEM_ID" --channel CHANNEL_ID
```
- Updates task status in connected task manager (graceful degrade if unavailable)
- Logs to audit log
- Signals follow-up in item's thread if `thread_id` present

### Dismiss (`decide:dismiss:ITEM_ID`)
```bash
node ./scripts/decide-handler.js button "decide:dismiss:ITEM_ID"
```
- Marks carry-forward status→dismissed
- Updates task status to cancelled in connected task manager (graceful degrade)

### Later (`decide:later:ITEM_ID`) — two-step flow
```bash
# Step 1 — click Later button
node ./scripts/decide-handler.js button "decide:later:ITEM_ID"
# → { text: "When should X resurface?", awaitingLaterDate: true, itemId: "..." }

# Step 2 — user replies with date
node ./scripts/decide-handler.js later-date "ITEM_ID" "friday"
# → { ok: true, text: "...returning Friday...", awaitingLaterBlocker: true }

# Step 3 — user replies with blocker
node ./scripts/decide-handler.js later-blocker "ITEM_ID" "DATE" "waiting on Tom"
# → { ok: true, text: "Snoozed until Friday — Blocker: waiting on Tom" }
```

## Scripts

All scripts at `<skill-dir>/scripts/`:

| Script | Purpose |
|--------|---------|
| `decide-handler.js` | CLI entrypoint — invoke, button callbacks, later flow |
| `decide-pool.js` | Data pooling from all sources |
| `decide-rank.js` | Pure priority+age ranking |
| `decide-card.js` | Card formatter (markdown + optional interactive buttons) |
| `decide-later-flow.js` | Two-step Later flow + snooze persistence |
| `decide-config.js` | Config loader with path/SSRF validation |
| `cf-writer.js` | File-locked carry-forwards write helper |

## Security

- Config `jsonfile` paths validated against allowlist (`~/.decide/`, `~/.openclaw/`, `$DECIDE_WORKSPACE`)
- Symlinks dereferenced before allowlist check (prevents symlink traversal)
- HTTP sources validated: private IPs, loopback, link-local, IPv6-mapped, decimal/octal/hex IP notations all blocked
- `_skipValidation` field rejected from user-supplied configs

## Gotchas

- **Snooze state TTL** — Later flow state (`decide-pending-later.json`) expires after 1 hour. If you click Later and don't complete the date+blocker flow within 1 hour, run `/decide` again.
- **CF file lock** — If the process crashes mid-write, `proper-lockfile` auto-releases the lock after 10 seconds. If you see "lock already held" errors, wait 10s and retry.
- **Item not found on button click** — Yes/Dismiss re-pools to find the item. If it was already acted on (e.g., double-click), returns "Item not found — it may have already been acted on." This is correct behavior.
- **Threads always P1** — Thread items from active-threads.json are hardcoded to P1 priority in `decide-pool.js`. Carry-forwards use their own priority field.
- **Task manager PATCH is fire-and-forget** — Yes/Dismiss attempt to update task status in the connected task manager but don't block on failure.

## Runtime-Specific Notes

See [`references/openclaw.md`](references/openclaw.md) for OpenClaw/WatsonFlow-specific integration details.

## MCP (v2 — coming)

An MCP server wrapper (`decide-mcp-server.js`) will expose `decide/invoke`, `decide/button`, `decide/later` as MCP tools for Claude.ai web/desktop. Option A (this skill) is the prerequisite.

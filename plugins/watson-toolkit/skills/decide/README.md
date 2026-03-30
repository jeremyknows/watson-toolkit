# decide

Pull-based decision queue for OpenClaw agents and Claude Code.

Type `/decide` → get one card → one of three buttons. No lists, no backlog anxiety.

## Quick start

```bash
# OpenClaw
clawhub install decide

# Claude Code / any Node environment
git clone https://github.com/jeremyknows/decide.git
cd decide
npm install
node scripts/decide-handler.js invoke
```

## Config

By default uses `$OPENCLAW_WORKSPACE_DIR` (set by OpenClaw runtime) or `~/.decide/` for data.

To use custom data sources, create `~/.decide/config.json`:

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
    }
  ]
}
```

See `SKILL.md` for full documentation.

## Requirements

- Node.js ≥ 18
- npm (for `proper-lockfile` dep)

## Roadmap

- v1.1: Option A — self-contained skill folder (this release)
- v2.0: MCP server wrapper for Claude.ai web/desktop

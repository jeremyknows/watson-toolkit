# Plugin Structure Reference

## Canonical Layout

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json              ← REQUIRED (only file in this dir)
├── skills/
│   └── skill-name/
│       ├── SKILL.md             ← REQUIRED per skill
│       └── references/          ← optional supporting docs
├── commands/                    ← optional slash commands
│   └── command-name.md
├── agents/                      ← optional sub-agents
│   └── agent-name.md
├── .mcp.json                    ← optional MCP server connections
├── hooks/                       ← optional event handlers
│   └── hooks.json
├── settings.json                ← optional default settings
├── README.md                    ← recommended
└── LICENSE                      ← recommended for public plugins
```

**Critical rule:** `skills/`, `commands/`, `agents/`, `hooks/` must be at the plugin root. Only `plugin.json` goes inside `.claude-plugin/`.

## plugin.json Schema

```json
{
  "name": "my-plugin",
  "description": "What this plugin does in one sentence.",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "keywords": ["keyword1", "keyword2"]
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `name` | Yes | Kebab-case, lowercase, max 64 chars |
| `description` | No | String, recommended |
| `version` | No | Semver format |
| `author` | No | Must be object `{"name": "..."}`, NOT a string |
| `keywords` | No | Array of strings |
| `hooks` | No | Path to hooks.json |
| `mcpServers` | No | Path to .mcp.json |

**Keys that will FAIL validation:** `display_name`, `homepage`, `repository`, `license` (as top-level key).

## SKILL.md Frontmatter Schema

```yaml
---
name: skill-name
description: >
  What this skill does and when to trigger it. Include specific phrases
  the user might say. Claude sees ONLY name + description (~100 tokens)
  to decide whether to load the full skill.
---
```

| Field | Required | Rules |
|-------|----------|-------|
| `name` | No | Kebab-case, should match directory name |
| `description` | Recommended | Trigger-focused, specific phrases |
| `disable-model-invocation` | No | Boolean, prevents auto-trigger |
| `user-invocable` | No | Boolean |
| `allowed-tools` | No | Comma-separated tool names |
| `model` | No | Model override (sonnet, opus, haiku) |
| `effort` | No | low, medium, high, max |
| `context` | No | "fork" for subagent execution |
| `shell` | No | bash or powershell |
| `argument-hint` | No | Placeholder text for arguments |

**Fields that will FAIL validation:** `version`, `license`, `author`, `tags`, `taxonomy_category`, `health_score`, `status`, `metadata`, `homepage`, `repository`, `last_improved`

## Naming Rules

- **Everything is kebab-case:** plugin name, skill directory names, skill names in frontmatter
- **Directory name = skill name:** `skills/my-skill/SKILL.md` should have `name: my-skill`
- **No spaces, no underscores, no camelCase**

## Progressive Disclosure

Claude loads content in stages to minimize token usage:

1. **Always loaded:** Skill name + description (~100 tokens per skill)
2. **Loaded on trigger:** Full SKILL.md body (<2,000 words recommended)
3. **Loaded on demand:** Reference files in `references/` (unlimited size)

Guidelines:
- Description: ~100 words, trigger-focused
- SKILL.md body: <2,000 words, instructions and workflow
- References: unlimited, factual data and detailed specs

## Size Guidelines

- Total plugin: <5 MB recommended
- Individual SKILL.md: <50 KB
- Font files, images: minimize or exclude if not essential
- Scripts: include only what the skill actively calls

## Version Bumping

**Every change requires a version bump in plugin.json.** CoWork caches by version number. No bump = update never reaches users.

```bash
# Before: "version": "1.0.0"
# After:  "version": "1.0.1"
```

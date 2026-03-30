# Plugin & Marketplace Structure Reference

Source: https://code.claude.com/docs/en/plugin-marketplaces and https://code.claude.com/docs/en/plugins

## Plugin Structure (standalone)

A plugin is a self-contained directory with skills, agents, hooks, and/or MCP servers.

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json              ← REQUIRED (plugin manifest)
├── skills/
│   └── skill-name/
│       ├── SKILL.md             ← REQUIRED (per skill)
│       └── references/          ← optional detailed docs
│           └── guide.md
├── agents/                      ← optional
│   └── agent-name.md
├── hooks/                       ← optional
│   └── hooks.json
├── .mcp.json                    ← optional (MCP server configs)
└── README.md                    ← recommended
```

## Marketplace Structure (for GitHub distribution)

A marketplace is a catalog that lists plugins. The plugin lives in a SUBDIRECTORY.

```
repo-root/                               ← MARKETPLACE
├── .claude-plugin/
│   └── marketplace.json                 ← marketplace manifest ONLY
├── plugins/
│   └── plugin-name/                     ← PLUGIN in subdirectory
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── skills/
│       │   └── ...
│       └── README.md
└── README.md
```

CRITICAL: marketplace.json and plugin.json NEVER go in the same `.claude-plugin/` directory.

## plugin.json Schema

```json
{
  "name": "kebab-case-name",
  "description": "What it does",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "email@example.com"
  },
  "keywords": ["tag1", "tag2"]
}
```

Required: `name`, `description`, `version`.
Optional: `author`, `keywords`, `homepage`, `repository`, `license`.

## marketplace.json Schema

```json
{
  "name": "marketplace-name",
  "owner": {
    "name": "Maintainer Name",
    "email": "email@example.com"
  },
  "metadata": {
    "description": "Brief marketplace description"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "What the plugin does",
      "version": "1.0.0",
      "homepage": "https://github.com/owner/repo"
    }
  ]
}
```

Required: `name`, `owner` (with `name`), `plugins` array.
Required per plugin: `name`, `source`.
Optional per plugin: `description`, `version`, `author`, `homepage`, `category`, `tags`.

### Plugin Source Formats

Relative path (same repo):
```json
{ "source": "./plugins/my-plugin" }
```

GitHub repo (different repo):
```json
{ "source": { "source": "github", "repo": "owner/repo" } }
```

Git URL:
```json
{ "source": { "source": "url", "url": "https://gitlab.com/team/plugin.git" } }
```

Git subdirectory:
```json
{ "source": { "source": "git-subdir", "url": "owner/monorepo", "path": "plugins/my-plugin" } }
```

npm package:
```json
{ "source": { "source": "npm", "package": "@org/plugin" } }
```

All object sources support optional `ref` (branch/tag) and `sha` (commit hash) for pinning.

### Path Resolution

From the official docs: "Paths resolve relative to the marketplace root, which is the directory containing `.claude-plugin/`. In the example above, `./plugins/my-plugin` points to `<repo>/plugins/my-plugin`, even though `marketplace.json` lives at `<repo>/.claude-plugin/marketplace.json`. Do not use `../` to climb out of `.claude-plugin/`."

## SKILL.md Schema

```yaml
---
name: skill-name
description: >
  This skill should be used when the user asks to "do X", "do Y",
  or needs help with Z.
metadata:
  version: "0.1.0"
---

# Skill Title

Imperative instructions for Claude go here.
```

Required frontmatter: `name` (must match directory name), `description`.
Optional: `metadata`, `disable-model-invocation`.

## Naming Rules

- Plugin name: kebab-case (`my-plugin`)
- Marketplace name: kebab-case (`my-marketplace`)
- Skill directory name: kebab-case, must match frontmatter `name`
- Agent file name: kebab-case with `.md` extension
- Version: semver (`MAJOR.MINOR.PATCH`)

## Progressive Disclosure

1. **Description** (~100 words) — always loaded, used for skill matching
2. **SKILL.md body** (<2,000 words) — loaded when skill triggers
3. **references/** (unlimited) — loaded on demand

## Installation Commands

```bash
# Add a marketplace from GitHub
/plugin marketplace add owner/repo

# Install a plugin from a marketplace
/plugin install plugin-name@marketplace-name

# Validate a marketplace
claude plugin validate .

# Validate a plugin
claude plugin validate .claude-plugin/plugin.json
```

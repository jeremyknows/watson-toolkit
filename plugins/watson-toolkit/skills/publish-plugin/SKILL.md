---
name: publish-plugin
description: >
  Format, validate, and package a Cowork plugin for distribution. Use when the user asks to
  "publish a plugin", "package a plugin", "make a .plugin file", "fix my plugin structure",
  "validate my plugin", "why won't my plugin install", "set up a marketplace", or needs help
  turning a set of skills into an installable plugin. Also use when troubleshooting plugin
  installation failures or marketplace sync errors.
---

# Publish Plugin

Package and validate a Cowork plugin so it installs without errors. Covers both .plugin file packaging and GitHub marketplace distribution.

## Key Concept: Plugins vs Marketplaces

A **plugin** and a **marketplace** are two different things with separate file structures. They CANNOT share the same `.claude-plugin/` directory.

- A **plugin** has `.claude-plugin/plugin.json` and contains skills, agents, hooks, etc.
- A **marketplace** has `.claude-plugin/marketplace.json` and is a catalog that lists plugins and where to find them.

When distributing via GitHub, the repo IS the marketplace, and the plugin lives in a subdirectory inside it.

## Step 1: Determine Distribution Method

Ask the user how they want to distribute:

**Option A — .plugin file only**: Package as a zip with `.plugin` extension. Users install by uploading the file. Skip to Step 2.

**Option B — GitHub marketplace** (recommended for auto-updates): The repo acts as a marketplace with the plugin in a subdirectory. Users add via "Add marketplace" in Cowork settings. Go to Step 2, then Step 6.

## Step 2: Validate Plugin Structure

A valid **plugin** directory must have this layout:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          ← REQUIRED (plugin manifest)
├── skills/
│   └── skill-name/
│       ├── SKILL.md          ← REQUIRED per skill
│       └── references/       ← optional
├── README.md                 ← recommended
```

Run these checks:

### Check 1: plugin.json exists and is valid

Required fields in `.claude-plugin/plugin.json`:
```json
{
  "name": "kebab-case-name",
  "description": "Brief explanation",
  "version": "X.Y.Z"
}
```
- `name`: kebab-case (lowercase, hyphens, no spaces)
- `version`: semver format
- `author`: optional but recommended — `{ "name": "...", "email": "..." }`

### Check 2: Every skill directory has a SKILL.md

```bash
for dir in skills/*/; do
  [ ! -f "$dir/SKILL.md" ] && echo "MISSING: $dir"
done
```

### Check 3: Every SKILL.md has valid YAML frontmatter

```yaml
---
name: skill-name          # must match directory name
description: >            # third-person with trigger phrases in quotes
  Description here.
---
```

### Check 4: No nested SKILL.md files

Only `skills/*/SKILL.md` is valid as a top-level skill. SKILL.md files deeper than that (e.g., `skills/foo/variants/bar/SKILL.md`) get counted as separate skills and inflate the count.

```bash
find skills -name "SKILL.md" -not -path "skills/*/SKILL.md"
# Should return nothing
```

## Step 3: Run CLI Validation

```bash
claude plugin validate .claude-plugin/plugin.json
```

## Step 4: Package as .plugin File

```bash
cd /path/to/plugin-directory
zip -r /tmp/PLUGIN_NAME.plugin . \
  -x "*.DS_Store" -x "__MACOSX/*" -x ".git/*" -x ".gitignore" -x "node_modules/*"
```

CRITICAL:
- `cd` INTO the plugin directory first, then zip `.` — never zip the parent folder
- Use `.plugin` extension, not `.zip`
- Verify: `unzip -l /tmp/PLUGIN_NAME.plugin | head -20` — `.claude-plugin/plugin.json` must be at the zip root

## Step 5: Report Results

Tell the user: skill count, issues fixed, warnings, output location.

If the user only wanted a .plugin file, stop here.

## Step 6: Set Up GitHub Marketplace

If the user wants GitHub distribution with auto-updates, the repo needs a **marketplace wrapper** around the plugin.

### Required repo structure

```
repo-root/                               ← this is the MARKETPLACE
├── .claude-plugin/
│   └── marketplace.json                 ← ONLY marketplace.json here
├── plugins/
│   └── plugin-name/                     ← the PLUGIN lives in a subdirectory
│       ├── .claude-plugin/
│       │   └── plugin.json              ← plugin manifest here
│       ├── skills/
│       │   └── ...
│       └── README.md
└── README.md                            ← marketplace-level readme
```

Key rules from the official docs (https://code.claude.com/docs/en/plugin-marketplaces):
- The marketplace `.claude-plugin/` ONLY contains `marketplace.json` — never put `plugin.json` here
- The plugin MUST live in a subdirectory (e.g., `./plugins/plugin-name/`)
- The plugin subdirectory has its OWN `.claude-plugin/plugin.json`
- `"source": "."` does NOT work — the plugin cannot self-reference
- Relative paths resolve from the marketplace root (the directory containing `.claude-plugin/`), not from inside `.claude-plugin/`

### marketplace.json format

```json
{
  "name": "marketplace-name",
  "owner": {
    "name": "Author Name",
    "email": "author@example.com"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "What the plugin does",
      "version": "1.0.0"
    }
  ]
}
```

Required marketplace fields: `name`, `owner` (with `name`), `plugins` array.
Required per-plugin fields: `name`, `source`.
Optional per-plugin: `description`, `version`, `author`, `homepage`, `category`, `tags`.

The `source` field can be:
- A relative path string starting with `./` (for plugins in the same repo)
- An object with `"source": "github", "repo": "owner/repo"` (for plugins in other repos)
- An object with `"source": "url", "url": "https://..."` (for git URLs)

### Validate the marketplace

```bash
claude plugin validate .
```

This validates the marketplace AND all plugins within it.

### How users install

```
# In Claude Code CLI:
/plugin marketplace add owner/repo
/plugin install plugin-name@marketplace-name

# In Cowork desktop:
Settings → Add marketplace → https://github.com/owner/repo
```

## Common Mistakes Reference

See `references/common-mistakes.md` for a catalog of real-world pitfalls.
See `references/plugin-structure.md` for the complete structural reference.

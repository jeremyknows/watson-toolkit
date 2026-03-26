---
name: publish-plugin
description: >
  Format, validate, and package a Cowork plugin for distribution. Use when the user asks to
  "publish a plugin", "package a plugin", "make a .plugin file", "fix my plugin structure",
  "validate my plugin", "why won't my plugin install", or needs help turning a set of skills
  into an installable .plugin file. Also use when troubleshooting plugin installation failures.
---

# Publish Plugin

Package and validate a Claude CoWork plugin for distribution. Handles structure validation, common mistake detection, and .plugin file creation.

**Two distribution paths exist. Know which one you need:**

| Method | What CoWork expects | When to use |
|--------|-------------------|-------------|
| **Zip upload** (.plugin file) | `plugin.json` at zip root, skills/ at zip root | Fastest for private plugins |
| **GitHub marketplace** ("Add marketplace" dialog) | `marketplace.json` at repo root, plugin in `plugins/` subdirectory | Best for version-controlled, shareable plugins |

These are DIFFERENT structures. A zip-uploadable plugin will NOT work as a GitHub marketplace, and vice versa.

## Step 1: Locate the Plugin

Determine where the plugin files are:
- A local directory (e.g., `~/Projects/my-plugin`)
- A GitHub repo URL
- A zip file
- Loose skill files that need to be organized

If the user has loose SKILL.md files, help them create the plugin structure first. See `references/plugin-structure.md` for the canonical layout.

## Step 2: Choose Distribution Path

### Path A: Zip Upload (.plugin file)

Structure the plugin with `plugin.json` at root:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          ← plugin manifest at root
├── skills/
│   └── my-skill/SKILL.md
└── README.md
```

### Path B: GitHub Marketplace

Structure as a marketplace repo with the plugin in a subdirectory:

```
my-marketplace/
├── .claude-plugin/
│   └── marketplace.json     ← ONLY marketplace.json here (NO plugin.json)
├── plugins/
│   └── my-plugin/
│       ├── .claude-plugin/
│       │   └── plugin.json  ← plugin manifest lives HERE
│       └── skills/
│           └── my-skill/SKILL.md
└── README.md
```

**Critical:** `"source": "."` (self-referencing) is INVALID for marketplace entries. The plugin MUST be in a subdirectory. Use `"source": "./plugins/my-plugin"`.

## Step 3: Validate Structure

Run these checks in order:

1. **Correct manifest at root:**
   - Zip upload → `.claude-plugin/plugin.json` exists
   - GitHub marketplace → `.claude-plugin/marketplace.json` exists (NOT plugin.json)

2. **plugin.json has valid fields:**
   - `name` — REQUIRED. Kebab-case, lowercase, max 64 characters
   - `description` — recommended
   - `version` — recommended, semver format
   - `author` — optional, must be object `{"name": "..."}` NOT a string
   - **No `display_name`** — this field fails validation

3. **Every directory under `skills/` contains a `SKILL.md`:**
   ```bash
   for dir in skills/*/; do [ ! -f "$dir/SKILL.md" ] && echo "MISSING: $dir"; done
   ```

4. **Every `SKILL.md` has valid YAML frontmatter** with `name` and `description`. Only use standard fields — `version`, `license`, `author`, `tags`, `metadata` in frontmatter will FAIL validation.

5. **No nested SKILL.md files** inside other skills:
   ```bash
   find skills -name "SKILL.md" -not -path "skills/*/SKILL.md"
   ```
   CoWork counts these as extra skills, inflating the skill count.

6. **No stale files:** nested `.claude-plugin/` dirs inside skills, `.git/` directories inside skill folders.

See `references/common-mistakes.md` for the full list of 10 issues we've encountered.

## Step 4: Run CLI Validation

```bash
cd /path/to/plugin    # or marketplace root
claude plugin validate .
```

This catches schema errors in plugin.json/marketplace.json and frontmatter issues. Fix everything before packaging.

## Step 5: Package as .plugin File (Zip Upload Path Only)

**CRITICAL:** `cd` INTO the plugin directory first. Never zip from the parent folder.

```bash
cd /path/to/plugin
zip -r /tmp/plugin-name.plugin . \
  -x "*.DS_Store" \
  -x "__MACOSX/*" \
  -x ".git/*" \
  -x ".gitignore" \
  -x "node_modules/*"
cp /tmp/plugin-name.plugin ~/Desktop/plugin-name.plugin
```

Use `.plugin` extension, not `.zip`.

## Step 6: Verify

```bash
# For zip uploads — check plugin.json at root
unzip -l ~/Desktop/plugin-name.plugin | grep "plugin.json"

# For GitHub — check marketplace.json at root, plugin.json in subdirectory
cat .claude-plugin/marketplace.json
cat plugins/my-plugin/.claude-plugin/plugin.json
```

Report: skill count, issues fixed, warnings, output location.

## Install Methods

**CoWork (zip upload):** Click "+" next to Personal Plugins > upload the .plugin file

**CoWork (GitHub marketplace):** Click "+" > Add marketplace > `owner/repo` — requires marketplace.json at repo root with plugin in subdirectory

**CLI:** `claude --plugin-dir /path/to/plugin` (session-only) or `claude plugin marketplace add owner/repo` (permanent)

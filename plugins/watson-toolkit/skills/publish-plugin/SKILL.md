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

## Step 1: Locate the Plugin

Determine where the plugin files are:
- A local directory (e.g., `~/Projects/my-plugin`)
- A GitHub repo URL
- A zip file
- Loose skill files that need to be organized

If the user has loose SKILL.md files, help them create the plugin structure first. See `references/plugin-structure.md` for the canonical layout.

## Step 2: Validate Structure

Run these checks in order. Stop and fix each issue before proceeding:

1. **`.claude-plugin/plugin.json` exists at root** — NOT `marketplace.json`. If marketplace.json is present instead, the repo is structured as a marketplace (collection of plugins), not a single plugin. CoWork expects plugin.json for direct install.

2. **plugin.json has required fields:**
   - `name` — kebab-case, lowercase, max 64 characters
   - `description` — string
   - `version` — semver format (e.g., `"1.0.0"`)
   - `author` — must be an object `{"name": "..."}`, NOT a plain string

3. **Every directory under `skills/` contains a `SKILL.md`:**
   ```bash
   for dir in skills/*/; do [ ! -f "$dir/SKILL.md" ] && echo "MISSING: $dir"; done
   ```

4. **Every `SKILL.md` has valid YAML frontmatter** with `name` and `description`:
   ```bash
   for f in skills/*/SKILL.md; do
     head -1 "$f" | grep -q "^---" || echo "BAD FRONTMATTER: $f"
   done
   ```

5. **No nested SKILL.md files** inside other skills:
   ```bash
   find skills -name "SKILL.md" -not -path "skills/*/SKILL.md"
   ```
   If this returns anything, those files will be counted as separate skills by CoWork, inflating the skill count. Move content to `references/` or remove.

6. **No stale files:** Check for `marketplace.json`, nested `.claude-plugin/` dirs inside skills, `.git/` directories inside skill folders.

See `references/common-mistakes.md` for the full list of issues we've encountered.

## Step 3: Run CLI Validation

```bash
cd /path/to/plugin
claude plugin validate .
```

This catches schema errors in plugin.json and frontmatter issues in SKILL.md files. Fix everything it reports before packaging.

## Step 4: Package as .plugin File

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

## Step 5: Verify the Package

```bash
unzip -l ~/Desktop/plugin-name.plugin | head -20
```

Confirm:
- `.claude-plugin/plugin.json` is at the zip root (not nested inside a folder)
- `skills/` is at the zip root
- No `.git/` directory included

Report to the user: skill count, issues fixed, warnings, output location.

## Install Methods

**CoWork (zip upload):** Click "+" next to Personal Plugins > upload the .plugin file

**CoWork (GitHub):** Click "+" > Add from GitHub > `owner/repo` (requires plugin.json at repo root, NOT marketplace.json)

**CLI:** `claude --plugin-dir /path/to/plugin` (session-only) or `claude plugin marketplace add owner/repo` (permanent)

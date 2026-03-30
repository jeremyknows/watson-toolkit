# Common Plugin & Marketplace Mistakes

A catalog of real-world issues and how to fix them. Source: official docs at https://code.claude.com/docs/en/plugin-marketplaces

## 1. Marketplace and plugin sharing the same .claude-plugin/ directory

**Symptom**: "Marketplace sync failed" or "Failed to add marketplace" in Cowork.

**Cause**: Both `marketplace.json` and `plugin.json` exist in the same `.claude-plugin/` directory at the repo root. A marketplace and a plugin are two separate things — they cannot coexist in the same `.claude-plugin/` folder.

**Fix**: Separate them. The marketplace lives at the repo root, the plugin lives in a subdirectory:
```
repo-root/
├── .claude-plugin/
│   └── marketplace.json         ← marketplace ONLY
└── plugins/
    └── my-plugin/
        ├── .claude-plugin/
        │   └── plugin.json      ← plugin ONLY
        └── skills/
```

## 2. Using "source": "." to self-reference

**Symptom**: "Marketplace sync failed" when adding the repo URL.

**Cause**: The marketplace.json has `"source": "."` trying to point the plugin at the repo root itself. This is invalid — the plugin must be in a subdirectory.

**Fix**: Move plugin files into a subdirectory and update the source path:
```json
{
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./plugins/my-plugin"
    }
  ]
}
```

## 3. Plugin files nested inside a subdirectory in the .plugin zip

**Symptom**: Validation passes locally but .plugin file won't install.

**Cause**: The zip was created from the parent directory, so files are nested like `plugin-name/.claude-plugin/plugin.json` instead of `.claude-plugin/plugin.json` at the zip root.

**Fix**: Always `cd` into the plugin directory before zipping:
```bash
# WRONG — creates nested structure
zip -r plugin.plugin plugin-name/

# RIGHT — files at zip root
cd plugin-name && zip -r /tmp/plugin.plugin .
```

## 4. Skill directories with no SKILL.md

**Symptom**: Skill count is lower than expected; some skills don't appear after install.

**Cause**: During file moves or repo restructuring, SKILL.md files were lost while empty directories remained.

**Fix**: Audit every directory under `skills/`:
```bash
for dir in skills/*/; do
  [ ! -f "$dir/SKILL.md" ] && echo "MISSING SKILL.md: $dir"
done
```

## 5. Nested SKILL.md files counted as extra skills

**Symptom**: Skill count is higher than expected.

**Cause**: SKILL.md files exist inside subdirectories of a skill (e.g., `skills/foo/variants/bar/SKILL.md`). These get counted as separate skills alongside `skills/foo/SKILL.md`.

**Fix**: Only put SKILL.md at the `skills/*/SKILL.md` level. Sub-resources go in `references/` without their own SKILL.md.
```bash
# Find any nested SKILL.md files
find skills -name "SKILL.md" -not -path "skills/*/SKILL.md"
# Should return nothing
```

## 6. .zip extension instead of .plugin

**Symptom**: Cowork doesn't recognize the file or shows a generic zip dialog.

**Cause**: The file was saved as `.zip` instead of `.plugin`.

**Fix**: `mv plugin-name.zip plugin-name.plugin`

## 7. Frontmatter name doesn't match directory name

**Symptom**: Skill installs but triggers unpredictably or shows wrong name.

**Fix**: The `name` field in SKILL.md frontmatter must exactly match the skill's directory name.

## 8. Missing or malformed YAML frontmatter

**Symptom**: Skill doesn't appear in the skills list after install.

**Valid format**:
```yaml
---
name: skill-name
description: >
  Third-person description. Use when the user asks to "do something",
  "another trigger phrase", or needs help with a specific task.
---
```

Common YAML pitfalls: unquoted colons, tabs instead of spaces, missing closing `---`.

## 9. Including .git directory in the .plugin package

**Symptom**: .plugin file is unexpectedly large (10x+ expected size).

**Fix**: `zip -r /tmp/plugin.plugin . -x ".git/*"`

## 10. Description field too vague for skill triggering

**Symptom**: Skill never triggers when expected.

**Bad**: `description: Helps with documents`
**Good**: `description: > Generate structured meeting notes from a transcript. Use when the user asks to "summarize this meeting", "create meeting notes", or "extract action items from this transcript".`

## 11. SKILL.md body is too long

**Symptom**: Skill works but is slow to load or causes context issues.

**Fix**: Keep SKILL.md under 2,000 words. Move detail to `references/` files.

## 12. Relative paths in marketplace.json using ../

**Symptom**: Plugin source path validation error.

**Cause**: Source paths in marketplace.json used `../` to climb out of the repo.

**Fix**: From the official docs: "Do not use `../` to climb out of `.claude-plugin/`." Paths resolve relative to the marketplace root (the directory containing `.claude-plugin/`). Use `./plugins/my-plugin`, not `../my-plugin`.

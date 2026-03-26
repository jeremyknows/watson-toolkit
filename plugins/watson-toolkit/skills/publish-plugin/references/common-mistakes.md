# Common Plugin Mistakes

10 real-world mistakes encountered while building and debugging CoWork plugins.

## 1. marketplace.json instead of plugin.json

`.claude-plugin/` has `marketplace.json` at the repo root. CoWork expects `plugin.json` for single-plugin installs. A marketplace is a collection of plugins — a different schema entirely.

**Fix:** Replace marketplace.json with plugin.json, or restructure so plugin.json is at root and marketplace.json is removed.

## 2. Plugin files nested in subdirectory

Zip was created from the parent directory, so files inside the zip are at `plugin-name/.claude-plugin/plugin.json` instead of `.claude-plugin/plugin.json`.

**Fix:** Always `cd` into the plugin directory before zipping:
```bash
cd ~/Projects/my-plugin
zip -r /tmp/my-plugin.plugin .    # correct
# NOT: cd ~/Projects && zip -r /tmp/my-plugin.plugin my-plugin/
```

## 3. Skill directories with no SKILL.md

Empty directories remain after file moves or refactoring.

**Fix:**
```bash
for dir in skills/*/; do [ ! -f "$dir/SKILL.md" ] && echo "MISSING: $dir"; done
```

## 4. .zip extension instead of .plugin

CoWork's upload dialog may not recognize .zip files consistently.

**Fix:** Use `.plugin` extension. It's the same format (a zip archive), just with the expected extension.

## 5. Frontmatter name doesn't match directory

Skill directory is `skills/my-skill/` but SKILL.md has `name: mySkill` or `name: my_skill`.

**Fix:** Make them match exactly. Use kebab-case for both.

## 6. Missing or malformed YAML frontmatter

SKILL.md is missing `---` delimiters, has invalid YAML syntax, or uses non-standard frontmatter fields.

**Valid fields:** `name`, `description`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `model`, `effort`, `context`, `agent`, `hooks`, `paths`, `shell`, `argument-hint`

**Invalid fields that cause failures:** `version`, `license`, `author`, `tags`, `taxonomy_category`, `health_score`, `status`, `metadata`, `homepage`, `repository`, `last_improved`, `display_name`

**Fix:** Strip all non-standard fields. Quote descriptions that contain colons or special characters.

## 7. .git directory in package

Including `.git/` bloats the zip 10x+ and may cause validation issues.

**Fix:** Exclude with `-x ".git/*"` when zipping.

## 8. Description too vague

Skill description is generic like "A helpful tool" — Claude never triggers it because the description doesn't match any user intent.

**Fix:** Include specific trigger phrases in quotes: "Use when the user asks to 'publish a plugin', 'validate my plugin', or 'fix my plugin structure'."

## 9. SKILL.md body too long

Over 3,000 words in a single SKILL.md file.

**Fix:** Move detailed reference content to `references/` subdirectory. Keep SKILL.md under 2,000 words. Claude loads reference files on demand.

## 10. Nested SKILL.md files counted as separate skills

Files like `skills/foo/variants/bar/SKILL.md` or `skills/foo/sub-skill/SKILL.md` get picked up by CoWork as additional skills, inflating the skill count beyond what you intended.

**Fix:** Only put SKILL.md at the `skills/*/SKILL.md` level. Sub-resources go in `references/` without their own SKILL.md. Remove or relocate any nested SKILL.md files.

# Watson Toolkit — Sync Workflow

Skills in watson-toolkit are pulled from three local sources. This doc explains how to keep them current.

## Sources

| Prefix | Location | Used for |
|--------|----------|----------|
| `oc` | `~/.openclaw/skills/` | Most skills — OpenClaw is primary |
| `ow` | `~/.openclaw/agents/main/workspace/skills/` | Agent workspace skills (e.g. random-thought) |
| `cc` | `~/.claude/skills/` | CC-native skills (autoresearch, doc-coauthoring, plan-review) |
| `tk` | Toolkit repo only | Skills with no local source (publish-cowork-plugin) — never synced |

The manifest lives inside `sync-watson-toolkit.sh`. Each entry is `toolkit-name:prefix:source-name`.

---

## Routine Sync (when a skill is updated locally)

```bash
cd ~/Projects/watson-toolkit

# 1. See what's changed
./sync-watson-toolkit.sh

# 2. Apply changes
./sync-watson-toolkit.sh --apply

# 3. Commit + push
git add -A && git commit -m "sync: update skills" && git push

# 4. Publish to npm
npm publish --access public
```

Or in one shot (commits automatically):
```bash
./sync-watson-toolkit.sh --apply-commit && git push && npm publish --access public
```

---

## Adding a New Skill to the Toolkit

1. Author the skill locally (in OC, OW, or CC)
2. Add a line to the `MANIFEST` array in `sync-watson-toolkit.sh`:
   ```bash
   "skill-name:oc:skill-name"   # OpenClaw source
   "skill-name:cc:skill-name"   # CC source
   ```
3. Run `./sync-watson-toolkit.sh --apply`
4. Update skill count in `README.md` and `plugins/watson-toolkit/.claude-plugin/plugin.json`
5. Commit, push, publish

---

## Removing a Skill

1. Remove the line from `MANIFEST` in `sync-watson-toolkit.sh`
2. `rm -rf plugins/watson-toolkit/skills/<skill-name>`
3. Update count in README + plugin.json
4. Commit, push, publish

---

## Compatibility Rule

Skills go in the toolkit only if they work without OpenClaw-specific tools (`cron`, `message`, `nodes`, `sessions_spawn`). OpenClaw-specific docs belong in `references/openclaw.md` inside the skill — not in the core `SKILL.md`.

---

## npm Auth

Publish requires a granular npm token with Read+Write on `watson-toolkit`.  
Token is stored in `~/.npmrc` on Jeremy's Mac mini. Regenerate at npmjs.com → Access Tokens if it expires.

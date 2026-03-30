#!/usr/bin/env bash
set -eo pipefail
# Watson Toolkit Sync — syncs local skills into the toolkit
# Usage: ./sync-watson-toolkit.sh [--apply | --apply-commit]
#
# Sources:
#   oc  = ~/.openclaw/skills/
#   ow  = ~/.openclaw/agents/main/workspace/skills/  (agent workspace)
#   cc  = ~/.claude/skills/
#   tk  = toolkit-only (no local source — never synced, never deleted)

SKILLS="plugins/watson-toolkit/skills"
OC="$HOME/.openclaw/skills"
OW="$HOME/.openclaw/agents/main/workspace/skills"
CC="$HOME/.claude/skills"
MODE="${1:-dry-run}"

# Format: tk_name:prefix:src_name
MANIFEST=(
  # ── OpenClaw skills ──────────────────────────────────
  "brainstorming:oc:brainstorming"
  "complete-code-review:oc:complete-code-review"
  "decide:oc:decide"
  "grill-me:oc:grill-me"
  "humanizer:oc:humanizer"
  "intellectual-honesty:oc:intellectual-honesty"
  "playground:oc:playground"
  "prism:oc:prism"
  "publish-skills:oc:publish-skills"
  "receiving-feedback:oc:receiving-feedback"
  "skill-doctor:oc:skill-doctor"
  "sprint-cowork:oc:sprint-cowork"
  "systematic-debugging:oc:systematic-debugging"
  "writing-plans:oc:writing-plans"
  "x-fetch:oc:x-fetch"
  # ── Agent workspace skills ───────────────────────────
  "random-thought:ow:random-thought"
  # ── Claude Code skills ───────────────────────────────
  "autoresearch:cc:autoresearch"
  "doc-coauthoring:cc:doc-coauthoring"
  "plan-review:cc:plan-review"
  # ── Toolkit-only (no local source — skip sync) ───────
  # publish-plugin  (toolkit-only, maintained in repo directly)
)

STALE=0; CURRENT=0; MISSING=0

echo "=== Watson Toolkit Sync ==="
echo "Mode: $MODE"
echo ""

for entry in "${MANIFEST[@]}"; do
  IFS=: read -r tk_name prefix src_name <<< "$entry"
  case "$prefix" in
    oc) src="$OC/$src_name" ;;
    ow) src="$OW/$src_name" ;;
    cc) src="$CC/$src_name" ;;
  esac
  dst="$SKILLS/$tk_name"

  if [ ! -f "$src/SKILL.md" ]; then
    echo "  [MISSING] $tk_name <- $prefix:$src_name"
    MISSING=$((MISSING + 1))
    continue
  fi

  src_hash=$(md5 -q "$src/SKILL.md")
  dst_hash=$(md5 -q "$dst/SKILL.md" 2>/dev/null || echo "NONE")

  if [ "$src_hash" = "$dst_hash" ]; then
    echo "  [OK]    $tk_name"
    CURRENT=$((CURRENT + 1))
  else
    echo "  [STALE] $tk_name"
    STALE=$((STALE + 1))
    if [[ "$MODE" == --apply* ]]; then
      rm -rf "$dst"
      cp -r "$src" "$dst"
      rm -rf "$dst/.git" "$dst/node_modules"
      echo "          -> synced"
    fi
  fi
done

echo ""
echo "OK: $CURRENT | Stale: $STALE | Missing source: $MISSING | Toolkit-only: 1 (publish-plugin)"

if [[ "$MODE" == "--apply-commit" ]] && [ "$STALE" -gt 0 ]; then
  git add -A
  SKILL_COUNT=$(find "$SKILLS" -maxdepth 2 -name "SKILL.md" | wc -l | tr -d ' ')
  git commit -m "sync: update $STALE skills ($SKILL_COUNT total)"
  echo "Committed."
fi

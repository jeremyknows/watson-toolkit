#!/usr/bin/env bash
set -euo pipefail
# Watson Toolkit Sync — syncs local-type skills into the toolkit
# Usage: ./sync-watson-toolkit.sh [--apply | --apply-commit]

SKILLS="plugins/watson-toolkit/skills"
OC="$HOME/.openclaw/skills"
CC="$HOME/.claude/skills"
MODE="${1:-dry-run}"

# Format: tk_name:prefix:src_name (prefix: oc=OpenClaw, cc=ClaudeCode)
MANIFEST=(
  "brainstorming:oc:brainstorming"
  "grill-me:oc:grill-me"
  "humanizer:oc:humanizer"
  "intellectual-honesty:oc:intellectual-honesty"
  "playground:oc:playground"
  "receiving-feedback:oc:receiving-feedback"
  "autoresearch:cc:autoresearch"
  "doc-coauthoring:cc:doc-coauthoring"
  "plan-review:cc:plan-review"
  "systematic-debugging:cc:systematic-debugging"
  "writing-plans:cc:writing-plans"
)

STALE=0; CURRENT=0
echo "Mode: $MODE"
echo ""

for entry in "${MANIFEST[@]}"; do
  IFS=: read -r tk_name prefix src_name <<< "$entry"
  case "$prefix" in
    oc) src="$OC/$src_name" ;;
    cc) src="$CC/$src_name" ;;
  esac
  dst="$SKILLS/$tk_name"

  if [ ! -f "$src/SKILL.md" ]; then
    echo "  [MISSING SOURCE] $tk_name <- $src"
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
echo "Current: $CURRENT | Stale: $STALE"

if [[ "$MODE" == "--apply-commit" ]] && [ "$STALE" -gt 0 ]; then
  git add -A
  git commit -m "sync: update $STALE local skills"
  echo "Committed."
fi

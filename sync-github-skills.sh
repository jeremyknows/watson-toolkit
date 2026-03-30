#!/usr/bin/env bash
set -euo pipefail
# Re-clone all GitHub-managed skills into the toolkit
# Usage: ./sync-github-skills.sh

SKILLS="plugins/watson-toolkit/skills"

sync_gh() {
  local name="$1" repo="$2" subpath="${3:-}"
  echo "Syncing $name from $repo..."
  local tmp=$(mktemp -d)
  git clone --depth 1 "$repo" "$tmp" 2>&1 | tail -1
  if [[ -n "$subpath" ]]; then
    if [[ ! -d "$tmp/$subpath" ]]; then
      echo "ERROR: subpath '$subpath' not found in $repo — aborting $name sync (keeping existing copy)"
      rm -rf "$tmp"
      return 1
    fi
    rm -rf "$SKILLS/$name"
    cp -r "$tmp/$subpath" "$SKILLS/$name"
  else
    rm -rf "$SKILLS/$name"
    mv "$tmp" "$SKILLS/$name"
  fi
  rm -rf "$tmp" "$SKILLS/$name/.git"
}

sync_gh "autoresearch"         "https://github.com/uditgoenka/autoresearch.git" ".claude/skills/autoresearch"
sync_gh "complete-code-review" "https://github.com/jeremyknows/complete-code-review.git"
sync_gh "decide"               "https://github.com/jeremyknows/decide.git"
sync_gh "humanizer"            "https://github.com/blader/humanizer.git"
sync_gh "prism"                "https://github.com/jeremyknows/PRISM.git"
sync_gh "publish-skills"       "https://github.com/jeremyknows/publish-skills.git"
sync_gh "random-thought"       "https://github.com/jeremyknows/random-thought.git"
sync_gh "skill-doctor"         "https://github.com/jeremyknows/skill-doctor.git"
sync_gh "x-fetch"              "https://github.com/jeremyknows/x-fetch.git"

echo ""
echo "Done. Run 'git diff --stat' to review, then commit."

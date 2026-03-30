#!/usr/bin/env bash
set -euo pipefail
# Re-clone all GitHub-managed skills into the toolkit
# Usage: ./sync-github-skills.sh

SKILLS="plugins/watson-toolkit/skills"

sync_gh() {
  local name="$1" repo="$2"
  echo "Syncing $name from $repo..."
  rm -rf "$SKILLS/$name"
  git clone --depth 1 "$repo" "$SKILLS/$name" 2>&1 | tail -1
  rm -rf "$SKILLS/$name/.git"
}

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

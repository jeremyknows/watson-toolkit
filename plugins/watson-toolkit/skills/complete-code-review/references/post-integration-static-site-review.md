# Post-integration static site review sequence

Use when a static/exported marketing or portfolio site has been manually integrated from multiple slices and the user asks for final packaging, review readiness, or post-merge cleanup.

## Sequence

1. **Freeze scope first**
   - Record branch, HEAD, `git status --short --branch`, `git diff --stat`.
   - Note untracked review/design artifacts separately from source changes.

2. **Whole-repo code review**
   - Review active route graph, static export config, local assets/downloads, external links, and stale duplicate component/data paths.
   - For Next static export, check route portability: `output: 'export'`, `trailingSlash`, `out/<route>/index.html`, and clean-route smoke.

3. **Conservative hygiene**
   - Remove unused imports/exports and stale duplicate component/data islands only when search proves no active imports.
   - Do not delete public assets or legacy public URLs unless compatibility is explicitly out of scope.
   - Prefer deleting stale duplicate data sources over migrating active routes back to older abstractions.

4. **UI polish pass**
   - Make small tactile improvements: focus/hover affordances, link weight, card lift, spacing hierarchy.
   - No broad redesign after integration unless a verified layout/design problem requires it.

5. **Accuracy-to-source pass**
   - Extract text from source PDFs (`pdftotext`) and compare role names, credits, training claims, measurements, unions, and contact claims.
   - If inline content is selected/curated rather than complete, label it as selected highlights instead of claiming it is the full source artifact.
   - For unsupported but plausible claims from other briefs, either keep with a caveat or soften; do not invent rep/agent/business details.

6. **Verification before report**
   - `git diff --check`
   - build command (`npm run build`, `pnpm build`, etc.)
   - static serve from `out`
   - smoke both slash/no-slash routes when route-shape changed
   - browser/DOM overflow audit at mobile/tablet/desktop
   - visual QA of the key page and featured decision
   - stop server and verify the port is clear

## Report shape

Keep the report low-cognitive-load:

- Changes made
- Review findings fixed / findings left as caveats
- Fresh evidence with exit codes/counts
- Files touched/deleted
- Explicit forks/caveats needing human judgment
- Review-ready verdict only after verification

# Pre-PR proof-package review checklist

Use when reviewing a locally packaged PR candidate before push/open-PR, especially runtime/gate/proof work where source changes, tests, evidence artifacts, and PR copy can diverge.

## Scope freeze

Before spawning reviewers or self-reviewing, capture:

```bash
REPO=/absolute/path/to/repo
git -C "$REPO" status --short --branch
git -C "$REPO" rev-parse HEAD
git -C "$REPO" log --oneline --decorate -5
git -C "$REPO" diff --name-status origin/main...HEAD
```

Record whether the branch is pushed and whether a PR exists. If HEAD moves during review, review the new delta as an addendum before recommending push/open-PR.

## Components to review

Do not limit review to source code. Review every PR component that can carry a claim:

- source changes;
- tests/specs/fixtures/scripts;
- generated or retained proof artifacts;
- evidence-package reports/manifests/privacy scans;
- PR body draft and any release notes;
- gate/status/anchor language changed by the package lane.

## Reviewer split

For 2–3 focused reviewers, split by risk surface:

1. **Runtime/business logic reviewer** — source paths and tests that decide accept/drop behavior, routing, permissions, state transitions, or data mutation.
2. **Safety/process reviewer** — launchers, preflights, credentials, child processes, cleanup, logs, and fail-closed behavior.
3. **Evidence/PR-copy reviewer** — proof artifacts, manifests, privacy scans, PR body, “what was not tested,” and any gate/readiness claims.

Each reviewer should return PASS/FAIL, confidence, concrete file/line findings, and whether each finding blocks push/open-PR.

## Findings discipline

For every surfaced issue:

1. Restate the technical claim.
2. Verify against source truth, changed files, proof artifacts, or command output.
3. Classify as valid blocker, valid non-blocker, false positive, or operator fork.
4. If fixed, rerun affected verification and the full maintainer-facing check set.
5. If rejected, document the evidence and avoid performative agreement.

## Final recommendation

End with one of:

- **Push/open PR** — all review findings resolved, fresh verification passed, PR body matches actual proof.
- **Hold for fixes** — blockers remain or verification fails.
- **Operator fork** — the next action changes scope, risk posture, or public/external side effects.

Strong proof evidence is not authorization to push, run live traffic, move routes, or close gates. Keep side effects separate from the review recommendation unless explicitly authorized.

## Pitfalls from proof-package review lanes

- **A review fix moves the package target.** If the review lane finds and commits a local fix, the PR body is no longer truthful until HEAD, ahead count, diff stat, commit list, verification output, and final recommendation are refreshed against the new commit. Rerun maintainer-facing verification post-commit when build/preflight output embeds `HEAD`.
- **Prior evidence reports can be true but superseded.** A pre-clean report/manifest may accurately describe an earlier dirty/ahead state. Do not cite it as current package metadata after a clean packaging or review-fix commit; either refresh it or mark it explicitly superseded/local-evidence in the PR body/report.
- **Do not trust `review_safe_summary` labels blindly.** Retained proof reports may contain raw platform IDs, marker text, ACK text, or private correlation handles even when a manifest classifies them as review-safe. Scan/spot-check the actual artifact before attaching/pasting it publicly; public PR copy should usually cite booleans, sanitized summaries, and local artifact paths only.

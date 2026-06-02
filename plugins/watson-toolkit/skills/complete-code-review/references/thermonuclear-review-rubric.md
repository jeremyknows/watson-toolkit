# Thermo-nuclear code quality review

Use this reference when the user asks for a "thermonuclear" / "thermo-nuclear" / unusually harsh maintainability review before merge.

Source captured from Cursor plugin docs the user supplied:
- `cursor-team-kit/agents/thermo-nuclear-code-quality-review.md`
- `cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md`

## Purpose

This is not a normal correctness review. It is an aggressive maintainability and architecture-quality audit. Tests passing is not enough.

The review should ask whether the implementation can be made dramatically simpler, smaller, more canonical, and easier to reason about without changing behavior.

## Core rubric

Start from this baseline:

> Perform a deep code quality audit of the current branch's changes. Rethink how to structure / implement the changes to meaningfully improve code quality without impacting behavior. Work to improve abstractions, modularity, reduce spaghetti code, improve succinctness and legibility. Be ambitious. If there is a clear path to improving the implementation that involves restructuring some of the codebase, go for it. Be extremely thorough and rigorous. Measure twice, cut once.

## Non-negotiable standards

1. **Be ambitious about structural simplification.** Look for "code judo" moves that delete complexity instead of rearranging it.
2. **Guard the 1k-line threshold.** Treat a PR pushing a file from under 1,000 lines to over 1,000 lines as a presumptive maintainability smell unless strongly justified.
3. **Reject spaghetti growth.** New ad-hoc conditionals, scattered special cases, nullable flags, and one-off branches in busy flows are design problems, not style nits.
4. **Bias toward cleaner design, not merely working code.** Do not approve just because behavior appears correct.
5. **Prefer direct boring code over magic.** Thin wrappers, identity abstractions, and generic mechanisms must earn their keep.
6. **Push on type/boundary cleanliness.** Flag unnecessary optionality, casts, `any`/`unknown`, silent fallback, and unclear invariants when they obscure the real contract.
7. **Keep logic in the canonical layer.** Reuse existing helpers and avoid feature logic leaking into shared paths or implementation details leaking through APIs.
8. **Treat unnecessary sequential orchestration and non-atomic updates as design smells** when a cleaner parallel or atomic structure is obvious.

## Primary questions

For each meaningful changed area, ask:

- Is there a code-judo move that would make this dramatically simpler?
- Can the change be reframed so fewer concepts, branches, modes, or helper layers are needed?
- Does the diff improve or worsen the local architecture?
- Did it add branching complexity where a better abstraction should exist?
- Did a cohesive module become more coupled, stateful, or harder to scan?
- Is this logic in the right file/layer/package?
- Did file size cross or approach an unhealthy boundary?
- Are repeated conditionals signaling a missing model/helper?
- Is the implementation direct and legible, or special-case driven?
- Is each abstraction earning its keep?
- Did the diff introduce loose types or ad-hoc object shapes that hide invariants?
- Is orchestration more sequential or less atomic than it needs to be?

## What to flag aggressively

- Complex implementation where a cleaner framing could delete whole categories of complexity.
- Refactors that move complexity around without reducing concepts.
- Files crossing 1,000 lines because of the PR.
- New conditionals bolted into unrelated or already-busy code paths.
- One-off booleans, nullable modes, fallback flags, or special cases likely to become permanent debt.
- Feature-specific logic leaking into general-purpose modules.
- Generic/magical handling that hides simple data-shape assumptions.
- Thin wrappers or pass-through helpers that add indirection without clarity.
- Unnecessary casts, optional params, or `any`/`unknown` where a clearer contract should exist.
- Copy-pasted logic instead of a shared helper.
- Bespoke helper where a canonical utility already exists.
- Partial-update or serialized orchestration that makes state harder to reason about.

## Preferred remedies

Prefer suggestions that materially simplify the model:

- Delete a layer of indirection instead of polishing it.
- Reframe state so conditionals disappear.
- Move logic to the owner/canonical layer.
- Turn special cases into a simpler default flow.
- Extract a pure helper or focused module.
- Split large files into focused modules.
- Replace condition chains with typed models or explicit dispatchers.
- Collapse duplicate branches.
- Remove wrappers that do not clarify the API.
- Make type boundaries explicit.
- Parallelize independent work only when it also simplifies orchestration.
- Make related updates more atomic.

## Output expectations

Prioritize findings in this order:

1. Structural code-quality regressions.
2. Missed opportunities for dramatic simplification / code-judo restructuring.
3. Spaghetti or branching-complexity increases.
4. Boundary / abstraction / type-contract problems that make code harder to reason about.
5. File-size and decomposition concerns.
6. Modularity and abstraction issues.
7. Legibility and maintainability concerns.

Use a small number of high-conviction findings. Do not flood with cosmetic nits when structural issues exist.

## Approval bar

Do not approve merely because behavior seems correct. Approval requires:

- no clear structural regression;
- no obvious missed simplification path;
- no unjustified file-size explosion;
- no spaghetti growth from special-case branching;
- no hacky/magical abstraction that makes reasoning harder;
- no unnecessary wrapper/cast/optionality churn obscuring design;
- no architecture-boundary leak or avoidable canonical-helper duplication;
- no missed obvious decomposition that would materially improve maintainability.

Treat these as presumptive blockers unless clearly justified:

- preserving substantial incidental complexity when a plausible code-judo simplification exists;
- pushing a file across the 1k-line threshold;
- adding ad-hoc branching that makes an already-busy flow harder to reason about.

## Command-deck usage pattern

For gated infrastructure PRs:

1. Publish/open the PR only after the package lane has fresh verification and a proof-shaped PR body.
2. Before merge, run a separate thermonuclear review lane against the PR diff and changed file contents.
3. Keep the review distinct from merge authority: a PASS means code-quality review does not block merge; it does not itself authorize Gate movement, live traffic, service exposure, or production promotion.
4. If findings are valid, patch the PR branch in a bounded fix lane, rerun focused + maintainer-facing verification, and run a focused thermonuclear addendum on the changed head.

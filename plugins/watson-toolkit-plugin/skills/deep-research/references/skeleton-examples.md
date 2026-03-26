# Skeleton Examples

**Read when:** Stage 4, building your first skeleton or unsure what a good one looks like.

---

## Example: Tool Eval

```
Hypothesis: We should adopt X because it directly fills our Y gap without introducing Z complexity.

Skeleton:
1. X solves the specific gap we have (Y)
2. The architecture is compatible with our existing stack
3. Maintenance burden is low (active dev, responsive issues)
4. Cost is justified by the time saved
5. Migration path exists if we need to exit
[Counterargument placeholder — Stage 6 will fill this]
```

---

## Example: Stage 6 Changed the Conclusion

Before Stage 6:
> Hypothesis: We should migrate from library A to library B because B is faster.
> Confidence: High — 4 benchmarks show 3x speed improvement.

Stage 6 counterargument:
> "The strongest reason NOT to migrate is that library B has no TypeScript types and our
> codebase is 100% TypeScript. Every usage would require manual type casting."

After Stage 6:
> Revised hypothesis: Library B is faster but the migration cost is prohibitive given our TypeScript
> dependency. Recommend: watch B for official TS support, revisit in 6 months.
> Confidence: Medium (downgraded — counterargument was strong).

**This is the correct outcome.** The hypothesis changed. Stage 6 wasn't theater.

---

## Example: Stage 6 Didn't Change the Conclusion (Correctly)

Before Stage 6:
> Hypothesis: We should use Vercel for deployment because it's zero-config for Next.js.

Stage 6 counterargument:
> "The strongest reason NOT to use Vercel is vendor lock-in."

Response:
> "This counterargument is weak because: (1) our app uses standard Next.js with no
> Vercel-proprietary features, (2) we can migrate to any Node host with 1 day of work,
> (3) the lock-in risk is theoretical, not demonstrated."

Confidence: High (unchanged — counterargument was weak and addressed).

---

## What "Weak Counterargument" Means

A counterargument is **weak** when you can articulate ALL of these:
1. Why the risk is unlikely or already mitigated
2. Why the cost of the risk is low even if it occurs
3. Why a reasonable person would still proceed given the evidence

If you can't articulate all three, the counterargument is at least **moderate** — downgrade to Medium.

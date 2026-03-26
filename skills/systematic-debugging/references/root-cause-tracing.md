# Root Cause Tracing

Technique for tracing bugs backward through a call stack to find the original trigger.

## The Backward Tracing Method

When an error occurs deep in a call stack, resist the urge to fix at the error site. The error is a symptom; the root cause is upstream.

**Process:**
1. Start at the error location
2. Ask: "What called this with the bad value/state?"
3. Move one level up the call stack
4. Ask: "Where did THIS receive the bad value?"
5. Repeat until you find the origination point — the place where the bad value was first created or the wrong assumption was first made

**Example:**
```
Error: TypeError: cannot read property 'id' of undefined
  at formatUser (user.js:45)           ← symptom
  at renderProfile (profile.js:12)     ← passed undefined here
  at handleRoute (router.js:88)        ← called renderProfile without checking
  at loadUser (api.js:23)              ← returned null instead of user object ← ROOT CAUSE
```

Fix at `api.js:23` (null return), not at `user.js:45` (the crash site).

## When Tracing Gets Complex

For multi-layer systems, map the data flow first:

```
Input → [Component A] → [Component B] → [Component C] → Output
                          ↑ where does bad data appear first?
```

Add logging at each boundary (log SET/UNSET for secrets, never raw values), run once, then read the output to identify which component produced the bad value.

## Signs You've Found the Root Cause

- The fix is at the origination point, not where the error manifests
- You can explain WHY the bad value was produced (not just where)
- Fixing it here prevents the error without needing defensive checks downstream
- A simple test at this level would catch this bug

## Signs You're Still at a Symptom

- Your fix is "check for null before using" at the crash site
- The fix requires changes in multiple places
- You're not sure why this value is wrong, only that it is

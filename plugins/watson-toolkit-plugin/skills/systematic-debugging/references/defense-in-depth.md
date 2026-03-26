# Defense in Depth

Patterns for adding validation at multiple layers after finding root cause.

## When to Apply

After fixing the root cause, consider whether defensive validation at other layers would prevent similar bugs in the future. This is NOT about masking the root cause — it's about building resilience into the system.

Apply when:
- The root cause was a contract violation between components
- The same class of bug has appeared multiple times
- A component receives input from an untrusted or error-prone source

## Pattern: Validate at Entry Points

Add validation where data enters a component, not (only) where it's used:

```typescript
// Weak: validate at use site
function formatUser(user) {
  if (!user?.id) return 'Unknown'; // defensive, but masks root cause
  return `User ${user.id}`;
}

// Strong: validate at entry point + fix root cause
function loadUser(id: string): User {
  const result = db.find(id);
  if (!result) throw new UserNotFoundError(id); // explicit contract
  return result;
}
```

## Pattern: Layer Logging for Observability

After a debugging session, leave structured logging at component boundaries:

```bash
# Log presence without exposing sensitive values
echo "AUTH_TOKEN: ${AUTH_TOKEN:+SET}${AUTH_TOKEN:-UNSET}"
echo "Component A output: $(cat /tmp/component-a-output.json | jq '.status')"
```

This builds observability for future issues without cluttering logs with sensitive data.

## Pattern: Contract Tests

Add a test that validates the contract between components, not just the behavior of each:

```typescript
describe('User API → Profile Renderer contract', () => {
  it('loadUser always returns User or throws, never null/undefined', async () => {
    await expect(loadUser('nonexistent')).rejects.toThrow(UserNotFoundError);
    // never resolves to null
  });
});
```

## When NOT to Add Defense in Depth

- Don't add null checks at every use site to mask a null-return bug — fix the null return
- Don't add try/catch wrappers that swallow errors — they hide future bugs
- Don't add validation layers that duplicate logic already present elsewhere — creates drift

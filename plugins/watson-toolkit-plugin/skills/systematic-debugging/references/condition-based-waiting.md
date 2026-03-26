# Condition-Based Waiting

Replace arbitrary timeouts with condition polling for more reliable async debugging and testing.

## The Problem with Arbitrary Timeouts

```bash
# Fragile: works on fast machines, fails on slow CI
sleep 5
run_next_step
```

Arbitrary sleeps create flaky tests and mask timing-dependent bugs. They're also a common source of Heisenbugs — the sleep "fixes" a race condition without revealing it.

## Condition Polling Pattern

Wait for a specific condition to be true, with a timeout as a safety net:

```bash
# Robust: wait until service is ready, up to 30s
wait_for_condition() {
  local condition_cmd="$1"
  local timeout="${2:-30}"
  local interval="${3:-1}"
  local elapsed=0

  while ! eval "$condition_cmd" 2>/dev/null; do
    if [ "$elapsed" -ge "$timeout" ]; then
      echo "Timeout after ${timeout}s waiting for: $condition_cmd" >&2
      return 1
    fi
    sleep "$interval"
    elapsed=$((elapsed + interval))
  done
  return 0
}

# Usage
wait_for_condition "curl -sf http://localhost:3000/health" 30 2
```

## JavaScript/TypeScript Pattern

```typescript
async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeoutMs = 10000,
  intervalMs = 100
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await condition()) return;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Condition not met within ${timeoutMs}ms`);
}

// Usage in tests
await waitForCondition(() => db.isConnected(), 5000);
await waitForCondition(async () => {
  const status = await api.getJobStatus(jobId);
  return status === 'complete';
}, 30000, 500);
```

## Diagnosing Race Conditions

When you suspect a race condition:

1. **Add timestamps** to every state transition
2. **Log thread/process IDs** alongside state changes
3. **Use condition polling** instead of sleeps — if the race disappears, you've confirmed it
4. **Add explicit synchronization** (mutex, lock, atomic) at the identified race point

```bash
# Debugging: timestamp every state change
echo "[$(date +%s.%N)] State: $STATE pid:$$"
```

## When to Use Arbitrary Timeouts (Legitimately)

- Limiting total time for an external API call (network timeout, not race condition)
- UI animations where exact duration matters for UX
- Rate limiting (intentional delay between requests)

If you're using sleep to "let something finish" — that's a race condition. Use condition polling instead.

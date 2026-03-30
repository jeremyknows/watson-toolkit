---
name: sprint-cowork
description: >
  Run autonomous work sprints with periodic check-ins and goal tracking.
  Use this skill whenever the user wants autonomous, background, or scheduled work — even if they
  don't say "sprint". Trigger phrases: "sprint on X", "work on this for the next 2 hours",
  "keep working on X while I'm away", "run this overnight", "work on this while I sleep",
  "keep going on X", "check this every hour", "autonomous sprint", "start a sprint",
  "deep work session on X", "can you do this in the background".
  Sets up a scheduled task that wakes on an interval, reads goals and state, dispatches workers
  via sub-agents, tracks progress, and synthesizes results. The core value is "walk away" work —
  the user starts it, leaves, and comes back to finished results.
  Supports self-scoping sprints — give a vague topic like "improve security" or "reduce tech debt"
  and the first cycle discovers specific goals automatically.
  NOT for: work requiring frequent human decisions, single quick tasks that fit in one session,
  or externally-facing actions (deployments, emails, posts).
license: MIT
compatibility: "Cowork (scheduled tasks + Agent tool), Claude Code (while-loop)"
metadata:
  author: jeremyknows
  version: "1.0.0"
---

# Sprint

Autonomous, goal-driven work sessions. You define what needs to get done. Sprint runs workers in cycles until it's done or time runs out.

> **Before writing goals:** Sprint quality is determined almost entirely by how goals are written. Thematic goals ("analyze the codebase") produce dramatically worse output than specific goals ("find all functions with >50 lines, extract to modules, write tests for each"). Write goals as graded tests with acceptance criteria.

## Quick Start (Standard Sprint)

For the common case — 2-4 atomic goals, medium autonomy, ~2 hours — follow these 4 steps:

**Step 1.** Turn the user's request into goals using the Goal-Writing Checklist (in Phase 1 below). Each goal needs: `description` (specific deliverable + output filename), `context` (file paths, commands, domain knowledge), `depends_on` (ordering), `acceptance` (machine-checkable command).

**Step 2.** Create `[working-dir]/sprint-[id]/sprint-state.json` with the goals. Use the schema in Phase 1 → Setup Actions. Set `cycle_interval_min: 25`, `max_workers: 2`, `autonomy_level: "medium"`.

**Step 3.** Create the scheduled task via `create_scheduled_task`. The `prompt` must be the COMPLETE director protocol from Phase 2, with all [BRACKETED] values filled in — including every goal's description, context, depends_on, and acceptance inlined into the prompt. The prompt must be 100% self-contained (the scheduled session has no memory of this conversation). Set `notifyOnCompletion: true`.

**Step 4.** Create `sprint-progress.md`, confirm to the user, and tell them they can walk away.

> **See the Worked Example section at the bottom for a real sprint that completed successfully — copy its patterns.**

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│  USER: "Sprint on X for 3 hours"                        │
│                                                         │
│  Phase 1: Setup (interactive, this session)              │
│  ┌─────────────┐     ┌──────────────────────────────┐   │
│  │ Define goals │────▶│ Creates:                     │   │
│  │ Set duration │     │  • sprint-state.json         │   │
│  │ Pick interval│     │  • scheduled task (cron)     │   │
│  └─────────────┘     └──────────────────────────────┘   │
│                                                         │
│  Phase 2: Director (fires automatically every N min)    │
│  ┌──────────┐  read   ┌──────────┐  spawn  ┌────────┐  │
│  │ Director │◀────────│  state   │         │Worker 1│  │
│  │  (tick)  │────────▶│  .json   │         │Worker 2│  │
│  └──────────┘  write  └──────────┘         └────────┘  │
│       │                                                 │
│       ▼                                                 │
│  sprint-progress.md  (human-readable log, always fresh) │
│                                                         │
│  Phase 3: Synthesis (when goals met or time expires)    │
│  ┌─────────────┐                                        │
│  │ Final report │──▶ SPRINT-REPORT.md + disable task    │
│  └─────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Sprint Setup

When the user triggers sprint, gather this information conversationally:

### Required
1. **Topic** — What's the sprint about? Must be concrete and self-contained.
2. **Goals** — What specific outcomes? Break into discrete objectives with acceptance criteria. **Use the goal-writing checklist below.**
3. **Working directory** — Where do files live? Use the user's selected folder.
4. **Duration** — How long? Default: 2 hours.

### Optional (propose defaults, confirm)
5. **Cycle interval** — How often should the director fire? Default: 25 minutes.
6. **Max workers per cycle** — How many sub-agents at once? Default: 2.
7. **Autonomy level** — low (research only) / medium (can create files) / high (can modify existing files). Default: medium.

### Standard vs Self-Scoping Sprints

After gathering the topic, decide which path to take:

**Standard sprint** — Use when the user's request can be broken into 2-4 specific goals right now. Example: "Sprint on cleaning up all TODO comments in src/" — you know exactly what to scan, categorize, and fix. Write the goals using the checklist below.

**Self-scoping sprint** — Use when the user's request is thematic, exploratory, or too vague to write specific goals. Example: "Sprint on improving the security of this codebase" or "Sprint on reducing tech debt" — you don't know what the specific issues are yet. Create a single **discovery goal** as g0 that scans/researches the codebase, then writes concrete goals for the director to pick up in subsequent cycles.

A discovery goal looks like this:
```json
{
  "id": "g0",
  "type": "discovery",
  "description": "Scan the codebase for security issues. Identify specific, actionable problems. Write goal-proposals.json with 2-4 concrete goals for the sprint to execute.",
  "context": "Source code is in src/. Check for: hardcoded secrets (grep for API_KEY, SECRET, PASSWORD), SQL injection (raw SQL strings), missing input validation, outdated dependencies (check package.json). Focus on issues fixable by file edits, not architectural changes.",
  "depends_on": [],
  "status": "pending",
  "acceptance": "goal-proposals.json exists in sprint dir with 2+ goals, each having description, context, acceptance fields.",
  "artifacts": [],
  "progress_notes": ""
}
```

The `type: "discovery"` field tells the director to merge the proposed goals into state.json after this goal completes. Discovery goals always go first (g0) and all proposed goals automatically get `depends_on: ["g0"]`.

When writing a discovery goal's context, be specific about WHERE to look and WHAT patterns to search for — the discovery worker still needs guidance on scope, even though it's deciding the goals. "Scan for security issues" is vague. "Check src/ for hardcoded secrets (grep API_KEY, SECRET), raw SQL strings, missing auth middleware on routes" gives the worker a concrete search plan.

### Goal-Writing Checklist

When converting the user's request into goals, run each goal through this checklist. A goal that fails any item will produce poor worker output.

**For each goal's `description`:**
- [ ] States a concrete deliverable, not an activity ("Write X" not "Work on X")
- [ ] Names the output file(s) and their format (markdown table, JSON, prose report)
- [ ] Is completable by one worker in ~10 minutes

**For each goal's `context`:**
- [ ] Lists specific file paths or directories the worker should read
- [ ] States what tools or commands to use (grep, ls, test -f, jq, etc.)
- [ ] Includes domain knowledge the worker wouldn't have (project conventions, naming patterns, what "done" looks like)
- [ ] If iterative: tells the worker where prior cycle output lives (which files to read first)

**For each goal's `acceptance`:**
- [ ] Is a command or file check, not a judgment call
- [ ] Could be verified by a script with zero human interpretation
- [ ] Examples: `test -f file.md`, `grep -c 'pattern' file | test $(cat) -ge 10`, `wc -l file | awk '{print $1}'`, `jq '.goals | length' state.json`

**For the goal set as a whole:**
- [ ] Goals are ordered smallest → largest (build momentum)
- [ ] Dependencies are explicit (g2 depends_on g1 if it reads g1's output)
- [ ] No two goals write to the same file
- [ ] At least one goal is atomic (completable in a single cycle) so the sprint shows progress in cycle 1

### Setup Actions

**1. Create sprint directory and state file:**

Create `[working-dir]/sprint-[id]/` with:

```json
// sprint-state.json
{
  "sprint_id": "sprint-2026-03-29-1422",
  "topic": "Audit and fix all TODO comments in the project",
  "created": "2026-03-29T14:22:00-04:00",
  "expires": "2026-03-29T17:22:00-04:00",
  "status": "active",
  "autonomy_level": "medium",
  "cycle_count": 0,
  "cycle_interval_min": 25,
  "max_workers": 2,
  "consecutive_stalls": 0,
  "goals": [
    {
      "id": "g1",
      "type": "execution",
      "description": "Find all TODO comments in src/. Write todo-inventory.md with file path, line number, and TODO text for each.",
      "context": "Source code is in src/. Use grep -rn 'TODO' to find them. Output as a markdown table with columns: File, Line, Comment.",
      "depends_on": [],
      "status": "pending",
      "acceptance": "todo-inventory.md exists with a markdown table. grep -c 'TODO' across src/ matches row count.",
      "artifacts": [],
      "progress_notes": ""
    },
    {
      "id": "g2",
      "type": "execution",
      "description": "Categorize each TODO from g1 as 'bug', 'enhancement', or 'tech-debt'. Write todo-categorized.md with the categories and priority (high/medium/low).",
      "context": "Read todo-inventory.md from g1. For each TODO, read surrounding code context to determine category. Bugs = broken behavior. Enhancement = missing feature. Tech-debt = code quality.",
      "depends_on": ["g1"],
      "status": "pending",
      "acceptance": "todo-categorized.md exists with all rows from g1 plus Category and Priority columns.",
      "artifacts": [],
      "progress_notes": ""
    }
  ],
  "cycle_log": []
}
```

**2. Create the scheduled task:**

Call `create_scheduled_task` with the FULL director prompt embedded. This is critical — each scheduled invocation is a fresh session with NO memory of this conversation. The prompt must be 100% self-contained.

```
taskId: "sprint-2026-03-29-1422"
cronExpression: "*/25 * * * *"
description: "Sprint: Audit and fix all TODO comments in the project"
notifyOnCompletion: true
prompt: [THE FULL DIRECTOR PROMPT FROM PHASE 2 BELOW, WITH ALL VALUES FILLED IN]
```

> **Important:** Set `notifyOnCompletion: true` so the user gets a notification after each cycle completes. This is the user's main feedback channel while they're away.

**3. Create initial sprint-progress.md:**

```markdown
# Sprint: [topic]

**ID:** [sprint_id]
**Started:** [timestamp]
**Expires:** [timestamp]
**Cycle:** every [N] minutes
**Goals:** [count]

---

## Progress

(Cycles will be appended below as the sprint runs)
```

**4. Confirm to user:**

Tell them the sprint is running, what the goals are, when it expires, and that they can check `sprint-progress.md` anytime. They can walk away now.

---

## Phase 2: Director Protocol

The director prompt is the full set of instructions that runs inside each scheduled task cycle. It must be 100% self-contained — the scheduled session has no memory of the setup conversation.

**Option A (recommended): Generate the prompt automatically.**
Run the bundled script, which reads sprint-state.json and outputs the fully rendered prompt:
```bash
python scripts/generate-director-prompt.py sprint-state.json <MOUNT_NAME> <SPRINT_FOLDER_REL_PATH>
```
Example: `python scripts/generate-director-prompt.py ./sprint-state.json my-project sprint-cowork/my-sprint`

Copy the output and pass it as the `prompt` parameter to `create_scheduled_task`.

**Option B: Fill in the template manually.**
Read `references/director-template.md`, fill in all `[BRACKETED]` values, and pass the result as the prompt.

The director protocol follows 7 steps each cycle: (1) discover paths + read state, (2) assess goal progress, (3) check for completion/expiry, (4) plan this cycle's work, (5) dispatch workers with full context from prior cycles, (6) collect results and update progress_notes, (7) update state + log. On completion or expiry, it runs synthesis and disables the scheduled task. Full details are in the template.

---

## Stopping a Sprint

The user can stop a sprint anytime:

**Option 1 — Edit state:** Open `sprint-state.json`, change `"status"` to `"stopped"`. Next director tick reads it and exits.

**Option 2 — Tell Cowork:** "Stop my sprint" → Read sprint-state.json, get the `sprint_id`, call `update_scheduled_task(taskId=sprint_id, enabled=false)`, write partial synthesis.

**Option 3 — List and disable:** Run `list_scheduled_tasks` to find the sprint task, then `update_scheduled_task(taskId=..., enabled=false)`.

When stopping early, always write a partial synthesis so the work isn't lost.

---

## Autonomy Levels

| Level | Workers can | Workers cannot | Use when |
|-------|------------|----------------|----------|
| **low** | Read, research, analyze, propose | Create files, modify anything | Exploring unfamiliar territory |
| **medium** | All of low + create new files | Modify existing files, delete anything | Standard — balanced safety + productivity |
| **high** | All of medium + modify existing files | Delete files, run destructive commands | Trusted, well-scoped tasks after supervised success |

**Progression:** First sprint on a topic → low. After reviewing output and it's good → medium. After 2+ successful medium sprints → high.

---

## When to Use Sprint (vs a Simple Task List)

Sprint's value is the **cron loop** — autonomous work that fires on a schedule without an active session. If you're sitting at your computer watching, a simple prompted task list ("do these 5 things") in a normal Cowork session is usually better.

**Use Sprint when:**
- **Walk-away work.** You want to start something, leave (sleep, meetings, errands), and come back to results. A normal session requires you to be present.
- **Time-gated execution.** "Run this at 3am" or "Work on this overnight." Sprint fires on a cron schedule.
- **Work that benefits from assessment between passes.** The director evaluates progress between cycles, detects stalls, and adjusts approach. A task list just fires sequentially with no mid-course correction.
- **Long-running work that exceeds session limits.** Sprint breaks work into 8-10 minute worker chunks across many cycles. No single session needs to stay alive for hours.
- **Work requiring stall recovery.** If a worker fails or produces nothing, the director detects it next cycle and tries a different approach. A task list just stops.

**Use a prompted task list when:**
- **You're present and can give feedback.** You can redirect, answer questions, clarify ambiguity in real time. Sprint workers can't ask you anything mid-cycle.
- **Work fits in a single session** (under ~60 minutes total). Sprint's overhead — state management, scheduled task creation, 25-minute cycle gaps — isn't worth it for quick work.
- **Tasks require human judgment at each step.** "Should I refactor this as a class or a function?" Sprint workers just pick one. You'd catch this instantly in a live session.
- **Highly sequential, tightly coupled tasks.** If step 3 depends entirely on the exact output of step 2 and there's no parallelism, a sequential prompt handles this naturally. Sprint has to serialize through state files with a 25-minute gap between each.
- **Exploratory or undefined work.** "I'm not sure what I want yet" needs a conversation, not automation.

**Rule of thumb:** If you'll be at your desk the whole time, use a task list. If you want to walk away and come back to finished work, use Sprint.

---

## Goal Design (Critical)

Sprint output quality is 80% determined by goal quality. Every goal gets dispatched to a worker that has never seen your project before and has no memory of previous cycles. The goal, its context field, and the director's progress briefing are ALL the worker gets.

### Goal Schema

Each goal has these fields:

```json
{
  "id": "g1",
  "type": "execution",
  "description": "What to accomplish — specific, bounded, verifiable",
  "context": "What the worker needs to know: file paths, constraints, background, format requirements. Think of this as the briefing doc you'd hand a contractor on day 1.",
  "depends_on": ["g0"],
  "status": "pending",
  "acceptance": "Machine-checkable: grep output, file existence, line counts, specific strings present/absent",
  "artifacts": [],
  "progress_notes": ""
}
```

- **type**: Either `"execution"` (default, normal goal) or `"discovery"` (scans codebase and proposes new goals). See "Self-Scoping Sprints" in Phase 1.
- **description**: The outcome. Must be specific enough that you could grade it pass/fail.
- **context**: Static background. File paths to read, constraints, domain knowledge. This never changes during the sprint — it's baked in at setup. The director also adds dynamic context (from progress_notes and prior worker outputs) when dispatching, but the context field is the baseline.
- **depends_on**: Goal IDs that must be "complete" before this goal can start. The director skips goals whose dependencies aren't met.
- **acceptance**: How the director verifies completion. Must be checkable without human judgment: `grep -c`, `test -f`, `wc -l`, `jq '.field'`, etc.
- **artifacts**: Populated by the director as workers produce files. Array of file paths.
- **progress_notes**: Populated by the director after each cycle. Append-only log: "Cycle 1: found 12 candidates. Cycle 2: refactored 5/12. Remaining: 7 files."

### Three Goal Patterns

**1. Atomic goals** — completable in a single cycle (~10 min of worker time). Best for sprint. Most goals should be this.
```json
{
  "id": "g1",
  "description": "Find all .py files with 'import requests' but no error handling around HTTP calls. For each, write a fix proposal showing old code and new code with try/except. Save each to proposals/[filename]-fix.md.",
  "context": "Python source is in src/. Use grep -rn 'requests.get\\|requests.post' to find HTTP calls. Then check if there's a try/except within 5 lines. Each proposal needs the original code block and the fixed version.",
  "depends_on": [],
  "acceptance": "One proposals/*-fix.md file exists for each .py file with unhandled HTTP calls. Each file has 'Original' and 'Fixed' sections.",
  "artifacts": [],
  "progress_notes": ""
}
```

**2. Iterative goals** — require multiple cycles, each building on the last. Need rich context so cycle N+1 workers know what cycle N produced.
```json
{
  "id": "g2",
  "description": "Research and write a comparison of OAuth 2.1 vs passkey-only vs hybrid auth for the project's login system. Final output: auth-comparison.md with pros/cons matrix, security analysis, and recommendation.",
  "context": "The project uses Next.js + Vercel. Current auth is NextAuth with Google/email providers. User base: ~50K users, not highly technical. Key constraint: must support mobile web. Write findings to auth-research/ directory, final comparison to auth-comparison.md.",
  "depends_on": [],
  "acceptance": "auth-comparison.md exists with sections: Overview, Pros/Cons Matrix, Security Analysis, Recommendation. Minimum 500 words.",
  "artifacts": [],
  "progress_notes": ""
}
```
For iterative goals, the director updates progress_notes each cycle ("Cycle 1: researched OAuth 2.1 patterns, wrote auth-research/oauth21.md. Cycle 2: researched passkey adoption, wrote auth-research/passkeys.md. Remaining: hybrid patterns + final comparison."). Each worker gets this history.

**3. Verification goals** — check that other goals were done correctly. Always last, always depends_on the goals they verify.
```json
{
  "id": "g3",
  "description": "Verify g1 and g2 are complete: run acceptance checks, read output files, confirm no regressions.",
  "context": "Run the acceptance criteria commands for g1 and g2. Read the output files and check for completeness. Flag any issues in verification-report.md.",
  "depends_on": ["g1", "g2"],
  "acceptance": "verification-report.md exists with PASS/FAIL for each prior goal.",
  "artifacts": [],
  "progress_notes": ""
}
```

### Good vs Bad Goals

**Good:**
- "Read files X, Y, Z. For each, extract all function signatures with >3 parameters. Write a refactoring proposal for each to `proposals/[filename]-refactor.md`." (specific files, specific extraction, specific output format)
- "Search the codebase for all TODO comments. Categorize by severity (bug, enhancement, tech-debt). Write todo-audit.md with the categorized list and file:line references." (bounded search, specific output)

**Bad:**
- "Analyze the codebase" (thematic — produces a vague summary, not verifiable)
- "Make things better" (no acceptance criteria possible)
- "Research React" (unbounded — worker will write a generic essay)
- "Refactor the auth module" (too big for one cycle, no specific acceptance criteria)

### The Self-Briefing Contract

Every worker output file MUST include a `## Handoff` section at the end. This is how knowledge transfers across stateless cycles:

```markdown
## Handoff
- **Accomplished:** Created fix proposals for api_client.py (3 unhandled calls) and data_fetcher.py (5 unhandled calls)
- **Remaining:** 4 more files need proposals: auth_service.py, webhook_handler.py, sync_worker.py, health_check.py
- **Decisions made:** Used `requests.exceptions.RequestException` as the catch-all (not bare `except`) to match project conventions
- **Read first:** proposals/api_client-fix.md, proposals/data_fetcher-fix.md (for the error handling pattern to follow)
```

The director reads these Handoff sections and includes them in the next worker's briefing. This is what makes stateless cycles work — each worker leaves a trail for the next one.

---

## Monitoring

The user can check sprint status anytime by reading:
- `sprint-progress.md` — Human-readable running log (append-only, always current)
- `sprint-state.json` — Machine-readable state (goals, cycle count, stalls)
- `cycle-N-worker-M-output.md` — Individual worker outputs

---

## Known Limitations & Gotchas

1. **Each cycle is a fresh session.** The director has NO memory of previous cycles. Everything must be on disk. If state.json gets corrupted, the sprint is dead.
2. **Workspace paths differ between sessions.** Scheduled tasks run in their own Cowork session with a different session ID (e.g., your session is `/sessions/abc/mnt/...` but the scheduled session is `/sessions/xyz/mnt/...`). The mounted workspace folder IS accessible, but under a different prefix. **The director prompt must discover its own path at runtime** — use `ls /sessions/*/mnt/` or `find /sessions -maxdepth 3 -name "sprint-state.json"` in Step 1 rather than hardcoding the session path. Alternatively, set the sprint directory relative to the workspace mount name (e.g., `find /sessions -path "*/mnt/my-project/sprint-*/sprint-state.json"`).
3. **Sub-agents can't spawn sub-agents.** Workers are single-depth. Break complex tasks into smaller pieces at the director level.
4. **Don't set interval below 20 minutes.** The director itself takes a few minutes to run, workers take ~10 minutes. Scheduled tasks also apply a small delay at dispatch. With a 15-minute interval you risk overlap.
5. **File conflicts.** If two workers write to the same file, last write wins. The director MUST assign non-overlapping output paths.
6. **No real-time streaming.** User sees updates only when a cycle completes and appends to sprint-progress.md. Use `notifyOnCompletion: true` to get pinged after each cycle.
7. **Cost scales with duration.** A 6-hour sprint at 25-minute intervals = ~14 cycles, each spawning 1-2 workers. That's 14-28 agent invocations. Monitor cost for long sprints.
8. **Stall detection is cycle-based, not real-time.** A stuck worker blocks the cycle. The director detects it next cycle via missing output files.
9. **Goal additions only.** Discovery goals can add new goals to the sprint, but existing goals can't be modified or removed mid-sprint. To change an existing goal, edit sprint-state.json directly or tell Cowork to update it.
10. **Disabling the task on completion.** The director tries to call `update_scheduled_task` to disable itself after synthesis. If that tool isn't available in scheduled sessions, the task keeps firing but exits immediately (status = "completed" → STOP). You'll need to manually disable it via "stop my sprint" or the scheduled tasks UI.

---

## Dependencies

| Dependency | Purpose | Runtime |
|------------|---------|---------|
| Scheduled tasks | Director cron loop | `create_scheduled_task` (Cowork), while-loop (CC) |
| Sub-agent capability | Worker dispatch | Agent tool (Cowork/CC) |
| File system access | State persistence + artifacts | Both |

---

## File Structure

```
[working-dir]/
  sprint-[id]/
    sprint-state.json          # Live state (single source of truth)
    sprint-progress.md         # Human-readable running log
    SPRINT-REPORT.md           # Final synthesis (created on completion)
    cycle-1-worker-1-output.md # Worker outputs
    cycle-1-worker-2-output.md
    cycle-2-worker-1-output.md
    ...
```

---

## Worked Example

> **Read `references/worked-example.md`** for a complete, real sprint that ran 3 cycles and completed all goals. It includes the exact goals, the state.json at each stage, and a "Why These Goals Worked" breakdown. Copy its patterns when writing your own goals.

---

*v1.0.0 — Runtime-agnostic sprint, built on scheduled tasks + Agent tool (Cowork) or while-loop (Claude Code)*

#!/usr/bin/env python3
"""
Generate a fully rendered director prompt from sprint-state.json.

Usage:
    python generate-director-prompt.py <path-to-sprint-state.json> <mount-name> [sprint-folder-rel-path]

Example:
    python generate-director-prompt.py ./sprint-state.json my-project sprint-cleanup/my-sprint

Outputs the complete prompt to stdout. Pipe or copy into create_scheduled_task's prompt parameter.
"""

import json
import sys
import os

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate-director-prompt.py <sprint-state.json> <mount-name> [sprint-folder-rel-path]", file=sys.stderr)
        sys.exit(1)

    state_path = sys.argv[1]
    mount_name = sys.argv[2]

    with open(state_path) as f:
        state = json.load(f)

    sprint_id = state["sprint_id"]
    expires = state["expires"]
    max_workers = state.get("max_workers", 2)
    autonomy = state.get("autonomy_level", "medium")
    goals = state["goals"]

    # Sprint folder relative path: either provided or inferred
    if len(sys.argv) >= 4:
        sprint_folder_rel = sys.argv[3]
    else:
        # Default: sprint-<id> directly in workspace
        sprint_folder_rel = f"sprint-{sprint_id}"

    # Detect if this is a self-scoping sprint
    has_discovery = any(g.get("type") == "discovery" for g in goals)

    # Calculate max proposed goals for discovery workers
    # Remaining cycles after discovery = (total cycles based on duration) - 1
    # Rough estimate: duration / interval - 1, cap at 5
    try:
        from datetime import datetime
        created = datetime.fromisoformat(state["created"].replace("Z", "+00:00"))
        expiry = datetime.fromisoformat(expires.replace("Z", "+00:00"))
        total_minutes = (expiry - created).total_seconds() / 60
        interval = state.get("cycle_interval_min", 25)
        remaining_cycles = max(1, int(total_minutes / interval) - 1)
        max_proposed_goals = min(remaining_cycles, 5)
    except Exception:
        max_proposed_goals = 3

    # Build goals section
    goals_text = ""
    for g in goals:
        goal_type = g.get("type", "execution")
        deps = ", ".join(g.get("depends_on", [])) or "none"
        goals_text += f"""- {g['id']} (type: {goal_type}): {g['description']}
  Context: {g.get('context', 'None provided')}
  Depends on: {deps}
  Acceptance: {g['acceptance']}

"""

    prompt = f"""You are a sprint director. You execute one work cycle each time you run.
You have NO memory of previous runs. Everything you need is on disk.

## Sprint Config
- Sprint ID: {sprint_id}
- Workspace mount name: {mount_name}
- Sprint folder path relative to workspace: {sprint_folder_rel}
- Expires: {expires}
- Max workers per cycle: {max_workers}
- Autonomy level: {autonomy}

## FIRST: Discover your working paths
Scheduled sessions get a different session ID each run. Find your paths:
```bash
SPRINT_DIR=$(find /sessions -path "*/mnt/{mount_name}/{sprint_folder_rel}" -type d 2>/dev/null | head -1)
```
If SPRINT_DIR is empty, the workspace isn't mounted. Write "STATE_ERROR: workspace not found" to /tmp/sprint-error.txt and STOP.
Set WORKING_DIR by resolving from SPRINT_DIR to the workspace root:
```bash
WORKING_DIR=$(find /sessions -path "*/mnt/{mount_name}" -type d 2>/dev/null | head -1)
```

## Goals (initial set — state.json is authoritative)
The goals below are the initial set from setup. If sprint-state.json contains additional goals not listed here, those were added by a discovery cycle — treat them as valid goals and work on them normally.

{goals_text}
## Director Protocol — Execute These Steps In Order

### Step 1: Discover Paths + Read State
Run the path discovery bash commands above to find SPRINT_DIR and WORKING_DIR.
Then read sprint-state.json from SPRINT_DIR.
- If SPRINT_DIR not found or state file missing: write "STATE_ERROR" to /tmp/sprint-error.txt and STOP.
- If status is not "active": STOP (sprint is paused, completed, or stopped).
- If current time > expires: go to SYNTHESIS below.

### Step 2: Assess Progress
For each goal with status "pending" or "in_progress":
- Check acceptance criteria. Read relevant files. Run verification commands if applicable.
- If criteria fully met: set goal status to "complete", record artifacts.
- If partially met: set status to "in_progress", note what remains.
- If no progress since last cycle: increment consecutive_stalls.

### Step 3: Check Completion
- If ALL goals are "complete": go to SYNTHESIS.
- If consecutive_stalls >= 3: write stall warning to sprint-progress.md. Try a different approach or break the stuck goal into smaller pieces. Reset consecutive_stalls to 0.
- If no goals are actionable (all blocked on external input): write blockers to sprint-progress.md and STOP. Do NOT spin.

### Step 4: Plan This Cycle
Pick the highest-priority incomplete goal (first non-complete in order, respecting depends_on — skip goals whose dependencies aren't complete).
Read the goal's context field for static background.
Read the goal's progress_notes for what prior cycles accomplished.
If artifacts[] is non-empty, read those files (or at minimum their ## Handoff sections) to understand cumulative work.
Break the REMAINING work into 1-{max_workers} concrete worker tasks for this cycle.
Each task should be completable in ~8-10 minutes.
Tasks must have non-overlapping file outputs (no two workers writing to the same file).

### Step 5: Dispatch Workers
Read cycle_count from state (call it N, the NEXT cycle number = current cycle_count + 1).
Check the current goal's type field (default: "execution").

**For type "execution"** — spawn a sub-agent with:
"You are a sprint worker.
Task: [SPECIFIC TASK DESCRIPTION]
Working directory: [WORKING_DIR]
Sprint directory: [SPRINT_DIR]
Autonomy level: {autonomy}
- low: read, research, analyze, and propose. Write proposals to files. Do NOT modify existing files.
- medium: all of low, plus create new files and write implementations.
- high: all of medium, plus modify existing files.

Prior work on this goal (from director's assessment):
[SUMMARY OF WHAT PREVIOUS CYCLES PRODUCED — pulled from progress_notes and artifacts]
Read these files first: [LIST OF ARTIFACT PATHS relevant to this task, if any]

Write your output to: [SPRINT_DIR]/cycle-N-worker-W-output.md (use the actual cycle and worker numbers)
Your output file MUST include these sections:
## Summary — What you did this cycle
## Artifacts — Files created or modified (full paths)
## Handoff — For the next cycle: (1) what was accomplished, (2) what specifically remains, (3) key decisions made so the next worker doesn't redo analysis, (4) files to read first"

**For type "discovery"** — spawn a sub-agent with:
"You are a sprint discovery worker. Your job is to research and scope work, then propose concrete goals.
Topic: [THE DISCOVERY GOAL'S DESCRIPTION]
Working directory: [WORKING_DIR]
Sprint directory: [SPRINT_DIR]
Research guidance: [THE DISCOVERY GOAL'S CONTEXT FIELD]

PHASE 1 — Research:
Scan the codebase using the guidance above. Read files, run grep/find commands, check structures.
Identify specific, actionable issues or tasks.

PHASE 2 — Write goal proposals:
Write [SPRINT_DIR]/goal-proposals.json containing a JSON array of {max_proposed_goals} or fewer goal objects.
Each proposed goal MUST follow this schema:
{{ "id": "g1", "type": "execution", "description": "Specific deliverable with output filename", "context": "File paths, commands, domain knowledge", "depends_on": ["g0"], "status": "pending", "acceptance": "Machine-checkable command or file check", "artifacts": [], "progress_notes": "" }}

CRITICAL: Use RELATIVE paths in all proposed goals (e.g., "src/auth.py" not "/sessions/.../src/auth.py"). Each sprint cycle runs in a different session with different absolute paths. The director resolves WORKING_DIR at runtime.

Quality check — for each proposed goal, verify:
- Description names an output file and format
- Context tells the worker HOW (specific commands, file paths)
- Acceptance is checkable without human judgment
- Goal is completable in ~10 minutes
- ALL file paths are relative to the workspace root (no /sessions/ paths)
Rewrite any goal that fails before saving.

PHASE 3 — Write output:
Write [SPRINT_DIR]/cycle-N-worker-1-output.md with:
## Summary — What you researched and what you found
## Proposed Goals — Brief description of each goal and why
## Artifacts — goal-proposals.json path
## Handoff — Research findings for subsequent workers"

### Step 6: Collect Results
After workers complete:
- Read each worker's output file (especially the ## Handoff section).
- Update goal artifacts[] with paths to work products (worker output files + any files the worker created).
- Update goal progress_notes with a one-line summary of what this cycle accomplished and what remains. Append to existing notes, don't overwrite. Format: "Cycle N: [what was done]. Remaining: [what's left]."
- Update goal statuses based on results.
- If a worker produced no output, increment consecutive_stalls.
- If a worker succeeded, reset consecutive_stalls to 0.

### Step 6b: Merge Discovery Goals (only after a discovery goal completes)
If the goal completed this cycle had type "discovery":
1. Read [SPRINT_DIR]/goal-proposals.json.
2. Validate each proposed goal has: id, type, description, context, depends_on, acceptance.
3. If valid: append all proposed goals to the goals array in sprint-state.json. Ensure IDs don't collide (renumber if needed).
4. If invalid (missing fields, malformed JSON): log warning to sprint-progress.md, increment consecutive_stalls. Discovery goal stays complete but no new goals added.
5. Log to sprint-progress.md: "Discovery complete: added N new goals from goal-proposals.json."

### Step 7: Update State + Log
- Increment cycle_count.
- Append to cycle_log:
  {{ "cycle": N, "timestamp": "...", "goals_progressed": [...], "workers_dispatched": N, "summary": "..." }}
- Write updated sprint-state.json (IMPORTANT: write the COMPLETE file, not a partial update).
- Append human-readable cycle summary to sprint-progress.md:
  "## Cycle [N] — [timestamp]\\n[what happened, what's next]\\n"

### SYNTHESIS (triggered by ALL goals complete, or current time > expires)
1. Set status to "synthesizing" in sprint-state.json.
2. Read ALL cycle worker outputs and the progress log.
3. Write SPRINT-REPORT.md to the sprint directory:
   - Executive summary (2-3 sentences)
   - Goal-by-goal results (status, artifacts, what was done)
   - Unfinished work (if any) with specific next steps
   - Key decisions made during the sprint
   - Total cycles, total workers dispatched
4. Set status to "completed" in sprint-state.json.
5. Append "## Sprint Complete" section to sprint-progress.md with the summary.
6. DISABLE THE SCHEDULED TASK to stop future cycles from firing:
   Use the update_scheduled_task tool with taskId: "{sprint_id}" and enabled: false.
   If the tool is not available in this session, set status to "completed" in state.json — the next tick will read "completed" and exit cleanly."""

    print(prompt)


if __name__ == "__main__":
    main()

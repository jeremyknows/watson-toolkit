# Worked Example: Skill Audit Sprint (Real, Completed Successfully)

This sprint audited ~60 skill directories — inventory, metadata extraction, and categorization. It ran 3 cycles at 25-minute intervals with 1 worker per cycle. All 3 goals completed. Copy these patterns.

## The Goals (as written in sprint-state.json)

```json
{
  "goals": [
    {
      "id": "g1",
      "description": "Scan every directory in the workspace. For each, check if a SKILL.md file exists. Write skills-inventory.md listing every directory, whether it has a SKILL.md (yes/no), and the file size of SKILL.md if present.",
      "context": "Workspace is the parent of the sprint directory. It contains ~60 directories, most of which are skills. Some are standalone .md files (not directories). Only audit directories. Use ls and test -f commands to check. Output should be a markdown table.",
      "depends_on": [],
      "status": "pending",
      "acceptance": "skills-inventory.md exists in the sprint directory with a markdown table containing at least 50 rows and columns: Directory, Has SKILL.md, File Size.",
      "artifacts": [],
      "progress_notes": ""
    },
    {
      "id": "g2",
      "description": "For each skill directory that HAS a SKILL.md (from g1 results), extract the name and description fields from the YAML frontmatter. Write skills-metadata.md with a table: Skill Name, Description (first 100 chars), Has Scripts Dir, Has References Dir.",
      "context": "SKILL.md files use YAML frontmatter between --- markers. The 'name' and 'description' fields are in the frontmatter. Some skills also have scripts/ or references/ subdirectories. Read the inventory from g1's output to know which directories to check.",
      "depends_on": ["g1"],
      "status": "pending",
      "acceptance": "skills-metadata.md exists in the sprint directory with a markdown table. Every skill with a SKILL.md from g1 has a row in g2.",
      "artifacts": [],
      "progress_notes": ""
    },
    {
      "id": "g3",
      "description": "Using g1 and g2 outputs, categorize each skill into one of: 'core' (in the reference list), 'platform-specific' (uses platform-only APIs or dependencies), 'shipped' (docx/pptx/pdf/xlsx/skill-creator), 'scratch' (no SKILL.md or test/temp dirs), 'other'. Write sprint-audit-report.md with the categorized table and a summary count per category.",
      "context": "The categorization targets are listed in a reference file in the workspace root. Read it to get the skill list. For platform-specific detection, grep SKILL.md for platform-specific APIs or dependencies. Shipped skills are: docx, pptx, pdf, xlsx, skill-creator. 'scratch' = directories without SKILL.md or with names suggesting test/temp (sprint-test, build-feature.bak, etc).",
      "depends_on": ["g1", "g2"],
      "status": "pending",
      "acceptance": "sprint-audit-report.md exists with a categorized table and a summary section showing count per category. All ~60 directories are accounted for.",
      "artifacts": [],
      "progress_notes": ""
    }
  ]
}
```

## Why These Goals Worked

1. **Each description names its output file and format.** "Write skills-inventory.md" + "markdown table" + "columns: Directory, Has SKILL.md, File Size." The worker knows exactly what to produce.

2. **Each context tells the worker HOW to do it.** "Use ls and test -f commands." "YAML frontmatter between --- markers." "grep SKILL.md for 'sessions_spawn'." Workers aren't guessing at methods.

3. **Each acceptance criteria is a file check.** "exists with at least 50 rows" — the director can verify this with `wc -l` without judgment.

4. **Dependencies chain correctly.** g2 reads g1's output. g3 reads both. No circular deps, no race conditions.

5. **Goals are ordered smallest to largest.** g1 (scan dirs) is fast. g2 (parse YAML) is moderate. g3 (categorize + cross-reference) is the most complex. Early success builds momentum.

## What the State Looked Like After Cycle 2

```json
{
  "cycle_count": 2,
  "goals": [
    { "id": "g1", "status": "complete", "progress_notes": "Cycle 1: Scanned all 60 top-level directories; 57 have SKILL.md, 3 do not. skills-inventory.md written with 60 rows. Remaining: nothing — goal complete." },
    { "id": "g2", "status": "complete", "progress_notes": "Cycle 2: Extracted name/description YAML frontmatter from all 57 SKILL.md files. skills-metadata.md created with 57 rows. Remaining: nothing — goal complete." },
    { "id": "g3", "status": "pending", "progress_notes": "" }
  ],
  "cycle_log": [
    { "cycle": 1, "timestamp": "2026-03-30T02:04:00Z", "goals_progressed": ["g1"], "workers_dispatched": 1, "summary": "Worker scanned all 60 top-level directories; 57 have SKILL.md. skills-inventory.md created with 60-row markdown table. G1 complete." },
    { "cycle": 2, "timestamp": "2026-03-30T02:30:00Z", "goals_progressed": ["g2"], "workers_dispatched": 1, "summary": "Worker extracted YAML frontmatter from all 57 SKILL.md files. skills-metadata.md created with 57 rows. G2 complete." }
  ]
}
```

Notice how `progress_notes` gives the next director everything it needs to brief the next worker — what was done, what file was produced, and that nothing remains.

## Actual Sprint Results

The sprint completed all 3 goals in 3 cycles (~45 minutes of actual work across ~75 minutes wall time). Final outputs:

| Goal | Output File | Rows | Status |
|------|------------|------|--------|
| g1 | skills-inventory.md | 60 | Complete |
| g2 | skills-metadata.md | 57 | Complete |
| g3 | sprint-audit-report.md | 60 | Complete |

Key finding: 57 of 60 directories had SKILL.md files (95% coverage). 14 were core, 24 were platform-specific, 5 scratch, 17 other.

# autoresearch

Autonomous goal-directed iteration for any task. Apply Karpathy's autoresearch loop — Modify → Verify → Keep/Discard → Repeat — to code, research, writing, debugging, security audits, and more.

**Adapted from:** [karpathy/autoresearch](https://github.com/karpathy/autoresearch) and [uditgoenka/autoresearch](https://github.com/uditgoenka/autoresearch). Expanded with 8 additional subcommands, interactive setup gates, and structured reference workflows.

---

## What It Does

Runs you (or an agent) through a constrained autonomous loop toward a goal. You define the target state and a verification metric; the skill loops until it gets there or hits iteration limits. The interactive setup gate ensures the loop starts with enough context to make real progress — it blocks execution until goal, scope, metric, direction, and verification are all specified.

---

## Subcommands

| Command | Purpose |
|---|---|
| `/autoresearch` | Base loop — generic goal-directed iteration |
| `/autoresearch:plan` | Plan a complex task before execution |
| `/autoresearch:debug` | Systematically diagnose bugs and unexpected behavior |
| `/autoresearch:fix` | Fix a known issue with iterative verification |
| `/autoresearch:security` | Audit authentication, authorization, and attack surface (inspired by [Strix](https://github.com/usestrix/strix)) |
| `/autoresearch:ship` | Prepare a feature or release for shipping |
| `/autoresearch:scenario` | Explore hypothetical scenarios and their outcomes |
| `/autoresearch:predict` | Forecast outcomes from a defined starting state |
| `/autoresearch:learn` | Deep-dive into a topic or codebase to build understanding |

---

## How to Use

Trigger any subcommand. The skill will run an **interactive setup gate** — it will ask batched questions to collect the required context before starting. Do not skip this; incomplete context produces weak loops.

Each subcommand has a dedicated reference workflow in `references/` with its own setup questions, loop phases, and output format.

**Example invocations:**
- `"Run autoresearch on this authentication bug"` → routes to `/autoresearch:debug`
- `"Autoresearch: predict what happens if we remove rate limiting"` → `/autoresearch:predict`
- `"Security audit the login flow"` → `/autoresearch:security`
- `"/autoresearch Goal: reduce bundle size by 30% Scope: src/components/ Metric: webpack-bundle-analyzer output Iterations: 5"` → skips setup gate (all context provided inline)

---

## Configuration

Inline config can be provided to skip the setup gate:

```
/autoresearch
Goal: <what you're trying to achieve>
Scope: <files, directories, or systems in scope>
Metric: <how you'll verify progress>
Direction: <specific approach or constraint>
Verify: <command or check that confirms success>
Iterations: N
```

---

## What We Changed

The original autoresearch concept (Karpathy) is a single-loop research framework for ML experiments. This version:

- Adds 8 domain-specific subcommands with dedicated reference files
- Adds mandatory interactive setup gate (prevents weak/underspecified loops)
- Adds `results-logging.md` for tracking iteration outcomes
- Expands security subcommand with Strix-inspired proof-of-concept validation
- Adds `ship` subcommand for release workflows

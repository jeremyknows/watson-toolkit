# autoresearch

Autonomous Goal-directed Iteration for any task. Applies Karpathy's autoresearch principles — modify, verify, keep/discard, repeat — in bounded loops.

## Attribution

This skill is a **direct inclusion** of [uditgoenka/autoresearch](https://github.com/uditgoenka/autoresearch) (v1.8.2), included unchanged in watson-toolkit. No custom modifications have been made. All credit to [@uditgoenka](https://github.com/uditgoenka).

> If you're using watson-toolkit and want the latest version of this skill, you can always pull directly from the upstream repo.

## What it does

- Loops autonomously: set a goal, it modifies → verifies → keeps or discards → repeats
- Supports bounded iteration via `Iterations: N` inline config
- Ships 11 workflow references: debug, fix, learn, plan, predict, scenario, security, ship, and more
- Works in Claude Code, Cowork, and OpenClaw

## Install

**Claude Code / Cowork (via watson-toolkit):**
```bash
npx watson-toolkit
```

**Standalone:**
```bash
cd ~/.claude/skills
git clone https://github.com/uditgoenka/autoresearch.git
# skill is in .claude/skills/autoresearch/
```

## Sync

watson-toolkit syncs this skill directly from upstream (`uditgoenka/autoresearch`) with no modifications. To update to the latest version, run the toolkit sync script:

```bash
cd ~/projects/watson-toolkit
./sync-github-skills.sh
```

## License

See upstream: [uditgoenka/autoresearch](https://github.com/uditgoenka/autoresearch)

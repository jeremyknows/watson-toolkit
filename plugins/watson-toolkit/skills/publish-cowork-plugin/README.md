# publish-cowork-plugin

Package and validate a Cowork plugin for distribution — as a `.plugin` file or a GitHub marketplace.

---

## What It Does

Takes a set of skills, agents, or hooks and packages them into an installable Cowork plugin. Covers structure validation, plugin manifest creation, `.plugin` file generation, and GitHub marketplace setup for auto-updates.

Also useful for troubleshooting installation failures: if a plugin won't install or a marketplace won't sync, this skill walks through the structure to find what's wrong.

---

## Key Concept: Plugins vs Marketplaces

These are two different things with separate file structures. A common source of installation errors is mixing them up.

- A **plugin** has `.claude-plugin/plugin.json` — contains skills, agents, hooks
- A **marketplace** has `.claude-plugin/marketplace.json` — a catalog that lists plugins and where to find them

When distributing via GitHub, the repo IS the marketplace, and the plugin lives in a subdirectory inside it. They cannot share the same `.claude-plugin/` directory.

---

## Distribution Methods

**Option A — `.plugin` file:** Package as a zip with `.plugin` extension. Users install by uploading the file directly. Good for one-time distribution.

**Option B — GitHub marketplace** (recommended): The GitHub repo acts as a marketplace. Users add it via "Add marketplace" in Cowork settings and get auto-updates when you push. This is how the watson-toolkit is distributed.

---

## When to Use

- Preparing a set of skills for Cowork distribution
- Setting up a GitHub marketplace for a plugin collection
- Debugging "plugin won't install" or "marketplace won't sync" errors
- Validating plugin structure before publishing

---

## What the Skill Covers

1. Determines distribution method (file vs GitHub marketplace)
2. Validates the plugin directory structure
3. Checks the `plugin.json` manifest for required fields
4. Validates all referenced skill paths exist
5. Creates a `.plugin` zip file (Option A) or sets up the marketplace directory layout (Option B)
6. Runs a final consistency check

---

## Common Issues It Catches

- Plugin and marketplace sharing a `.claude-plugin/` directory
- Missing or malformed `plugin.json`
- Skill paths in the manifest that don't match actual directory names
- `.plugin` files that are missing required files

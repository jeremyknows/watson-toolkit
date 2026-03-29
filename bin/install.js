#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Config ────────────────────────────────────────────────────
const TOOLKIT_SUBDIR = 'plugins/watson-toolkit/skills';
const CLAUDE_SKILLS_DIR = path.join(require('os').homedir(), '.claude', 'skills');
const COWORK_MARKETPLACE_URL = 'https://github.com/jeremyknows/watson-toolkit';

// ── Helpers ───────────────────────────────────────────────────
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────

const pkg = require('../package.json');
const args = process.argv.slice(2);

// Handle --help / --version
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  ${bold('watson-toolkit')} v${pkg.version}

  Install Watson's skill toolkit into Claude Code.

  ${bold('Usage:')}
    npx watson-toolkit            Install all skills to ~/.claude/skills/
    npx watson-toolkit --list     List included skills
    npx watson-toolkit --dry-run  Show what would be installed
    npx watson-toolkit --force    Overwrite existing skills without prompting

  ${bold('For Cowork:')}
    Add as marketplace plugin: ${COWORK_MARKETPLACE_URL}
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

// Locate skills within the package
const packageRoot = path.resolve(__dirname, '..');
const skillsSource = path.join(packageRoot, TOOLKIT_SUBDIR);

if (!fs.existsSync(skillsSource)) {
  console.error(`Error: skills directory not found at ${skillsSource}`);
  process.exit(1);
}

const skills = fs.readdirSync(skillsSource, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log('');
console.log(`  ${bold('Watson Toolkit')} v${pkg.version}`);
console.log(`  ${dim(`${skills.length} skills for rigorous thinking, honest feedback, and creative work`)}`);
console.log('');

// --list mode
if (args.includes('--list')) {
  skills.forEach(s => console.log(`  ${green('•')} ${s}`));
  console.log('');
  process.exit(0);
}

// Check for Claude Code environment
if (!fs.existsSync(path.join(require('os').homedir(), '.claude'))) {
  console.log(`  ${yellow('⚠')}  ~/.claude/ not found.`);
  console.log('');
  console.log(`  ${bold('For Claude Code:')} Run this after initializing Claude Code.`);
  console.log(`  ${bold('For Cowork:')}      Add as marketplace plugin instead:`);
  console.log(`                   ${COWORK_MARKETPLACE_URL}`);
  console.log('');
  process.exit(1);
}

// Create skills dir if needed
fs.mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });

const dryRun = args.includes('--dry-run');
const force = args.includes('--force');

let installed = 0;
let skipped = 0;
let updated = 0;

for (const skill of skills) {
  const src = path.join(skillsSource, skill);
  const dest = path.join(CLAUDE_SKILLS_DIR, skill);
  const exists = fs.existsSync(dest);

  if (dryRun) {
    const status = exists ? yellow('update') : green('new');
    console.log(`  [${status}] ${skill}`);
    installed++;
    continue;
  }

  if (exists && !force) {
    // Check if SKILL.md differs
    const srcSkill = path.join(src, 'SKILL.md');
    const destSkill = path.join(dest, 'SKILL.md');
    if (fs.existsSync(srcSkill) && fs.existsSync(destSkill)) {
      const srcContent = fs.readFileSync(srcSkill, 'utf8');
      const destContent = fs.readFileSync(destSkill, 'utf8');
      if (srcContent === destContent) {
        console.log(`  ${dim('○')} ${dim(skill)} ${dim('(current)')}`);
        skipped++;
        continue;
      }
    }
    // Different — update
    fs.rmSync(dest, { recursive: true, force: true });
    copyDirSync(src, dest);
    console.log(`  ${yellow('↻')} ${skill} ${dim('(updated)')}`);
    updated++;
  } else if (exists && force) {
    fs.rmSync(dest, { recursive: true, force: true });
    copyDirSync(src, dest);
    console.log(`  ${green('✓')} ${skill} ${dim('(overwritten)')}`);
    installed++;
  } else {
    copyDirSync(src, dest);
    console.log(`  ${green('✓')} ${skill}`);
    installed++;
  }
}

console.log('');
if (dryRun) {
  console.log(`  ${bold('Dry run.')} ${installed} skills would be installed to:`);
  console.log(`  ${CLAUDE_SKILLS_DIR}`);
  console.log('');
  console.log(`  Run ${bold('npx watson-toolkit')} to install.`);
} else {
  const parts = [];
  if (installed > 0) parts.push(`${installed} installed`);
  if (updated > 0) parts.push(`${updated} updated`);
  if (skipped > 0) parts.push(`${skipped} current`);
  console.log(`  ${bold('Done!')} ${parts.join(', ')}.`);
  console.log(`  ${dim(`Skills location: ${CLAUDE_SKILLS_DIR}`)}`);
  console.log('');
  console.log(`  Restart Claude Code to pick up the new skills.`);
}
console.log('');

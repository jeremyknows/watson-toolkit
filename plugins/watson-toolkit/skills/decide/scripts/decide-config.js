/**
 * decide-config.js
 * Config loader for /decide.
 *
 * Loads ~/.decide/config.json when present.
 * Falls back to Watson hardcoded paths when absent.
 * Validates all paths and URLs before returning config.
 *
 * Security:
 *  - jsonfile paths are restricted to ~/.openclaw/ and ~/.decide/ trees
 *  - Symlinks are dereferenced before allowlist check (prevents symlink traversal)
 *  - http URLs must use http/https and cannot target private IP ranges
 *  - Alternative IP notations (decimal, octal, hex, IPv6-mapped) are blocked
 *  - _skipValidation flag is rejected in user-supplied configs (Watson internals only)
 *  - Config parse errors fail loudly with actionable messages
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_PATH = process.env.DECIDE_CONFIG ||
  path.join(os.homedir(), '.decide', 'config.json');

// WORKSPACE resolution order:
//   1. DECIDE_WORKSPACE env var (explicit override — portable, any agent)
//   2. OPENCLAW_WORKSPACE_DIR env var (set by OpenClaw runtime for the active agent)
//   3. ~/.decide/ folder (user-level decide data dir — the portable default)
//   4. ~/.openclaw/agents/main/workspace (OpenClaw agent fallback)
const WORKSPACE = process.env.DECIDE_WORKSPACE ||
  process.env.OPENCLAW_WORKSPACE_DIR ||
  path.join(os.homedir(), '.decide') ||
  path.join(os.homedir(), '.openclaw', 'agents', 'main', 'workspace');

// ─── Safe path roots (jsonfile sources must live inside one of these) ────────

const SAFE_PATH_ROOTS = [
  path.join(os.homedir(), '.openclaw'),
  path.join(os.homedir(), '.decide'),
  // Also allow DECIDE_WORKSPACE if set (supports custom install locations)
  ...(process.env.DECIDE_WORKSPACE ? [process.env.DECIDE_WORKSPACE] : []),
];

// ─── Watson defaults (used when no config file present) ──────────────────────

const WATSON_DEFAULTS = {
  version: 1,
  sources: [
    {
      type: 'jsonfile',
      name: 'carry-forwards',
      path: path.join(WORKSPACE, 'config', 'carry-forwards.json'),
      itemType: 'carry-forward',
      filter: { owner: 'jeremy', status: 'open' },
    },
    {
      type: 'jsonfile',
      name: 'threads',
      path: path.join(WORKSPACE, 'config', 'active-threads.json'),
      itemType: 'thread',
      filter: { status: 'blocked_on_jeremy' },
    },
    {
      type: 'http',
      name: 'watsonflow',
      url: 'http://localhost:3000/api/tasks',
      params: { assignee: 'jeremy' },
      graceful: true,
      _skipValidation: true, // INTERNAL ONLY — localhost is whitelisted for Watson defaults
                             // User-supplied configs may NOT set this field (rejected in validateSource)
    },
  ],
  auditLog: path.join(WORKSPACE, 'data', 'audit-readiness-scan.jsonl'),
  pendingLater: path.join(WORKSPACE, 'data', 'decide-pending-later.json'),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function expandHome(p) {
  if (!p || typeof p !== 'string') return p;
  return p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p;
}

/**
 * Validate a filesystem path for use as a jsonfile source.
 * Rejects paths outside ~/.openclaw and ~/.decide.
 * Uses fs.realpathSync to dereference symlinks before the allowlist check —
 * prevents symlink traversal attacks (e.g. ~/.openclaw/evil -> /etc/passwd).
 *
 * @param {string} p - Raw path (may use ~ prefix)
 * @returns {string} Resolved, validated path
 * @throws {Error} If path is outside allowed directories
 */
function validatePath(p) {
  const expanded = expandHome(p);
  let resolved;
  try {
    // realpathSync dereferences all symlinks — the resolved path is the real target
    resolved = fs.realpathSync(expanded);
  } catch (e) {
    // File doesn't exist yet — fall back to path.resolve (no symlink to follow)
    // Still safe: if the file doesn't exist, it can't be a symlink to /etc/passwd
    resolved = path.resolve(expanded);
  }
  const allowed = SAFE_PATH_ROOTS.some(root => resolved.startsWith(root + path.sep) || resolved === root);
  if (!allowed) {
    throw new Error(
      `Path outside allowed directories: ${resolved}\n` +
      `Allowed: ${SAFE_PATH_ROOTS.join(', ')}`
    );
  }
  return resolved;
}

// ─── SSRF protection ─────────────────────────────────────────────────────────

// Private IP ranges blocked for SSRF protection.
// Note: Node's URL parser brackets IPv6 hostnames, e.g. [::1], [::ffff:7f00:1].
// Patterns below account for both bracketed and unbracketed forms.
const BLOCKED_HOSTNAME_PATTERNS = [
  /^127\./,                              // Loopback (dotted)
  /^10\./,                               // RFC1918
  /^172\.(1[6-9]|2[0-9]|3[01])\./,      // RFC1918
  /^192\.168\./,                         // RFC1918
  /^169\.254\./,                         // Link-local / AWS metadata
  /^\[?::1\]?$/,                         // IPv6 loopback (with or without brackets)
  /^\[?fc00:/i,                          // IPv6 ULA
  /^\[?fe80:/i,                          // IPv6 link-local
  /^\[?::ffff:/i,                        // IPv6-mapped IPv4 (Node normalizes to [::ffff:hex:hex])
];
const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0', 'metadata.google.internal']);

/**
 * Check for alternative IP notations that bypass dotted-decimal regex:
 *   - Decimal: http://2130706433/  (127.0.0.1 as 32-bit integer)
 *   - Octal:   http://0177.0.0.1/
 *   - Hex:     http://0x7f000001/ or http://0x7f.0x0.0x0.0x1/
 * Node's URL parser passes these through as literal hostname strings.
 */
function isAlternativeIpNotation(hostname) {
  // Pure decimal integer (e.g. 2130706433)
  if (/^\d+$/.test(hostname)) return true;
  // Hex notation (0x...)
  if (/^0x[0-9a-f]+$/i.test(hostname)) return true;
  // Mixed octal/hex dotted (any octet starting with 0x or 0[0-9])
  if (/^(0x[0-9a-f]+|0[0-7]*)(\.(\d+|0x[0-9a-f]+|0[0-7]*))*$/i.test(hostname)) return true;
  return false;
}

/**
 * Validate a URL for use as an http source.
 * Blocks private IP ranges, alternative IP notations, and non-http(s) schemes.
 *
 * @param {string} urlStr
 * @returns {string} Validated URL string
 * @throws {Error} If URL is invalid or targets a blocked host
 */
function validateHttpUrl(urlStr) {
  let u;
  try {
    u = new URL(urlStr);
  } catch {
    throw new Error(`Invalid URL: ${urlStr}`);
  }
  if (!['http:', 'https:'].includes(u.protocol)) {
    throw new Error(`URL must use http or https: ${urlStr}`);
  }
  if (urlStr.length > 2048) {
    throw new Error(`URL too long (max 2048 chars): ${urlStr.slice(0, 80)}...`);
  }
  const hostname = u.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new Error(`Blocked hostname (SSRF protection): ${hostname}`);
  }
  for (const pattern of BLOCKED_HOSTNAME_PATTERNS) {
    if (pattern.test(hostname)) {
      throw new Error(`Blocked hostname pattern (SSRF protection): ${hostname}`);
    }
  }
  // Block ::ffff: IPv6-mapped addresses entirely.
  // Node normalizes these to [::ffff:hex:hex] form — already caught by BLOCKED_HOSTNAME_PATTERNS above.
  // Belt-and-suspenders: also reject any hostname containing ::ffff: in any form.
  const stripped = hostname.replace(/^\[|\]$/g, ''); // remove brackets if present
  if (/^::ffff:/i.test(stripped)) {
    throw new Error(`Blocked IPv6-mapped address (SSRF protection): ${hostname}`);
  }
  // Block decimal/octal/hex alternative notations
  if (isAlternativeIpNotation(hostname)) {
    throw new Error(`Blocked alternative IP notation (SSRF protection): ${hostname}`);
  }
  return u.toString();
}

// ─── Validation ──────────────────────────────────────────────────────────────

const VALID_TYPES = new Set(['jsonfile', 'http']);

function validateSource(source, idx) {
  if (!source || typeof source !== 'object') {
    throw new Error(`sources[${idx}] must be an object`);
  }
  // _skipValidation is a Watson-internal flag — reject it in user-supplied configs
  if (source._skipValidation) {
    throw new Error(
      `sources[${idx}]._skipValidation is reserved for Watson internals and cannot be set in user config`
    );
  }
  if (!VALID_TYPES.has(source.type)) {
    throw new Error(`sources[${idx}].type must be 'jsonfile' or 'http', got: ${source.type}`);
  }
  if (source.type === 'jsonfile' && !source.path) {
    throw new Error(`sources[${idx}] (jsonfile) must have a "path" field`);
  }
  if (source.type === 'http' && !source.url) {
    throw new Error(`sources[${idx}] (http) must have a "url" field`);
  }
}

function validate(cfg) {
  if (!cfg || typeof cfg !== 'object') throw new Error('Config must be a JSON object');
  if (!Array.isArray(cfg.sources)) throw new Error('config.sources must be an array');
  cfg.sources.forEach((s, i) => validateSource(s, i));
}

// ─── Path expansion + security validation ────────────────────────────────────

function secureSources(sources) {
  return sources.map((source) => {
    // _skipValidation is already blocked in validateSource for user configs.
    // For WATSON_DEFAULTS (which bypasses validate()), strip the flag and skip validation.
    if (source._skipValidation) {
      const { _skipValidation, ...rest } = source;
      return rest;
    }
    if (source.type === 'jsonfile') {
      return { ...source, path: validatePath(source.path) };
    }
    if (source.type === 'http') {
      return { ...source, url: validateHttpUrl(source.url) };
    }
    return source;
  });
}

function expandPaths(cfg) {
  return {
    ...cfg,
    sources: secureSources(cfg.sources),
    auditLog: cfg.auditLog ? expandHome(cfg.auditLog) : cfg.auditLog,
    pendingLater: cfg.pendingLater ? expandHome(cfg.pendingLater) : cfg.pendingLater,
  };
}

// ─── Main loader ─────────────────────────────────────────────────────────────

/**
 * Load decide config.
 *
 * Priority:
 *   1. DECIDE_CONFIG env var path
 *   2. ~/.decide/config.json
 *   3. Watson hardcoded defaults (if no config file found)
 *
 * @param {string} [configPath] - Override config path (for testing)
 * @returns {object} Validated, path-expanded config object
 */
function loadConfig(configPath = CONFIG_PATH) {
  if (!fs.existsSync(configPath)) {
    // Watson default: no config file = use hardcoded Watson paths
    // For non-Watson agents this will use Watson's data — document clearly
    console.error(`[decide-config] No config at ${configPath} — using Watson workspace defaults`);
    return WATSON_DEFAULTS; // Already expanded, no security validation needed
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    throw new Error(`[decide-config] Failed to parse ${configPath}: ${e.message}`);
  }

  try {
    validate(raw);
  } catch (e) {
    throw new Error(`[decide-config] Invalid config at ${configPath}: ${e.message}`);
  }

  let cfg;
  try {
    cfg = expandPaths(raw);
  } catch (e) {
    throw new Error(`[decide-config] Security validation failed for ${configPath}: ${e.message}`);
  }

  console.error(`[decide-config] Loaded config from ${configPath} (${cfg.sources.length} sources)`);
  return cfg;
}

module.exports = { loadConfig, CONFIG_PATH, WATSON_DEFAULTS, validatePath, validateHttpUrl };

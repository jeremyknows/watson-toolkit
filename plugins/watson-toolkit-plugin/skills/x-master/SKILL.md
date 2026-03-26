---
name: x-master
description: >
  Master routing skill for all X/Twitter operations — reading, researching,
  posting, and engaging. Use this skill whenever working with X/Twitter in any
  capacity. Routes to the correct sub-tool based on the task. Covers: reading
  tweets by URL, searching X, trend research, posting tweets/replies, and
  handling @askwatson mentions. Triggers on any X/Twitter request, x.com or
  twitter.com URLs, mention of @jeremyknowsvf or @askwatson, or any task
  involving X content.
---

# X Master Skill — Watson's X/Twitter Playbook

This skill is the single entry point for all X/Twitter work. Read it first, then route to the correct sub-tool below. Never attempt raw x.com fetches. Never guess at routing.

---

## ⚠️ ABSOLUTE RULE: Never fetch x.com directly

Direct `web_fetch` of x.com or twitter.com URLs will fail silently or return garbage.

**Always use fxtwitter for reading tweet content:**
```
https://api.fxtwitter.com/{username}/status/{tweet_id}
```

Extract `username` and `tweet_id` from the x.com URL:
- `https://x.com/jeremyknows/status/1234567890` → `api.fxtwitter.com/jeremyknows/status/1234567890`
- `https://twitter.com/askwatson/status/1234567890` → same pattern

This is a hard rule. No exceptions. It's documented in `docs/knowledge/x-fetch-pattern.md`.

---

## Account Routing

Watson operates two X accounts with different rules:

| Account | Handle | When to Use | Approval Required? |
|---------|--------|-------------|-------------------|
| @askwatson | Watson's public voice | Watson-to-world communication, replies to mentions | **Yes — always.** Never post without Jeremy's ✅. |
| @jeremyknowsvf | Jeremy's brand | Jeremy's content, VeeFriends-related posts | **Yes — always.** Draft only, Jeremy decides. |

**Watson never posts autonomously to X.** All posting goes through the approval flow (Discord reaction gate or explicit confirmation). The only exception is the x-post.js audit trail which logs every post attempt.

Posting scripts in `workspace/scripts/`:
- `x-post.js` — tweet, reply, quote, like via OAuth 1.0a
- `x-token-manager.js` — OAuth token management (required by x-post.js)

---

## Task Router

### 1. Read a tweet or thread by URL
**Tool:** `x-fetch` skill → fxtwitter API
**When:** User shares an x.com/twitter.com link. Any mention of "what does this tweet say", "read this thread", checking a specific post.
**How:**
```
web_fetch("https://api.fxtwitter.com/{username}/status/{id}")
```
Response includes: full text, author, engagement stats, media URLs, thread context via `reply_to`.

---

### 2. Search X for real-time opinions or discourse
**Tool:** `xai-grok-search` skill (load `~/.openclaw/skills/grok-1.0.3/SKILL.md`)
**When:** "What are people saying about X", "search X for Y", real-time pulse check, breaking news context.
**Notes:**
- Responses take 30–60s (reasoning model)
- Results include citations with URLs
- Use `search_x()` for X-specific, `search_web()` for broader

**Alternative for deeper thread context:** `x-research-skill` (see below)

---

### 3. Deep X research — threads, profiles, specific discourse
**Tool:** `x-research-skill` (load `~/.openclaw/skills/x-research-skill/SKILL.md`)
**When:** Need to research a topic across many tweets, follow a thread, understand a conversation, pull profile context, or cache results for repeated lookups.
**Requires:** `bun` and X Bearer Token in env (`X_BEARER_TOKEN`)
**Notes:** Supports `--quick`, `--save`, `--from <handle>`, `--sort likes|recent|impressions`

---

### 4. Multi-platform trend research (last 30 days)
**Tool:** `last30days-skill` (load `~/.openclaw/skills/last30days-skill/SKILL.md`)
**When:** "What's trending about X topic", Content Condor research, understanding broader cultural moment across Reddit + X + HN + YouTube + TikTok.
**Requires:** `SCRAPECREATORS_API_KEY` in env
**Triggers:** "last30 [topic]", trend research requests, Content Condor briefs, DoDo autoresearch on cultural topics

---

### 5. Post a tweet, reply, or quote tweet
**Tool:** `xurl` (built-in) or `x-post.js` (scripts/)
**When:** Any posting action. Always requires Jeremy's approval first.

**Posting flow:**
1. Draft the tweet in Watson's voice
2. Post draft to #watson-main (or relevant approval channel) for Jeremy's ✅
3. After approval: `node workspace/scripts/x-post.js tweet "..." --account [askwatson|jeremyknowsvf]`
4. Log the URL in the thread/conversation

**Never skip the approval step.** Even if Jeremy says "post it" in chat, confirm the exact text before executing.

---

### 6. Handle @askwatson mentions
**Tool:** `x-engage` skill (load `~/.openclaw/skills/x-engage/SKILL.md`)
**When:** @askwatson receives a mention, reply, or DM. Processing incoming X engagement.
**Requires:** x-research-skill (now installed), x-post.js, Discord bot token for approval posting
**Notes:**
- x-engage drafts replies and posts to #askwatson-x for approval
- x-research-skill provides thread context (fully operational as of 2026-03-13)
- Confidentiality protocol is embedded in x-engage — never read MEMORY.md or internal files while operating x-engage

---

### 7. Direct X API v2 calls
**Tool:** `xurl` built-in skill (`~/.npm-global/lib/node_modules/openclaw/skills/xurl/SKILL.md`)
**When:** Specific API operations — follower management, DMs, detailed analytics, batch operations, anything not covered by the higher-level tools above.
**Requires:** `xurl` binary and X OAuth configured

---

## Decision Tree (Quick Reference)

```
Got an x.com URL?
  → Read it: fxtwitter (NEVER direct web_fetch)

Need to search X for discourse?
  → Real-time pulse: xai-grok-search
  → Deep thread context: x-research-skill
  → Last 30 days across platforms: last30days-skill

Need to post/reply?
  → Draft → get Jeremy's ✅ → x-post.js

@askwatson got a mention?
  → x-engage (full pipeline)

Need raw API access?
  → xurl
```

---

## Key File Locations

| Resource | Path |
|----------|------|
| Posting script | `workspace/scripts/x-post.js` |
| Token manager | `workspace/scripts/x-token-manager.js` |
| fxtwitter pattern docs | `docs/knowledge/x-fetch-pattern.md` |
| x-research-skill | `~/.openclaw/skills/x-research-skill/` |
| last30days-skill | `~/.openclaw/skills/last30days-skill/` |
| x-engage | `~/.openclaw/skills/x-engage/` |
| xai-grok-search | `~/.openclaw/skills/grok-1.0.3/` |
| xurl | `~/.npm-global/lib/node_modules/openclaw/skills/xurl/` |
| Herald archive (reference) | `~/archive/herald-barker-2026-03-12/scripts-x/` |

---

## What Was Deprecated / Archived

- **Herald/Barker agent** — archived 2026-03-12. Scripts preserved at `~/archive/herald-barker-2026-03-12/scripts-x/` for reference. x-engage absorbs its function.
- **x-twitter-api download** — deleted 2026-03-13. Was a third-party duplicate of xurl.
- **x-react.js, x-poll.js** — in herald archive. Functionality covered by xurl.

---

---

## Algorithm Intelligence (Updated 2026-03-13)

*Sources: xai-org/x-algorithm repo (16K⭐, Apache 2.0, Jan 19 2026 release) + community analysis*

### The Big Change: Grok Transformer (Jan 2026)
X replaced their legacy ranking system with a Grok-powered transformer. It now **semantically understands content** — reads text, watches video, predicts engagement probability. No more hand-engineered rules. Everything is learned from behavior.

### Engagement Weight Hierarchy
| Action | Weight vs. Like |
|--------|----------------|
| Like | 1x |
| Bookmark | 10x |
| Repost/Retweet | 20x |
| Quote Tweet | 25x |
| Reply | **27x** |
| Reply + you reply back (conversation) | **150x** |
| Profile click | 12x |
| Dwell time | High (variable) |
| Block / mute / "not interested" | **Severe negative** |

**Single most actionable insight:** Reply to your own posts within the first 15 minutes. One conversation thread = 150x the signal of a like.

### The 30-Minute Velocity Window
Posts live or die in the first 30 minutes (especially first 15). Early engagement momentum determines For You feed distribution. Posts that miss the velocity window rarely recover.
- Pre-announce important posts to your community 5 min before dropping
- Be online and ready to reply immediately after posting
- Post at peak times (Wed 9 AM ET confirmed peak; weekdays 8–10 AM generally)

### Content Format Ranking
1. **Native video** — 10x vs text. Short (15–30s), captions, motion hook. Highest priority.
2. **Threads** — Force dwell time; each reply bumps the original post's score
3. **Articles (2026 reversal)** — External article links NOW boosted (opposite of 2018–2024). Article + thread hybrid = 3x engagement vs pure threads.
4. **Images** — Good but below video
5. **Text only** — Baseline
6. **External links without Premium** — Near-zero median engagement

### Account Signals
- **X Premium ($8/mo)** — Mandatory for serious reach. Only Premium engager activity counts for payouts. Smaller Premium audience > large free audience.
- **Verification** — Base score boost; unverified accounts rank lower
- **Posting frequency** — >5x/day triggers suppression. Quality > quantity.
- **Consistency** — Daily compounding beats one-off viral posts

### What to Avoid
- Clickbait / engagement bait ("like if you agree")
- Posting >5x/day
- Engagement pods (coordinated fake engagement — detected and penalized)
- Low-effort replies ("great post!")
- Posting when your audience isn't online (severe time decay — ~50% visibility loss every 6h)

### For @jeremyknowsvf
- Lead with video (events, behind-scenes, quick takes)
- Article-first strategy is now algorithmically correct — Jeremy's long-form expertise is a fit
- Reply to comments in the first 15 min (triggers 150x signal)
- VeeFriends community engagement = direct algorithmic visibility
- Threads > single tweets for complex topics

### For @askwatson
- High-quality standalone replies to Jeremy's posts (builds assistant credibility)
- Never low-effort — one good reply beats 10 likes
- Engage in conversations, not just broadcasts
- Reply depth matters more than post frequency

---

*Created: 2026-03-13 | Last updated: 2026-03-13*
*Replaces: scattered x-fetch / x-engage / xurl routing decisions*
*Algo sources: docs/knowledge/x-strategy/x-algo-signals-2026-03-13.md + x-algo-community-intel-2026-03-13.md*

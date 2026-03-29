# x-fetch

Fetch tweet, thread, or X Article content from x.com or twitter.com URLs — no API key required.

## What it does

- Converts any x.com or twitter.com URL into readable content via the [fxtwitter API](https://github.com/FixTweet/FxTwitter)
- Returns full tweet text, author info, engagement stats, media URLs, and thread context
- Handles X Articles (long-form posts) — extracts full content blocks
- Works in Claude Code, Cowork, and OpenClaw

## Install

**Claude Code / Cowork:**
```bash
git clone https://github.com/jeremyknows/x-fetch.git ~/.claude/skills/x-fetch
```

**OpenClaw:**
```bash
git clone https://github.com/jeremyknows/x-fetch.git ~/.openclaw/skills/x-fetch
```

## Setup

No setup required. The fxtwitter API is public — no tokens, no keys.

Requires `curl` or any HTTP tool (`web_fetch` works too).

## Usage

Just share an X URL and ask about it:

- "What does this tweet say? https://x.com/..."
- "Summarize this X post: https://twitter.com/..."
- "Who wrote this and how many likes? [url]"
- "Get the full article from this X link: [url]"

## How it works

The skill rewrites `x.com` → `api.fxtwitter.com` and fetches structured JSON:

```bash
curl -s "https://api.fxtwitter.com/username/status/1234567890"
```

Returns: text, author, engagement stats, media URLs, article content (if X Article), and `reply_to` for thread traversal.

## Limitations

- Private/protected tweets: not accessible
- Deleted tweets: not accessible
- Rate limits: fxtwitter may throttle heavy usage
- Full threads: fetches one tweet at a time; traverse `reply_to` manually

## Related

- [x-master](https://github.com/jeremyknows/x-master) — Master routing skill for all X operations
- [x-research](https://github.com/jeremyknows/x-master/tree/main/x-research) — Agentic search across X

## License

MIT — see [LICENSE.txt](LICENSE.txt)

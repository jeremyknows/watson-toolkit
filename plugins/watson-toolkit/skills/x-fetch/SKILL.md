---
name: x-fetch
description: >
  Fetch tweet, thread, or X Article content from x.com or twitter.com URLs using
  the fxtwitter API. Use when a user shares an X link and you need to read the
  content. Handles tweets, threads, articles, and media references. No API key
  required. NOT for searching X (use x-research), posting to X (use x-engage),
  or accessing protected/deleted tweets.
version: "1.1.0"
license: MIT
metadata:
  author: jeremyknows
---

# x-fetch — Fetch X/Twitter Content from URLs

X/Twitter blocks direct web fetching. This skill uses the **fxtwitter API** to retrieve full tweet content — no API key required.

**What it retrieves:**
- Tweet text (raw and formatted)
- Author info (name, handle, followers, bio)
- Engagement stats (likes, retweets, replies, views)
- Media URLs (images, videos)
- X Articles (long-form posts with full content blocks)
- Thread context (reply chains via `reply_to` field)

---

## Usage

### Detect X URLs

When a user message contains an X/Twitter URL, extract the username and tweet ID:

```
https://x.com/username/status/1234567890123456789
https://twitter.com/username/status/1234567890123456789
```

Pattern: `(x\.com|twitter\.com)/\w+/status/(\d+)`

### Fetch Content

Replace the domain with `api.fxtwitter.com`:

```bash
curl -s "https://api.fxtwitter.com/username/status/1234567890123456789"
```

Or via web_fetch tool:
```
web_fetch("https://api.fxtwitter.com/username/status/1234567890123456789")
```

### Parse Response

```json
{
  "code": 200,
  "message": "OK",
  "tweet": {
    "url": "https://x.com/...",
    "id": "1234567890123456789",
    "text": "Tweet content here",
    "author": {
      "name": "Display Name",
      "screen_name": "handle",
      "avatar_url": "https://...",
      "description": "Bio",
      "followers": 12345
    },
    "replies": 10,
    "retweets": 50,
    "likes": 200,
    "views": 5000,
    "created_at": "Tue Feb 10 22:00:13 +0000 2026",
    "article": {
      "title": "Article Title (if X Article)",
      "content": { "blocks": [...] }
    }
  }
}
```

---

## Quick Reference

```bash
# Tweet text only
curl -s "https://api.fxtwitter.com/USER/status/ID" | jq -r '.tweet.text'

# With author + engagement
curl -s "https://api.fxtwitter.com/USER/status/ID" | jq '{
  author: .tweet.author.screen_name,
  text: .tweet.text,
  likes: .tweet.likes,
  retweets: .tweet.retweets
}'

# X Articles (long-form content blocks)
curl -s "https://api.fxtwitter.com/USER/status/ID" | jq -r '.tweet.article.content.blocks[].text' 2>/dev/null
```

---

## Examples

### Example 1: Simple Tweet

**User:** "What does this say? https://x.com/elonmusk/status/123456789"

**Action:** Fetch `https://api.fxtwitter.com/elonmusk/status/123456789`

**Present as:**
> **@elonmusk** (Elon Musk):
> "[Tweet text]"
>
> 💬 123 replies · 🔁 456 retweets · ❤️ 7.8K likes · 👁️ 1.2M views

### Example 2: X Article

**User:** "Summarize this: https://x.com/someone/status/987654321"

**Action:** Fetch and check for `.tweet.article` field. If present, extract article content from `.tweet.article.content.blocks[].text` and summarize.

---

## Automation Pattern

When you detect an X URL in user input:

1. **Extract** username and status ID from URL
2. **Fetch** via `api.fxtwitter.com`
3. **Parse** response for relevant content
4. **Summarize** or present based on user request
5. **Include** engagement stats if relevant

**Do NOT fetch if:**
- User shared the link without asking about content
- Link is in quoted/referenced context (not a direct ask)
- Multiple links present — ask which one to fetch

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `{"code": 404}` | Tweet deleted or doesn't exist | Inform user tweet not found |
| `{"code": 401}` | Protected account | Cannot access — inform user |
| Empty response | Network issue | Retry once, then report failure |
| No `.article` field | Not an X Article | Use `.tweet.text` for regular tweet |
| 5xx from fxtwitter | Service down | Fall back to x_search tool if available |

---

## Limitations

- **Rate limits** — fxtwitter may rate-limit heavy usage; no SLA
- **Private tweets** — Cannot access protected accounts
- **Deleted tweets** — No access to deleted content
- **Media** — URLs returned but content not downloaded automatically
- **Full threads** — Fetches single tweet; traverse `reply_to` field manually to follow chain

---

## Related Skills

- `x-research` — Agentic search across X for topics and discourse
- `x-engage` — Draft and post replies to X (with approval)
- `x-master` — Master routing skill for all X operations

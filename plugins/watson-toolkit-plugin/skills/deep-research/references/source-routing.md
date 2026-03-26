# Source Routing by Question Type

**Read when:** Stage 2, when you're unsure which sources to prioritize for the question type.

| Question Type | Primary Sources | Secondary |
|---|---|---|
| Tool eval | GitHub (stars, commits, issues), docs, install.sh | X/Twitter discourse, HN comments |
| Market analysis | X/Twitter, web, news | Academic papers if quantitative |
| Competitive intel | GitHub, product sites, X | Job postings, funding news |
| Concept validation | Web, arXiv (if technical), docs | X practitioner discourse |
| Technical deep-dive | GitHub source, docs, academic | X expert threads |
| Strategic thesis | Web, X, case studies | Academic if available |

## Tools Cheatsheet

```bash
# Web: default to markdown.new proxy
web_fetch("https://markdown.new/<url>")

# X/Twitter: always use fxtwitter for tweet URLs
web_fetch("https://api.fxtwitter.com/<user>/status/<id>")

# X research: use xai-grok-search or x-research skill for discourse
# GitHub: fetch README + recent commits + open issue count
# Academic: arXiv direct (web_fetch), or summarize skill for PDFs
```

## Source Confidence Tiers

| Tier | Examples | Weight in Stage 5 |
|---|---|---|
| Primary | Official docs, GitHub source, direct measurements | High |
| Secondhand | Blog posts, HN threads, analyst reports | Medium |
| Opinion | X posts, forum comments, practitioner takes | Low — useful for signal, not proof |

## Scope Guard

- Aim for **5–15 sources** per brief
- More than 20 = scope creep — narrow the question before continuing
- Single-source critical claims = red flag — find corroboration or downgrade confidence

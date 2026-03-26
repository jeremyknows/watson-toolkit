# How to build your own .md file

An agent-executable plan for extracting a writing voice from a Twitter/X archive. Paste this into Claude Code (or any coding agent) along with your archive path and author name.

## Prerequisites

- A Twitter/X data archive (`.zip` from Settings > Your Account > Download an archive)
- Unzip it. The file you need is `data/tweets.js`
- Node.js / `npx tsx` available

Tell the agent:

```
Build a writing profile for [AUTHOR NAME] using the process in PROCESS.md.
My Twitter archive is at [PATH TO data/tweets.js].
Output the final profile to [AUTHOR]_profile.md.
Ask me to validate findings before finalizing.
```

---

## Phase 1: Pre-process the archive

**Input:** `data/tweets.js`
**Output:** `tweet-index.json`

Write and run a script that:

1. Reads `data/tweets.js` and strips the `window.YTD.tweets.part0 = ` prefix to get valid JSON
2. Filters out:
   - Retweets (`full_text` starts with "RT @")
   - Pure replies (`full_text` starts with "@")
   - URL-only tweets (no text after stripping `https?://\S+`)
   - Empty text
3. Extracts per tweet: `id`, `text` (with URLs stripped), `date` (`created_at`), `likes` (`favorite_count` as int), `rts` (`retweet_count` as int)
4. Sorts by `likes` descending
5. Writes to `tweet-index.json`
6. Logs total tweets scanned and total indexed

**Checkpoint:** Print `"[N] tweets scanned, [M] indexed"` before proceeding.

---

## Phase 2: Quantitative analysis

**Input:** `tweet-index.json` (use top 500 by likes)
**Output:** Sections written to the profile markdown file

Run each analysis as a separate task. Read the tweet index, compute the numbers, and write each section to the output file. Do not combine analyses into one pass.

### 2a. Shape
Compute:
- Median word count per tweet
- % under 10 words, under 20 words, under 50 words
- % that are a single sentence (no period-separated clauses, no line breaks creating multiple statements)
- Average likes by word count bracket (1-5, 6-10, 11-15, 16-20, 21-30, 31+)

Write as `## Numbers` section.

### 2b. Perspective
Compute:
- % of tweets containing "you" or "your"
- % containing "I" or "my"
- % containing "we" or "our"
- Same ratios for top 100 only

Write as `## Perspective` section.

### 2c. Punctuation fingerprint
Compute average per tweet:
- Periods, commas, line breaks (`\n`), question marks, exclamation points, colons, semicolons, em dashes
- % ending with period vs no punctuation vs other
- Average likes for period-ending vs bare-word-ending tweets

Write as `## Punctuation` section.

### 2d. Structure templates
Classify each of the top 500 tweets:
- Single sentence
- Two-part parallel ("X does A. Y does B.")
- Conditional ("If X, then Y.")
- Numbered list ("1. ... 2. ...")
- Explicit contrast ("X vs. Y")
- Other (describe)

Give percentages. Write as `## Structure templates` section.

### 2e. Opening patterns
Classify the opening of each tweet:
- Observation/declaration (starts with noun or statement of fact)
- Numbered list (starts with "1." or "1)")
- Conditional (starts with "If" or "When")
- Imperative verb (starts with a command)
- Quote (starts with attributed quote)
- Question

Give percentages. Write as `## Opening patterns` section.

### 2f. Closing patterns
Analyze the final word of each tweet:
- 20 most frequent final words with counts
- Dominant part of speech of final word
- % ending with period vs no punctuation
- Average engagement for each ending type
- Structural closing patterns (punchline inversion, imperative ending, question ending, simple declarative)

Write as `## Closing patterns` section.

### 2g. Verb mood
Classify each tweet by dominant verb mood:
- Declarative (statement of fact)
- Imperative (command)
- Conditional (if/when)
- Interrogative (question)

Give percentages and average engagement per mood. Write as `## Verb mood` section.

---

## Phase 3: Rhetorical pattern extraction

**Input:** Top 300 tweets from `tweet-index.json`
**Output:** Sections appended to the profile

### 3a. Rhetorical moves
Read the top 300 tweets. Identify every recurring rhetorical move. For each:
- Name it
- Describe the mechanics (what makes it work, not just what it is)
- Give 3-5 example tweets with exact text

Look for but don't limit to: contrast pairs, reframes, quantification of abstract ideas, humor through understatement, uncomfortable truths, compressed frameworks, definitional reframes.

Write as `## Rhetorical patterns` section.

### 3b. Word-level mechanics
Read the top 500 tweets. Run separate searches for each device:

1. **Alliterative contrasts:** Find every tweet where two compared concepts start with the same letter. List each with exact text and letter pair.
2. **Matched meter:** Find couplets where both lines have equal or near-equal syllable counts.
3. **Chiasmus:** Find A-B / B-A word-order reversals.
4. **Circular loops:** Find tweets where the ending echoes or returns to the beginning.
5. **Internal rhyme:** Find sound echoes within or across lines.
6. **Negation flips:** Find tweets using the same words with "don't" / "no" added or removed to invert meaning.
7. **Paradox:** Find self-contradictory statements that resolve into insight.
8. **Ending word analysis:** Do punchlines tend toward monosyllabic or polysyllabic words? Anglo-Saxon or Latinate?
9. **Case patterns:** Does lowercase vs capitalized serve a deliberate purpose? Compare engagement.

Write as `## Word-level mechanics` section with subsections.

### 3c. Contrast frames
Read the top 500 tweets. Find every tweet containing a contrast or comparison. Classify the syntactic frame:

- Reframe (single sentence repositioning)
- Parallel declaration ("X does A. Y does B.")
- Paradox (self-contradiction resolving to insight)
- Conditional reveal ("If X, [surprising Y]")
- Juxtaposed pair (two words, no verb)
- Progression (numbered escalation)
- Explicit vs ("X vs Y")
- Negation flip ("Not X, Y" or "No one X, everyone Y")
- Expectation subversion ("What you think: ... What's true: ...")
- Labeled contrast ("[Label A]: X. [Label B]: Y.")
- Chiastic inversion (ABBA word swap)
- Cyclical (A->B->C->A loop)
- Any other frames discovered

Rank by frequency. Give percentages and 3+ examples of each. Write as `## Contrast frames` section.

### 3d. Colon / punctuation as device
Find every tweet using a colon. Classify:
- Label for visual/thread (structural, not rhetorical)
- Setup:punchline pivot (rhetorical)

For rhetorical colons: what's the word count before vs after? Compare engagement to non-colon tweets. Write as `## Colon as pivot` section (or name for whatever punctuation device is most prominent).

---

## Phase 4: Negative space and constraints

**Input:** Top 500 tweets
**Output:** Sections appended to the profile

### 4a. What the voice never says
Read 500 tweets and check for the absence of each category:
- Personal emotions ("I feel...", "I'm excited...")
- Apologies or self-correction
- Current events or news commentary
- Personal biographical details (daily activities, travel, meals)
- Engagement asks (like, share, follow, RT)
- Gratitude performances ("so grateful...", "humbled...")
- Vulnerability theater ("I'll be honest...", "real talk...")
- Motivational cliches ("believe in yourself", "never give up")
- Own success metrics (revenue, follower counts)
- Pop culture references (movies, TV, sports, music)
- Political opinions
- Religious references
- Complaining or negativity about specific people or groups
- Self-promotion with direct calls to purchase

For each: confirm truly absent, or count rare exceptions and quote them. Write as `## What the voice never says` section.

### 4b. Banned words
Based on everything analyzed so far, generate a list of words and phrases that would break this voice. Categories:
- Corporate jargon
- Filler phrases and hedging language
- Buzzwords
- Transition words that add no meaning
- Cliche phrases

Write as `## Never use these words` section.

### 4c. Anti-patterns
List structural habits the voice avoids. Things like: long explanations, preamble, summary paragraphs, excessive adjectives, em dashes, self-congratulation, hedging qualifiers. Write as `## What the voice never does` section.

---

## Phase 5: Voice description and themes

**Input:** All analysis completed in phases 2-4
**Output:** Sections prepended/appended to the profile

### 5a. Voice description
Write a one-paragraph description of the voice based on all quantitative and qualitative findings. No hedging. Declarative sentences only. Write as `## Voice` section at the top of the file.

### 5b. Signature vocabulary
Find the 15-20 most frequently used meaningful words (exclude stop words). Note what the word choices reveal about the worldview. Write as `## Signature vocabulary` section.

### 5c. Tone
Describe the tone in 3-5 bullet points based on the data. Not what the voice says, but how it feels. Write as `## Tone` section.

### 5d. Themes
Identify 5-8 recurring themes across the corpus. For each, give a name and 2-3 example phrasings. Write as `## Themes` section.

---

## Phase 6: Teaching examples

**Input:** `tweet-index.json` + all analysis
**Output:** Final sections of the profile

### 6a. Rewrite pairs
Select 10 ideas from the corpus. For each, write:
1. A generic version (how a default writer would say it - long, hedging, jargon)
2. The actual tweet (compressed, direct)

Write as `## Rewrite pairs` section.

### 6b. Reference examples
Select 20-30 of the highest-performing tweets that best represent the voice. Choose for variety across rhetorical moves, structural patterns, and themes. Write as `## Reference tweets` section.

### 6c. Long-form rules
If the corpus contains any long-form writing (threads, essays), describe the format: paragraph length, opening style, closing style, use of visuals. Write as `## Article format` section. Skip if no long-form exists.

---

## Phase 7: Validate with the author

**This step is mandatory. Do not skip it.**

Present all findings to the author grouped by category:
1. Quantitative findings (shape, perspective, punctuation, structure, openings, closings, verb mood)
2. Rhetorical moves identified
3. Word-level mechanics found
4. Contrast frames cataloged
5. Negative space (what the voice never says)
6. Banned words and anti-patterns

For each group, ask: **"Which of these are intentional?"**

Remove anything the author identifies as accidental or coincidental. The file should only contain deliberate patterns.

---

## Phase 8: Assemble and order

Combine all validated sections into a single markdown file. Final section order:

```
## Voice
## Numbers
## Perspective
## Punctuation
## Structure templates
## What performs
## Sentence structure
## Rhetorical patterns
## Word-level mechanics
## Closing patterns
## Contrast frames
## Verb mood
## Colon as pivot
## What the voice never says
## Opening patterns
## Signature vocabulary
## Tone
## Themes
## Never use these words
## What the voice never does
## Article format
## Rewrite pairs
## Reference tweets
```

Write the final file to `[AUTHOR]_profile.md`.

---

## Notes

- 1,000 posts is a minimum corpus. 10,000+ gives statistical confidence.
- Engagement data is critical. Without it you're measuring output, not signal.
- Run each analysis in phases 2-4 separately. Combining them produces shallow results.
- The file is never finished. New patterns surface over time.
- This process works for any medium. Adapt phase 1 for newsletters, blog posts, transcripts, or books.

---
name: proposal-maker-skill
description: >
  Generate premium, deployed proposal websites for client engagements.
  Handle intake, market research, competitive analysis, visual direction,
  frontend build, deployment, and iterative refinement. The deployed site
  serves as both the proposal and proof of capability. Includes a bundled
  frontend design skill for elevated visual output. Use when creating a
  proposal, pitch, or engagement site for a client, or when the operator
  says "make a proposal for", "build a pitch for", "create a proposal
  site", "scope of work for", or provides meeting notes about a potential
  client. Produces deployed web pages only, not PDFs, slide decks, or
  document-format proposals.
---

# Client Proposal Generator

The proposal IS the proof of work. When the client opens the URL, they experience your capability, not just read about it.

## Bundled Skills

This skill includes `frontend-design/SKILL.md`. Read it before starting the build step. It defines the visual philosophy, interaction patterns, and design system that elevates every proposal from functional to magnetic. Apply its principles during Step 4 (Build) unless the client's brand demands a different aesthetic.

## Requirements

Requires `web_search` and `web_fetch`. Strongly recommended: browser tool (for screenshots) and HTML/CSS/JS build capability. Deployment options are built into the workflow (see Step 4).

## When NOT to Use This Skill

- Client explicitly needs a PDF/deck for procurement workflow
- Client's org blocks external URLs (enterprise, government)
- Engagement is under ~$2K (a deployed site is overkill, send a clean email instead)
- Client is non-technical and would be more impressed by a polished document
- You lack frontend build capability entirely

For these cases, use the research and pricing steps below to inform whatever format you do produce.

## Workflow

### Step 1: Intake

Extract context from whatever the operator provides. **Block until you have:**

1. Client name and what they do
2. What you're proposing to do for them
3. Who sees this proposal (decision maker roles, could be multiple)

**Ask once if missing, then move on:**
- Design reference URL(s) the client liked
- Pricing range the operator wants to propose
- Known competitors

If the operator doesn't specify pricing, ask: "One-time project, retainer, or fractional role? What range feels right?" If they don't know, the research step will produce benchmarks. See [references/pricing-framework.md](references/pricing-framework.md).

Save structured context to `<project-dir>/CONTEXT.md` alongside your project files, using the schema in [references/context-schema.md](references/context-schema.md).

### Step 2: Research

Before designing anything, know the landscape.

1. **Client's current state** - Visit their website/socials if they exist. Screenshot. Note gaps. If they have no web presence, note that as a selling point for your engagement.
2. **The market** - Size, growth rate, tailwinds. 2-3 sourced stats.
3. **The competition** - 2-3 direct competitors with real pricing and positioning. Visit their sites. Screenshot the best one.
4. **The ROI math** - One calculation that makes the deal obvious. Specific numbers.
5. **Pricing benchmarks** - Search for "[industry] [engagement type] agency pricing" and competitor agency pricing pages. Find 3 real benchmarks, then position against them.

**Circuit breaker:** If research reveals the engagement doesn't make sense (market declining, client's product unviable, no clear ROI), surface this to the operator before building. Don't build a proposal for a bad engagement.

Synthesize for the operator: market opportunity, competitive gaps, client advantages, the killer pitch (one sentence), recommended pricing with benchmark justification.

If sub-agents are available for research, delegate. Otherwise, `web_search` + `web_fetch` covers it.

### Step 3: Visual Direction

**Derive the style. Never default to a preset.**

1. Pull from client's existing brand identity (colors, typography, vibe)
2. Analyze any reference sites they mentioned (screenshot and verify the URL lands on the right page, watch for tracking redirects)
3. Consider industry and audience (see [references/industry-styles.md](references/industry-styles.md) as a starting point, not a prescription)
4. Match the engagement vibe (premium = dark + sophisticated, friendly = bright + approachable, clinical = clean + authoritative)
5. **Read `frontend-design/SKILL.md`** for the design system. Apply its patterns (hover interactions, typography pairing, color philosophy) unless the client's brand conflicts.

**If the client's brand is flat/minimal, the proposal should be flat/minimal.** Don't impose gradients and glass on an Apple-inspired brand. The frontend-design skill's patterns are recommendations, not mandates. Client brand always wins.

Confirm with the operator before building: "Going with [direction] based on [reference]. Good?"

### Step 4: Build

Choose which sections to include based on engagement type, then build.

**Section applicability:**

| Section | Project | Retainer | Fractional | Advisory |
|---------|---------|----------|------------|----------|
| Hero | Always | Always | Always | Always |
| Market Opportunity | Yes | Yes | Optional | Optional |
| Competitive Landscape | Yes | Optional | Optional | No |
| ROI / Killer Pitch | Yes | Yes | Yes | No |
| Deliverables | Yes | Yes | Optional | No |
| Quick Wins (30-day) | Yes | Yes | Yes | Optional |
| Engagement Options | Yes | Yes | Yes | Yes |
| Next Steps / CTA | Always | Always | Always | Always |

See [references/page-structure.md](references/page-structure.md) for detailed section guidance and the value-equation ordering.

**Build requirements:**
- Single page, responsive, fast
- Static HTML with client-side JS for interactive elements (calculators, sliders)
- Mobile must work (clients check phones)
- Apply `frontend-design/SKILL.md` patterns: hover lifts, color transitions, typography pairing, dark-first when it fits the brand
- **Never use emojis.** Use SVG icons or icon libraries (Lucide, Heroicons, Font Awesome) for all visual indicators, section markers, and decorative elements. Emojis look amateur in a professional proposal. Icons are crisp at any size, match the color scheme, and signal craft.

**Interactive elements (ROI calculators, sliders) - CRITICAL:**
- Use plain vanilla JS with `<input type="range">` and `<select>` elements. Do NOT rely on React state or framework hydration for interactivity in static exports, as event listeners frequently break.
- Attach event listeners with `document.addEventListener('DOMContentLoaded', ...)` or place `<script>` tags at the end of `<body>`.
- Wire `oninput` directly on range/select elements as a fallback: `<input type="range" oninput="updateCalc(this.value)">`
- Test interactivity BEFORE deploying by opening the built HTML locally.
- If using Next.js static export: interactive components MUST be `'use client'` with `useEffect` for event binding. Prefer vanilla JS in a `<script>` tag over React state for calculator logic as it's more reliable in static builds.

**If a coding sub-agent is available:** Delegate with the full research, visual direction, all screenshots, reference to this skill's page-structure.md, AND the frontend-design skill.

**If building directly:** Use the same page structure. Tailwind CSS + vanilla JS is the fastest path for a single-page static site.

#### Deployment (3 tiers)

**Tier 1: gui.new (preview/test, always do this first)**

Deploy to gui.new before anything else. Zero config, no accounts, instant URL. This is your proof-of-concept check.

```bash
curl -X POST https://gui.new/api/canvas \
  -H 'Content-Type: application/json' \
  -d '{"title": "Proposal: [Client Name]", "html": "<full HTML here>"}'
```

Returns `{"url": "https://gui.new/abc123xyz"}`. Send this to the operator for initial review. Links expire in 24 hours, which is fine for review cycles.

Limits: 2MB max, 5 creates/hour free, 24h expiry. No auth needed.

**Tier 2: Vercel/Netlify (production, if available)**

After operator approves the gui.new preview, deploy to a permanent URL.

- Vercel: `vercel --prod` (requires Vercel CLI + account)
- Netlify: `netlify deploy --prod` (requires Netlify CLI + account)
- GitHub Pages: push to repo, enable Pages

If confidential: use password-protected deployment or expiring link.

**Tier 3: HTML file delivery (fallback)**

If you can't deploy at all: deliver the HTML file directly in chat. The operator can open it locally or host it themselves. The research, structure, and content are still valuable.

**Always start with Tier 1.** Many operators don't have Vercel or Netlify set up. gui.new gives everyone an instant shareable URL with zero friction.

### Step 5: Iterate

Ship V1 via gui.new, send the live URL + screenshot, then refine based on feedback. See [references/iteration-guide.md](references/iteration-guide.md) for round-by-round focus areas and lessons from real builds.

**After every round:** Deploy the updated version. If using gui.new, create a new canvas (old ones stay live for 24h). If using Vercel/Netlify, redeploy. Verify the live URL works. Screenshot and send. Wait for feedback.

**Operator feedback is law.** They know the client.

For proposals targeting multiple decision makers (CEO, CFO, technical lead), see [references/multi-stakeholder.md](references/multi-stakeholder.md) for section weighting guidance.

For common problems during the build process, see [references/error-handling.md](references/error-handling.md).

Expect 45 minutes to 1.5 hours total across all phases.

---
created: 2026-04-24T00:00:00Z
resolved: 2026-04-24T21:30:00Z
status: promoted-to-phase
promoted_to: Phase 4 — Marketing Copy Rewrite (Pro-tier readiness)
title: Marketing-site copy rewrite for Pro-tier readiness (hero + features + privacy + footer)
area: ui
files:
  - src/components/Hero.astro
  - src/components/HowItWorks.astro
  - src/components/Features.astro
  - src/components/Architecture.astro
  - src/components/Footer.astro
source: covalence-memory-150 (2026-04-23 copywriter-review; tags: covalence-app, website, copy, marketing, positioning, pro-tier)
---

## Problem

The covalence.app marketing site currently commits to two framings that will break (or weaken) when the Pro tier ships: (1) "Runs on your Mac" as a product-wide promise, and (2) "Local" as the load-bearing privacy claim. Pro will run on machines the user owns but not necessarily their Mac (OpenClaw / Hermes / home-server / team-box). The site needs to stop treating "local" as a product-wide property and start treating it as a Free-tier implementation detail — without announcing Pro before it exists.

Captured 2026-04-23 from a copywriter-review conversation (covalence memory id 150, 11.5k words of spec). Strategic intent: narrow the audience to power users who already understand MCP/Cursor/Claude Code, and make every claim on the page survive the Free/Pro split. The load-bearing principle that survives both tiers is **"no third-party cloud, by architecture"** — "your data" gets redefined from synonym-for-local to claim-about-data-sovereignty.

**Load-bearing constraints** (from the memory — violating any of these defeats the purpose):
- Do NOT add a Pro tier, pricing page, or waitlist anywhere. Copy must read true today and survive the Pro launch without rewriting — not pre-announce.
- Do NOT remove the v1.3.5 download-required banner.
- Do NOT touch nav, download button, version string, or release notes link.
- Do NOT rewrite the code snippets in "Two copy-pastes" — only the intro sub-copy.
- Do NOT add a "Made in the UK" line.

## Solution

Six discrete edits identified in memory 150. Size: big enough for a proper phase (`/gsd-discuss-phase N` → `/gsd-plan-phase N`), not a quick task. Rough ordering:

1. **Hero subhead** (`src/components/Hero.astro`) — replace `Runs on your Mac. Private, fast, and entirely yours.` with `Your memory, on machines you own. Never anyone else's cloud.` Headline kept intact.
2. **"Two copy-pastes" sub-copy** (`src/components/HowItWorks.astro`) — replace the `Connect your AI client to Covalence's MCP server, then tell it how to use memory.` line with `Add the MCP snippet. Paste the behavioural prompt. Done.` Code blocks + step headings untouched.
3. **Features grid** (`src/components/Features.astro`) — rewrite three tiles (`⚡ Local embeddings` → `⚡ On-device embeddings`; `🔗 Multi-client` → `🔗 One memory, every client`; `🔒 Your data` → `🔒 Your data, your infrastructure`). Leave three tiles unchanged (Semantic search, Core Memories, Always running — though "Menu bar app" language is macOS-specific and will need revisit when Pro ships a non-Mac host).
4. **Privacy by architecture paragraph** (`src/components/Architecture.astro` — the `arch-privacy` right column) — rename heading to `Your data, your infrastructure`, rewrite the paragraph to lead with "Machines you control" + "No third-party cloud, by architecture" so the page says one principle three times (hero subhead, feature tile, paragraph).
5. **Footer tagline** (`src/components/Footer.astro`) — replace `Built on macOS, for macOS` with `Built for the machines you own`.

See memory 150 for the exact target strings for each edit plus rationale.

## Phase 3 reconciliation (MUST read before starting)

This todo was captured AFTER Phase 3 (Content Depth & SEO) landed, and two of its edits collide with Phase 3 work:

- **Features.astro tile #3 (`⚡ Local embeddings`).** Phase 3 Plan 03-01 already changed line 21 from `CoreML on Apple Neural Engine` → `MLTensor on Apple Silicon` to match what the app ships. Memory 150's replacement (`⚡ On-device embeddings` / `Embeddings computed on your hardware, not someone else's. No API keys, no per-call cost, no external dependencies.`) supersedes Phase 3's surgical fix with a more generic implementation-neutral framing. Choose the memory's version — it's forward-compatible with Pro. Phase 3's MLTensor line was a voice fix, not a strategic rewrite; the strategic rewrite subsumes it.
- **Architecture.astro — "The stack" / "Under the hood" bullets.** Memory 150 documents a bullet-list rewrite ("Option A"), BUT Phase 3 Plan 03-03 already replaced the entire bullet list with a 2-3 paragraph prose teaser + CTA to `/docs/under-the-hood/`. The bullet edits in memory 150 are MOOT — the list no longer exists on the home page. Review the new prose teaser against the memory's stated intent (portability / architectural principles / no Apple-specific promises) and rewrite it inline if the existing Phase 3 teaser commits to Mac-only language that breaks under Pro. The teaser copy was written against the old CONTEXT/RESEARCH docs without this strategic memo in scope.
- **Architecture.astro — `arch-privacy` column.** Phase 3 explicitly preserved this byte-identical as a critical invariant. This todo BREAKS that invariant intentionally — the memory's whole point is that this paragraph is the one most at risk under the Pro reframe and needs rewriting now, not later. Fine; just don't let a future code reviewer flag it as a Phase 3 regression.

## Scope boundary

Marketing-site copy only. No content-collection edits (`/docs/*` pages, `/posts/*`). No new routes. No new components. No CSS structural changes — only whatever's needed to support the new text (e.g., tile heading lengths may need minor width tweaks).

Before starting the phase, re-read covalence memory id 150 in full to lock the exact target strings. The summary above is accurate but compressed; the memory has the rationale per edit.

## Pre-flight

- [ ] Confirm covalence memory 150 is still the authoritative spec (user may have revised)
- [ ] Run `/gsd-discuss-phase N --all` to lock the Phase 3 reconciliation decisions above into CONTEXT.md
- [ ] Plan as six-atom waves (each edit is independent except #3 and #4 both touch Architecture.astro — serialize those)

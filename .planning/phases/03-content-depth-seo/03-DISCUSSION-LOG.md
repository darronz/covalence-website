# Phase 3: Content Depth & SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 03-content-depth-seo
**Areas discussed:** CONT-01 approach, robots.txt + sitemap policy, SEO parity across surfaces, Phase 2.1 SEO punts

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| CONT-01 approach | Placement + depth for the "Under the hood" content | ✓ |
| robots.txt + sitemap policy | Shape of robots.txt; whether sitemap coverage needs config | ✓ |
| SEO parity across surfaces | Canonical + OG on Starlight /docs/*; single vs differentiated OG images | ✓ |
| Phase 2.1 SEO punts | IN-05 RSS richness, IN-06 RSS link absolutisation | ✓ |

**User's choice:** All four areas selected.

---

## CONT-01 Approach

### Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Both — teaser on / + deep /docs page (Recommended) | Keep Architecture.astro as 2–3 para teaser; full depth on new /docs/under-the-hood | ✓ |
| Expand Architecture.astro on / only | All content on landing page | |
| New /docs/under-the-hood only | All depth in Starlight; home unchanged | |

**User's choice:** Both — teaser on / + deep /docs page (Recommended).
**Notes:** Aligns with the "skimmable landing + shareable technical URL" framing.

### Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Prose + one diagram + real numbers (Recommended) | Plain prose + one schematic + concrete values (dims, truncation sizes, RRF params, recency half-life) | ✓ |
| Prose + one diagram (no numbers) | Avoid committing values | |
| Prose only, no diagrams or numbers | Plain copy | |

**User's choice:** Prose + one diagram + real numbers (Recommended).
**Notes:** Success Criterion 1 requires "enough depth to decide whether the approach is credible" — plain prose alone doesn't clear that bar.

### Source of numbers (follow-up)

| Option | Description | Selected |
|--------|-------------|----------|
| Main Covalence app repo (Recommended) | Research agent reads `../covalence/**` to extract concrete values | ✓ |
| User provides inline during planning | Copy/paste authoritative values into /gsd-plan-phase | |
| Skip numbers — qualitative only | Reverts the earlier depth decision | |

**User's choice:** Main Covalence app repo.
**Notes:** No specific file path pinned — researcher scouts `../covalence/.planning/` and Swift retrieval source. Flagged as hard research dependency in CONTEXT.md D-05.

---

## robots.txt + Sitemap Policy

### robots.txt shape

| Option | Description | Selected |
|--------|-------------|----------|
| Allow all + sitemap ref (Recommended) | Minimal: Allow /, Sitemap URL | |
| Allow all + exclude /releases/*.dmg + sitemap ref | Adds Disallow for worker-proxied DMG routes | ✓ |
| Tighter — block AI training bots | Add GPTBot, Claude-Web, CCBot, Google-Extended blocks | |

**User's choice:** Allow all + exclude /releases/*.dmg + sitemap ref.
**Notes:** Keeps crawler budget off the worker-proxied DMG URLs. AI-bot blocks explicitly rejected — philosophically inconsistent with a tool that gives AI persistent memory.

### Sitemap coverage

| Option | Description | Selected |
|--------|-------------|----------|
| Verify coverage, add filter only if needed (Recommended) | Touch astro.config.mjs only if verification surfaces a gap | ✓ |
| Explicitly configure sitemap filter now | Add sitemap({ filter }) preemptively | |
| Replace @astrojs/sitemap with hand-rolled | Write sitemap.xml.ts manually | |

**User's choice:** Verify coverage, add filter only if needed (Recommended).
**Notes:** Prefer absence of config. Only touch astro.config.mjs if a URL is missing or leaking.

---

## SEO Parity Across Surfaces

### Canonical + OG on /docs/*

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror full SEO set into starlight({ head: [...] }) (Recommended) | Port canonical + OG + Twitter from Base.astro into Starlight head config | ✓ |
| Rely on Starlight defaults | Accept asymmetry; /docs/* gets whatever Starlight emits by default | |
| Extract shared head config into a module | Refactor into TS module consumed by both | |

**User's choice:** Mirror full SEO set into starlight({ head: [...] }) (Recommended).
**Notes:** Same pattern as 02.1-04 for the single RSS `<link rel="alternate">`, scaled to the full metadata set. Extracting into a shared module was considered overkill given the single-use mirror.

### OG image strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Single /og-image.png for everything (Recommended) | Keep the existing 1200×627 image; differentiate via title/description only | ✓ |
| Two images: marketing + docs | Add /og-image-docs.png | |
| One image per top-level surface | Four distinct images (/, /docs, /releases, /posts) | |

**User's choice:** Single /og-image.png for everything (Recommended).
**Notes:** Zero new design work; meets SEO-04 which only mandates presence on / + /docs root. Defer differentiation.

---

## Phase 2.1 SEO Punts

### IN-05 (RSS feed richness)

| Option | Description | Selected |
|--------|-------------|----------|
| Defer (Recommended) | Revisit when cadence warrants — feed has no subscribers | ✓ |
| Fold in | Add `<atom:updated>` + per-post `<enclosure>` for og_image | |

**User's choice:** Defer.
**Notes:** Polish on an empty feed; captured in CONTEXT.md D-15 so it's not lost.

### IN-06 (RSS link absolutisation)

| Option | Description | Selected |
|--------|-------------|----------|
| Defer (Recommended) | @astrojs/rss already absolutises; output is spec-compliant | ✓ |
| Fold in as one-line cleanup | `link: new URL(...).href` for stylistic consistency | |

**User's choice:** Defer.
**Notes:** Pure stylistic inconsistency; fold only if a future phase adopts an "always-absolute" rule.

---

## Claude's Discretion

- Exact Swift file paths in `../covalence/` the researcher reads for retrieval-stack numbers.
- Mermaid vs inline SVG vs plain image for the one schematic diagram.
- Exact teaser CTA wording (voice per 02.1 CONTEXT — British spelling, short bursts).
- Whether to literally extend `starlight({ head: [...] })` array or compute it from a helper.
- Whether `Disallow: /releases/*.dmg` uses that glob or tightens to `Disallow: /releases/Covalence-`.

## Deferred Ideas

- Per-surface or per-page OG images.
- JSON-LD / structured data (Article, SoftwareApplication, FAQ schemas).
- RSS feed richness (IN-05).
- RSS link absolutisation (IN-06).
- Accessibility audit of new content (Phase 4 owns full a11y sweep).
- Extracting shared head config into a TS module.
- Blanket AI-crawler blocks in robots.txt.
- Hand-rolled sitemap.

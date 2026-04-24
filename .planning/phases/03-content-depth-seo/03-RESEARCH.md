# Phase 3: Content Depth & SEO - Research

**Researched:** 2026-04-22
**Domain:** Content depth (retrieval-stack technical copy) + SEO head-tag parity between Base.astro and Starlight `/docs/*`
**Confidence:** HIGH across the board — every CONT-01 number sourced from live Swift code; every SEO finding empirically verified against the current `dist/` build.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Content placement (CONT-01)**
- **D-01:** Full five-topic depth lives on a new Starlight page at `/docs/under-the-hood`, added to the sidebar under `src/content/docs/docs/under-the-hood.md`.
- **D-02:** `Architecture.astro` on `/` is rewritten into a 2–3 paragraph teaser that introduces the retrieval stack at a marketing-accessible altitude and links into `/docs/under-the-hood/` with an inline "Full technical deep-dive" CTA. Existing `arch-privacy` column is preserved.

**Content depth (CONT-01)**
- **D-03:** `/docs/under-the-hood` uses **prose + one schematic diagram + concrete numbers**. Concrete values are non-optional — plain prose alone doesn't clear the "credible at technical depth" bar.
- **D-04:** Five topics covered in this order (diagram maps 1:1 to prose): (1) Embedding model, (2) Asymmetric search, (3) Matryoshka truncation, (4) Hybrid search (vector + keyword via RRF), (5) Recency weighting.
- **D-05:** **Source of concrete numbers is `../covalence/` (main app repo).** Hard research dependency — if a value can't be sourced, the page notes it qualitatively rather than fabricating. *(This research session scouted the app repo exhaustively — see §Retrieval Stack Parameter Table. All 9 parameters are CONFIRMED.)*

**robots.txt (SEO-01)**
- **D-06:** `public/robots.txt` contains exactly four lines:
  ```
  User-agent: *
  Allow: /
  Disallow: /releases/*.dmg
  Sitemap: https://covalence.app/sitemap-index.xml
  ```
- **D-07:** No blanket AI-crawler blocks (GPTBot / Claude-Web / CCBot / Google-Extended). Explicitly rejected.

**Sitemap (SEO-02)**
- **D-08:** `@astrojs/sitemap` auto-generates `dist/sitemap-index.xml` + `sitemap-0.xml` on the current config. Plan verifies coverage.
- **D-09:** **No sitemap config changes unless verification surfaces a gap.** Only touch `astro.config.mjs` `@astrojs/sitemap` options if a URL is missing or a non-public URL is leaking. Prefer absence of config.

**Canonical URLs (SEO-03)**
- **D-10:** `Base.astro` already emits `<link rel="canonical">` — no change on marketing/posts/releases routes.
- **D-11:** Starlight `/docs/*` routes are patched via `starlight({ head: [...] })` in `astro.config.mjs`. Construction uses `new URL(path, Astro.site)` pattern (02.1-03 rule). *(Research note: Starlight already auto-emits canonical on `/docs/*`. See §Starlight head API — explicit mirror may be redundant; planner to confirm.)*

**OG + Twitter metadata (SEO-04)**
- **D-12:** `Base.astro`'s full OG + Twitter head block is mirrored into `starlight({ head: [...] })`. Per-page values use Starlight's frontmatter resolution.
- **D-13:** `public/og-image.png` (1200×627) stays as the single site-wide OG image. Differentiated per-surface images deferred.
- **D-14:** Success Criterion 5 verified by visiting built `dist/index.html` and `dist/docs/index.html` and inspecting `<meta>` tags. Social-card debugger on deployed CF Pages preview is the final acceptance gate.

**Phase 2.1 follow-ups**
- **D-15:** IN-05 (RSS feed richness) deferred.
- **D-16:** IN-06 (RSS `<link>` absolutisation) deferred.

### Claude's Discretion
- Exact Swift file paths in `../covalence/` to scout — researcher picks. *(Done: `Sources/CovalenceCore/EmbeddingEngine.swift` + `MemoryStore.swift` + `Package.swift` + `CLAUDE.md`.)*
- Mermaid vs inline SVG vs plain image for the one diagram. *(Recommended: inline SVG — see §Recommended Diagram Mechanism.)*
- Exact wording of the home-page teaser CTA link. *(Planner/executor; voice anchors provided in §Voice/Tone Anchors.)*
- Hand-authored literal array vs helper for `starlight({ head: [...] })`. *(Recommended: literal array for Phase 3; 6-tag addition doesn't justify a module.)*
- `Disallow` glob tightness. *(Researcher confirmed DMG URL shape — see §robots.txt; exact glob works cleanly.)*

### Deferred Ideas (OUT OF SCOPE)
- Per-surface or per-page OG images.
- JSON-LD / structured data (Article, SoftwareApplication, FAQ).
- RSS feed richness (IN-05): per-post `<atom:updated>`, per-post `og_image` enclosure.
- RSS `<link>` absolutisation (IN-06).
- Accessibility audit (Phase 4 owns this).
- Blanket AI-crawler blocks.
- Hand-rolled sitemap.
- Shared head config TypeScript module.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | "Under the hood" section covering embedding model, asymmetric search, Matryoshka truncation, hybrid search, and recency weighting at a depth a technical reader can evaluate | §Retrieval Stack Parameter Table supplies concrete numbers for every topic (all CONFIRMED from live Swift source) |
| SEO-01 | `robots.txt` served from site root, allowing indexing and pointing to the sitemap | §robots.txt provides final file content, DMG URL shape confirmed, Astro 6 `public/→dist/` copy-through verified |
| SEO-02 | `sitemap.xml` generated for all public pages | §Sitemap Verification Plan — empirically confirmed current `dist/sitemap-0.xml` lists 10 URLs covering `/`, `/releases/`, all 7 `/docs/*`, `/posts/` |
| SEO-03 | Canonical URL meta tag on every page | §Starlight Head API — Starlight already auto-emits canonical on every `/docs/*`; §Head Tag Mirror lists the base set |
| SEO-04 | OG + Twitter meta on home page and docs root | §Head Tag Mirror — exact delta (6 tags) between Base.astro's emission and what Starlight currently auto-emits; §Starlight Head API documents native tags to avoid duplicating |
</phase_requirements>

## Research Summary

- **All five CONT-01 retrieval numbers are findable in `../covalence/`** — every value (model name, dimensions, Matryoshka schedule, RRF k, recency function and constants, hardware path) is locatable at exact file:line in the Swift source. Zero UNAVAILABLE flags; zero fabrication needed.
- **Starlight already auto-emits ~80% of the OG/Twitter/canonical set on every `/docs/*` page** — the "full mirror" in D-12 is only a 6-tag delta (og:image + width/height, twitter:title/description/image). Mirroring the already-emitted tags would be redundant but not harmful (Starlight's `mergeHead` overwrites by name/property).
- **`@astrojs/sitemap` is working today** — registered internally by Starlight's `integrations/sitemap.ts`, which wraps the sitemap integration. `dist/sitemap-index.xml` and `dist/sitemap-0.xml` already emit with 10 URLs covering every public route. D-09's "prefer absence of config" is the right stance.
- **One marketing-copy flag for the planner:** the current `Architecture.astro` line 9 says "CoreML on Apple Neural Engine" and `Features.astro` line 21 says "CoreML on Apple Neural Engine" — but the app actually uses `jkrukowski/swift-embeddings` via **MLTensor** (app-repo `CLAUDE.md:283`), which is a CoreML-adjacent path, not a hand-authored `MLModel` with `computeUnits = .cpuAndNeuralEngine`. For the new `/docs/under-the-hood` page this is a credibility-critical distinction — the technical reader will spot it. Recommendation: say "MLTensor on Apple Silicon" or "swift-embeddings on Apple Silicon" for that one row. Does NOT block the phase; planner can defer the `Architecture.astro` / `Features.astro` wording correction to a follow-up.

**Primary recommendation:** Implement `robots.txt` + head-tag mirror (just the 6-tag delta, not the full duplicate) + new `under-the-hood.md` in that order; verify sitemap without touching config. Use inline SVG for the diagram (not `astro-mermaid`), given the Phase 2.1 Plan 06 Starlight-plugin landmine.

---

## Retrieval Stack Parameter Table

**All values CONFIRMED from live Swift source in `../covalence/`.** Every row below is implemented and shipping in v1.3.5.

| # | Parameter | Value | Source | Confidence |
|---|-----------|-------|--------|------------|
| 1 | Embedding model | `nomic-embed-text-v1.5` (fp16 safetensors, bundled ~261 MB) | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:39` (`static let modelName`); `../covalence/CLAUDE.md:277-283` | CONFIRMED |
| 2 | Embedding dim (native) | **768** (model output before truncation) | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:45` (`private static let fullDimensions = 768`) | CONFIRMED |
| 3 | Embedding dim (truncated) | **256** (stored in DB, used for search) | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:42` (`public static let dimensions = 256`) | CONFIRMED |
| 4 | Matryoshka schedule | **Single truncation 768 → 256** (not a multi-stage schedule). Comment: "~2% quality loss compared to full 768d, but 3x smaller vectors (1KB per memory vs 3KB)" | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:31-33` (docstring) + `truncateAndNormalize()` at line 125-133 | CONFIRMED |
| 5 | Truncation algorithm | Take first 256 floats, then L2-normalize via vDSP (`vDSP_svesq` + `vDSP_vsdiv`) | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:125-133` | CONFIRMED |
| 6 | Asymmetric search | Task-specific text prefixes injected before encoding: `"search_document: "` at store, `"search_query: "` at retrieval. Same model, different prompts. | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:16-21` (`TaskType.prefix`); `MemoryStore.swift:1193` (store uses `.searchDocument`, search uses `.searchQuery`) | CONFIRMED |
| 7 | Hybrid search (vector + keyword) | Two independent queries, merged: (a) vec0 KNN on `memories_vec` (sqlite-vec virtual table), (b) FTS5 BM25 on `memories_fts`. Fetched at `fetchLimit = max(limit × 4, 20)` (× 6 when filters active) then merged via RRF. | `../covalence/Sources/CovalenceCore/MemoryStore.swift:1204-1213` (KNN), `1328-1350` (FTS5) | CONFIRMED |
| 8 | RRF `k` parameter | **60.0** (the widely-cited "standard" k from the original 2009 Cormack RRF paper; Microsoft Azure and Elastic use the same default) | `../covalence/Sources/CovalenceCore/MemoryStore.swift:1355` (`let k = 60.0`) | CONFIRMED |
| 9 | Recency weighting function | `decayFactor = 1.0 / (1.0 + ageHours / 8760.0)` — a rational/hyperbolic decay, **not** exponential. `8760.0` is hours-per-year (24 × 365), so "a memory one year old gets half-weight in the recency component". | `../covalence/Sources/CovalenceCore/MemoryStore.swift:1432` | CONFIRMED |
| 10 | Recency composition | `finalScore = (1.0 − 0.10) × rrfScore + 0.10 × decayFactor × 0.033`. Recency contributes **10 %** of the final score; the `× 0.033` scales decay into the same numeric range as RRF. | `../covalence/Sources/CovalenceCore/MemoryStore.swift:1355-1433` (`recencyWeight = 0.10`) | CONFIRMED |
| 11 | Runtime hardware path | **MLTensor via `jkrukowski/swift-embeddings` on Apple Silicon.** Runs on the unified Apple Silicon compute stack (ANE / GPU / CPU scheduled by the system); does NOT pin explicitly to ANE. Requires macOS 15.0+ for `MLTensor`. | `../covalence/Package.swift:10` (SPM dep); `../covalence/CLAUDE.md:283` ("Runs on Apple Silicon via MLTensor — no separate CoreML conversion needed"); `EmbeddingEngine.swift:34` (`@available(macOS 15.0, *)`) | CONFIRMED |

### Additional context useful for the prose

- **Chunking before embedding:** memories < 512 tokens embed as one chunk; memories > 512 tokens split into overlapping chunks (256-token overlap). Search returns parent note ranked by best chunk match. `../covalence/CLAUDE.md:293-297`.
- **Threshold cut:** pre-RRF, a cosine-similarity threshold (default `0.3`, configurable) filters the vec0 candidates. `MemoryStore.swift:1260-1263`.
- **Pre-filter post-fetch:** tags / source / core filters run post-fetch in Swift (not in SQL); `fetchLimit` multiplier bumps to ×6 when any filter is active. `MemoryStore.swift:1204`.
- **Two-step KNN pattern (why it matters if the page touches SQL detail):** vec0 requires `MATCH` and `k=` as the only WHERE constraints — so KNN runs first on the virtual table, then candidates are looked up in `memories` for filtering. `MemoryStore.swift:1198-1201` (explicit comment).

### Tone/credibility notes for the planner

- The **"CoreML on Apple Neural Engine"** line that currently ships on `/` (Architecture.astro:9, Features.astro:21) is **not technically accurate** — `swift-embeddings` uses `MLTensor`, an Apple Silicon unified-compute abstraction. It routes through CoreML-like kernels and *may* use ANE, but the code does not declare `MLModelConfiguration(computeUnits: .cpuAndNeuralEngine)`. A technical reader on `/docs/under-the-hood` will catch this. Recommended wording for the new page: **"Runs on Apple Silicon via MLTensor (nomic-embed-text-v1.5, fp16 safetensors)"** — accurate, specific, not hedged. The planner may want to fold a one-line correction into `Architecture.astro` / `Features.astro` while it's editing those files anyway, or defer to a trailing quick-task.
- **RRF k=60 is not a Covalence choice** — it's the standard constant from the original paper. Saying so ("we use the standard RRF constant of 60 from Cormack et al. 2009") is a credibility signal.
- **Recency at 10% weight is a design decision worth owning** — the page should say something like "we weight recency at 10% of the final score so that very recent memories rank above equally-relevant old ones, without letting recency override genuine relevance." The numbers (10%, 8760h half-life-equivalent) make this concrete.

---

## Head Tag Mirror — exact tag set to port to `starlight({ head })`

### What Base.astro emits today (the reference)

From `src/layouts/Base.astro:11, 23, 29-41`:

```html
<!-- from line 11, 23 -->
<meta name="description" content={description}>
<link rel="canonical" href={canonicalURL}>   <!-- new URL(Astro.url.pathname, Astro.site) -->

<!-- from lines 29-35: Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content={title}>
<meta property="og:description" content={description}>
<meta property="og:url" content={canonicalURL}>
<meta property="og:image" content={new URL('/og-image.png', Astro.site)}>
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">

<!-- from lines 38-41: Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content={title}>
<meta name="twitter:description" content={description}>
<meta name="twitter:image" content={new URL('/og-image.png', Astro.site)}>
```

### What Starlight currently auto-emits on `/docs/*`

**Empirically verified** by `grep -oE '...' dist/docs/index.html`:

```html
<link rel="canonical" href="https://covalence.app/docs/">
<meta property="og:title" content="Covalence Docs">
<meta property="og:type" content="article">            <!-- ← NOT "website" -->
<meta property="og:url" content="https://covalence.app/docs/">
<meta property="og:locale" content="en">
<meta property="og:description" content="Everything you need to get started with Covalence — persistent, private memory for any AI client.">
<meta property="og:site_name" content="Covalence">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="Everything you need to get started with Covalence — ...">
<!-- also emits <link rel="sitemap">, favicon, viewport, generator, charset -->
```

Source: `node_modules/@astrojs/starlight/utils/head.ts:30-72` (the `headDefaults` array).

### The DELTA the planner must add

Only these 6 tags are missing from Starlight's auto-emission and need to be added via `starlight({ head: [...] })`:

```js
{ tag: 'meta', attrs: { property: 'og:image',        content: 'https://covalence.app/og-image.png' } },
{ tag: 'meta', attrs: { property: 'og:image:width',  content: '1200' } },
{ tag: 'meta', attrs: { property: 'og:image:height', content: '627'  } },
{ tag: 'meta', attrs: { name:     'twitter:title',       content: /* page title — see note below */ } },
{ tag: 'meta', attrs: { name:     'twitter:description', content: /* page desc  — see note below */ } },
{ tag: 'meta', attrs: { name:     'twitter:image',       content: 'https://covalence.app/og-image.png' } },
```

### Decision points the planner must make

1. **Literal mirror of the full block (D-12) vs delta-only mirror.** A full mirror works (Starlight's `mergeHead` at `utils/head.ts:185-187` filters out Starlight's default when the user supplies the same name/property), but it's ~8 redundant tags that look like they mean something. **Recommend: delta-only mirror.** Four lines of rationale comment above the array in `astro.config.mjs`. If a future phase wants a shared single source of truth between `Base.astro` and this array, it's a clean follow-on refactor.

2. **twitter:title / twitter:description values.** Starlight's `head: [...]` is a **static array** of `{ tag, attrs, content }` — not a function. There is **no per-route dynamic value** available at config level. Options:
   - **2a.** Hardcode site-wide values (use the site's landing-page title + description). Works for the social-card debugger test on `/docs/`, but makes every `/docs/*` page's twitter card show the same title/description. This is what Starlight effectively does for `twitter:card` today — it ships one fixed value.
   - **2b.** Put the twitter-per-page tags in each doc file's frontmatter via Starlight's `head` frontmatter field (Starlight merges frontmatter `head` into the page's final head — see `utils/head.ts:119`). Per-page accurate, but requires editing each of the 7 docs files.
   - **2c.** Accept that Starlight already emits `og:title` / `og:description` per-page accurately; twitter platforms fall back to `og:*` when `twitter:*` is missing. **Skip** `twitter:title` and `twitter:description` entirely; only add `twitter:image`.
   
   **Recommend 2c.** Modern Twitter/X falls back to `og:title` and `og:description` when `twitter:title` / `twitter:description` are absent — this is the documented Twitter Cards behavior. Skipping those two tags lets per-page accuracy ride on Starlight's auto `og:*` emission. Success Criterion 5 is "title, description, and an image — not a blank card"; Starlight already emits title + description + og-level; the delta is just the image set. That reduces the mirror to **4 tags** (og:image ×3 + twitter:image).
   
   If planner rejects 2c, 2a is the easy fallback (hardcoded site-level title/description).

3. **`og:type = "article"` on docs vs `"website"` on marketing.** Starlight's "article" is semantically correct for doc pages (they are articles). Base.astro says "website" for the landing page, which is also correct. Mismatch is **not a bug** — it's content-appropriate typing. Do NOT override Starlight's "article". The social-card debugger will still render the card identically for both values.

### Structural template (already proven in `astro.config.mjs:15-24`)

The existing Plan 02.1-04 tag:
```js
{
  tag: 'link',
  attrs: {
    rel: 'alternate',
    type: 'application/rss+xml',
    title: 'Covalence Blog',
    href: '/posts/rss.xml',
  },
},
```
lands in `dist/docs/index.html` as `<link rel="alternate" type="application/rss+xml" title="Covalence Blog" href="/posts/rss.xml"/>`. Empirically verified. The 4 new tags go in the same array, same shape.

---

## Starlight `head` API — per-route vs static, native tags to avoid duplicating

**API shape:** `starlight({ head: [{ tag: string, attrs?: Record<string,string|boolean|undefined>, content?: string }, ...] })`.
**Source:** `node_modules/@astrojs/starlight/schemas/head.ts:4-47`.

- `head` is a **static array** — not a function. No `Astro.site` or `Astro.url` at config evaluation time. Hardcoded absolute URLs for `og:image` etc. are therefore the pragmatic approach (the site URL is already hardcoded at `astro.config.mjs:5` as `site: 'https://covalence.app'`).
- **For per-page/per-route values**, Starlight supports a `head` field in each page's frontmatter (same schema). Merged via `createHead(defaults, config.head, frontmatterHead)` at `utils/head.ts:119` — frontmatter wins over config, config wins over defaults.
- **Merge semantics (important — this is why duplicates are safe):** `mergeHead()` at `utils/head.ts:185-187` + `hasTag()` at lines 140-155 filter out a later entry that matches a prior entry by tag name for `<title>`, by `name`/`property`/`http-equiv` for `<meta>`, and by `rel="canonical"` / `rel="sitemap"` for `<link>`. So when the user supplies `{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } }`, Starlight's default `og:type: article` is removed. **No risk of duplicate `<meta property="og:type">` in the output.**

### Starlight defaults that conflict-by-name with Base.astro's set (will be overridden if mirrored)

| Tag | Starlight's default value | Base.astro's value | If mirrored |
|-----|---------------------------|---------------------|-------------|
| `<link rel="canonical">` | `new URL(pathname, site)` — the right thing | same formula via `Astro.site` | Starlight's auto-emission is already correct; no mirror needed. |
| `<meta property="og:title">` | `data.title` (Starlight frontmatter) | `{title}` | Starlight's per-page value is correct; no mirror needed. |
| `<meta property="og:type">` | `"article"` | `"website"` | Mirror overrides to `"website"`. Not recommended — "article" is semantically right for docs. |
| `<meta property="og:url">` | `new URL(pathname, site)` | same | No mirror needed. |
| `<meta property="og:description">` | `data.description || config.description` | `{description}` | Starlight's per-page value is correct; no mirror needed. |
| `<meta name="twitter:card">` | `summary_large_image` | `summary_large_image` | Same value; no mirror needed. |
| `<meta name="description">` | `data.description || config.description` | `{description}` | Starlight's per-page value is correct; no mirror needed. |

**Bottom line: the 4-tag delta (og:image + width + height + twitter:image) is all that's actually missing.** See §Head Tag Mirror for the planner's decision options 2a/2b/2c.

---

## Sitemap Verification Plan

### Current state (empirically confirmed)

- `@astrojs/sitemap@3.7.2` is **installed** as a dependency of Starlight (`package-lock.json:118`). It's not directly listed in `package.json` dependencies, because Starlight registers it internally via `integrations/sitemap.ts`: `starlightSitemap(opts)` calls `sitemap(getSitemapConfig(opts))`. Source: `node_modules/@astrojs/starlight/integrations/sitemap.ts:21-23` + `index.ts` (which registers `starlightSitemap` as part of the Starlight integration object).
- `dist/sitemap-index.xml` and `dist/sitemap-0.xml` are produced on every build.
- Current `dist/sitemap-0.xml` content (read directly, 2026-04-22):
  ```
  https://covalence.app/
  https://covalence.app/docs/
  https://covalence.app/docs/ai-instruction/
  https://covalence.app/docs/core-memories/
  https://covalence.app/docs/getting-started/
  https://covalence.app/docs/keyboard-shortcuts/
  https://covalence.app/docs/mcp-tools/
  https://covalence.app/docs/spaces/
  https://covalence.app/posts/
  https://covalence.app/releases/
  ```
  10 URLs. All of Success Criterion 3's required coverage is already present.

### Verification command sequence for the planner / executor

```bash
# 1. Build fresh (after adding under-the-hood.md, so it gets into the list)
npm run build

# 2. Sitemap-index exists and has exactly one inner sitemap
test -f dist/sitemap-index.xml && grep -c '<loc>' dist/sitemap-index.xml   # expect: 1

# 3. Sitemap-0 has the 11 required URLs (10 today + under-the-hood after CONT-01 lands)
grep -oE '<loc>[^<]+</loc>' dist/sitemap-0.xml

# Expected URLs (11 after /docs/under-the-hood/ is added):
#   https://covalence.app/
#   https://covalence.app/releases/
#   https://covalence.app/posts/
#   https://covalence.app/docs/                (Starlight auto-root)
#   https://covalence.app/docs/ai-instruction/
#   https://covalence.app/docs/core-memories/
#   https://covalence.app/docs/getting-started/
#   https://covalence.app/docs/keyboard-shortcuts/
#   https://covalence.app/docs/mcp-tools/
#   https://covalence.app/docs/spaces/
#   https://covalence.app/docs/under-the-hood/  (NEW — from this phase)

# 4. No non-public URL has leaked (no drafts, no test paths, no /api/*)
grep -oE '<loc>[^<]+</loc>' dist/sitemap-0.xml | grep -iE 'draft|test|api|admin' && echo "LEAK" || echo "clean"
```

### D-09 enforcement

The default config produces correct output. **Do NOT register `@astrojs/sitemap` in `astro.config.mjs` integrations, and do NOT add a `sitemap()` call** — Starlight already does this internally, and double-registering Astro integrations can produce duplicate emission (each integration instance would try to write the same files). If the verification surfaces a gap:
- **Missing URL:** the likely cause is a non-Starlight, non-file-based page that isn't auto-discovered. Fix is to add `customPages: ['https://covalence.app/missing-path']` to the sitemap options via `starlight({ head: [...], ... })` — but Starlight's sitemap wrapper does not forward user sitemap options as of 0.38.3. The escape hatch is to register `@astrojs/sitemap` directly AND exclude duplicates; this is a meaningful config change and should be a separate task if it arises.
- **Leaking URL:** add `filter: (page) => !page.includes('/drafts/')` via the same path.
- **Expected default path:** verification passes, no config change, D-09 respected.

---

## robots.txt — final content + DMG Disallow glob

### DMG URL shape (verified)

From `src/data/releases.json` (lines 7, 17, 27):
```
https://covalence.app/releases/Covalence-1.3.5.dmg
https://covalence.app/releases/Covalence-1.3.4.dmg
https://covalence.app/releases/Covalence-1.3.2.dmg
```

And from `src/components/Hero.astro:26`:
```
https://covalence.app/releases/Covalence-latest.dmg
```

So the DMG filename pattern is consistently `Covalence-<version>.dmg` and `Covalence-latest.dmg` — always under `/releases/` path, always with `.dmg` suffix. `public/_routes.json:2` excludes `/releases/Covalence-*` from Pages routing (confirmed at line 1 of `dist/_routes.json`) so the DMG host-side routing already passes through to the worker.

### Final file content (exact bytes for `public/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /releases/*.dmg
Sitemap: https://covalence.app/sitemap-index.xml
```

Four lines, newline-terminated, ASCII only. Matches D-06 verbatim.

### Glob `Disallow: /releases/*.dmg` analysis

- **Standard RFC 9309-compatible wildcard** — the `*` matches zero or more non-`/` path characters. Google, Bing, and major crawlers all honor this pattern. Matches:
  - `/releases/Covalence-1.3.5.dmg` ✓
  - `/releases/Covalence-latest.dmg` ✓
  - `/releases/Covalence-1.3.4.dmg` ✓
- **Does NOT match:** `/releases/` (the HTML page — good, we want it indexed), `/releases/index.html` (same), or any future `/releases/notes/...` subpath.
- **Alternative considered (D-82):** `Disallow: /releases/Covalence-` is tighter (matches only DMG filenames by prefix). Both work. The `*.dmg` glob is slightly more robust — if the release ingestion workflow ever names a `.dmg` something other than `Covalence-*`, `*.dmg` still blocks it.

### Astro 6 `public/` → `dist/` copy-through behavior (verified)

Astro 6 in SSG mode copies every file in `public/` verbatim to `dist/` without transformation. Empirically verified on this project:
- `public/_routes.json` → `dist/_routes.json` (byte-identical; already verified via `cat dist/_routes.json`).
- `public/og-image.png` → `dist/og-image.png`, `public/favicon.svg` → `dist/favicon.svg`, etc.

So `public/robots.txt` will land at `dist/robots.txt` unchanged. Cloudflare Pages serves `dist/` as the site root → `https://covalence.app/robots.txt` returns the four lines verbatim.

---

## Recommended Diagram Mechanism

### Decision: **inline SVG, hand-authored, committed directly in `under-the-hood.md`**

### Rationale

1. **Phase 2.1 Plan 06 landmine.** A standalone Astro integration that touches Starlight's render path silently replaced Starlight's bundled Expressive Code with an incompatible theme set. The team has one bad install incident (commit `4d258b0` — remove standalone EC). Any plugin that hooks into Markdown processing on `/docs/*` is a risk of the same class. **Adding zero new Astro integrations is the safest choice.**
2. **Scope: one diagram, once.** `astro-mermaid@2.0.1` (peer `astro: '>=4'`, `mermaid: '^10.0.0 || ^11.0.0'`) is a clean plugin, but it pulls Mermaid (~200 KB minified gz) for a single schematic. Mermaid is appropriate when you have many diagrams or non-developer authors; this project has one diagram and one author.
3. **Starlight-specific options are immature.** `starlight-client-mermaid` (`pasqal-io` GitHub) is v0.1.0, not on npm, GitHub-only. Adoption is thin; not a dependency Covalence should take on.
4. **Inline SVG is native to Markdown.** Starlight renders `.md` files through MDX-ish but still accepts raw HTML, including `<svg>`. No bundler involvement, no plugin surface area, no theme-selector collisions.
5. **Accessibility is cheap with SVG.** `<svg role="img" aria-labelledby="title-id desc-id"><title id="title-id">...</title><desc id="desc-id">...</desc>...</svg>` is trivially compliant. With Mermaid, you inherit whatever the plugin does.
6. **Dark-mode handling is trivial with CSS.** Use `currentColor` for strokes / fills and let Starlight's theme tokens do the work — `svg text { fill: var(--sl-color-white); }` etc. No theme-switch plumbing needed.

### Install / config steps (there are none)

- Place the diagram as raw `<svg>` markup directly in `src/content/docs/docs/under-the-hood.md`, between the prose sections that introduce it (after "Embedding model" and before "Asymmetric search" — or wherever the 5-topic flow reaches the pipeline schematic).
- Target dimensions: roughly ~700 px wide × ~240 px tall to fit Starlight's `/docs/*` content column (which caps around 704 px).
- Use a monochrome scheme with `stroke="currentColor"` on all primitives so dark/light themes work without additional CSS.
- For the arrow glyphs, a single `<marker>` definition inside `<defs>` is all that's needed; no external icon library.

### Escape hatch

If hand-authoring the SVG turns out to be painful during execution, the executor can render the diagram in Mermaid Live Editor, export to `.svg`, commit to `public/diagrams/under-the-hood.svg`, and embed via `<img src="/diagrams/under-the-hood.svg" alt="..." />`. This is still zero-plugin, still static. **Avoid committing a `.png` export** — SVG scales; PNG will look fuzzy on Retina.

### Diagram content (per D-03 specifics section)

```
[Query] ──► [Embedding encoder] ──► [Matryoshka truncation: 768 → 256]
                                               │
                             ┌─────────────────┴─────────────────┐
                             ▼                                   ▼
                     [Vector search (vec0 KNN)]    [FTS5 keyword search (BM25)]
                             └─────────────────┬─────────────────┘
                                               ▼
                              [RRF merge: k = 60]
                                               │
                                               ▼
                            [Recency weighting (10%)]
                                               │
                                               ▼
                                         [Results]
```

Five labeled stations map 1:1 to the five CONT-01 topics in D-04 order. Document as `role="img"` with an `aria-describedby` linking to a long-text description of the same flow underneath.

---

## Voice/Tone Anchors

**Three concrete phrases already in the site**, usable as tone targets for both the new `Architecture.astro` teaser copy and the `/docs/under-the-hood` prose:

1. **`Hero.astro:23` —** "Runs on your Mac. Private, fast, and entirely yours." — Short bursts (6+4+3 words), period between each. No commas doing the work of conjunctions. This is the cadence the teaser should match.

2. **`Architecture.astro:18` (the privacy-column opening statement, which survives this phase) —** "Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device." — Denial cascade: five declarative statements, three of them two-word sentences. The teaser's retrieval-stack paragraphs should have at least one of these "No X." rhythm breaks.

3. **`HowItWorks.astro:3` (the section heading — not a sentence, but a prompt) —** "Two copy-pastes. That's it." — Four words total, period after the first claim, two-word confirmation. This is the register for anything that wants to make a confident, minimal claim. A teaser sentence like "256 dimensions. That's the whole vector." would land in this tone.

**Shared traits across all three:**
- British spelling elsewhere (e.g. "Serialised", "minimise" in `.planning/` docs and prior SUMMARYs — not enforced in `src/components/` yet, so the teaser is the place to start).
- **No adjectives that do emotional work** — "instant", "amazing", "powerful" are absent. When adjectives appear (`Private`, `fast`, `entirely yours`), they are load-bearing specifics, not cheerleading.
- **Concrete numbers preferred over qualifiers** — the existing `Architecture.astro:9` row "CoreML on Apple Neural Engine — on-device, instant, free" is the one place the current copy slips (both "instant" and "free" are promotional). The planner should drop those two words in the rewrite; the new teaser (and the deep page) should follow the Hero/privacy cadence instead.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | all Astro build/dev | ✓ | 22.16.0 (via `.nvmrc`) | — |
| npm | dependency install | ✓ | (bundled with Node 22.16.0) | — |
| Astro | build | ✓ | 6.1.6 (installed) | — |
| `@astrojs/starlight` | `/docs/*` routing | ✓ | 0.38.3 (installed) | — |
| `@astrojs/sitemap` | SEO-02 | ✓ | 3.7.2 (transitive dep of Starlight; auto-registered internally — **do NOT list in integrations**) | — |
| `../covalence/` sibling repo | CONT-01 number sourcing | ✓ | present at `/Users/darron/Work/covalence/`; `Sources/CovalenceCore/` + `Package.swift` readable | — (hard research dep — blocker if missing, but present and scouted in this session) |

**Nothing missing; no fallback needed.** All research citations verified against live source in this session.

---

## Common Pitfalls

### Pitfall 1: Registering `@astrojs/sitemap` in `astro.config.mjs` integrations alongside Starlight
**What goes wrong:** Starlight's `starlightSitemap(opts)` internally calls `sitemap(...)` with its own config. Adding a second `sitemap()` call at the root integrations array produces either duplicate emission (two sitemap files write-racing) or a plugin-ordering error. Failure mode: build succeeds but `dist/sitemap-0.xml` is either stale or missing entries.
**How to avoid:** Do not add `sitemap` to `astro.config.mjs`. D-09 mandates this; it's also a technical constraint of Starlight 0.38.
**Warning sign:** If the planner ever writes `import sitemap from '@astrojs/sitemap'` in `astro.config.mjs`, stop and revisit.

### Pitfall 2: Per-route dynamic values in `starlight({ head: [...] })`
**What goes wrong:** Trying to compute `{new URL(path, Astro.site)}` inside the array — it runs at config load, not per-route render. Produces build-time undefined or static values baked into every page.
**How to avoid:** Hardcode absolute URLs (site URL is already fixed at `'https://covalence.app'` in the same file, line 5). For per-page variation, use Starlight frontmatter's `head` field (see `utils/head.ts:119`). For the 4-tag OG/Twitter image mirror, site-level hardcoding is the right answer — og-image.png is site-wide.

### Pitfall 3: `Architecture.astro` `arch-privacy` column accidentally rewritten
**What goes wrong:** D-02 scope is the `arch-stack` column only. The `arch-privacy` column is a voice anchor and must survive untouched — touching it expands the phase's blast radius and risks collateral regression in a column that has no tech-content reason to change.
**How to avoid:** Executor's diff on `src/components/Architecture.astro` should show ONLY lines 5-14 of the current file replaced; lines 15-25 (`.arch-privacy`) and lines 30-89 (`<style>`) remain byte-identical.
**Warning sign:** A diff showing >25 net lines changed in `Architecture.astro` is probably touching both columns or styles.

### Pitfall 4: Fabricating retrieval numbers because a spec file wasn't skimmed
**What goes wrong:** Prose on `/docs/under-the-hood` invents a number (e.g., "Matryoshka schedule [64, 128, 256, 512, 768]" — which is what some nomic docs describe but is NOT what Covalence ships). A technical reader who knows the nomic paper will double-check and lose trust.
**How to avoid:** Every number on the page comes from §Retrieval Stack Parameter Table or is explicitly cited from app-repo source. Copy can link to the nomic paper for model context but must not describe Covalence's use of it beyond what the code does.
**Warning sign:** Any number in the new page that doesn't appear in the §Retrieval Stack Parameter Table above.

### Pitfall 5: New docs page uses MDX/JSX or indented code blocks
**What goes wrong:** Starlight `/docs/*` uses plain `.md`, not `.mdx` (no `@astrojs/mdx` integration installed — see Phase 2.1 02.1-07 decision). JSX components render as lowercase HTML. Indented fenced code blocks become CommonMark indented-code-blocks (no language tag, no Expressive Code).
**How to avoid:** File extension is `.md` not `.mdx`. Fenced code blocks start at column 1. No `<Tabs>`, no `<TabItem>`, no JSX. Linear H2/H3 structure for the five topics.
**Warning sign:** Any backtick fence indented with spaces ahead of it, or any capitalized tag name in the file.

### Pitfall 6: `og:image` path written as a relative URL
**What goes wrong:** `content: '/og-image.png'` renders as a root-relative URL, which the social-card debuggers (Twitter, Facebook) do not resolve — they need an absolute origin. Card renders blank.
**How to avoid:** Use the full absolute URL in the `starlight({ head })` array: `'https://covalence.app/og-image.png'`. Base.astro's `new URL('/og-image.png', Astro.site)` already produces absolute URLs; the mirror should match with a hardcoded absolute.
**Warning sign:** Any `content: '/...'` value on an `og:` or `twitter:` meta tag.

### Pitfall 7: Treating "CoreML on Apple Neural Engine" as ground truth
**What goes wrong:** The current `Architecture.astro:9` and `Features.astro:21` both say "CoreML on Apple Neural Engine — on-device, instant, free". The app uses MLTensor (from `swift-embeddings`), which is CoreML-adjacent but does not explicitly target ANE. A knowledgeable reader on `/docs/under-the-hood` who sees "CoreML on Apple Neural Engine" as a claim we have to justify will look for `MLModelConfiguration(computeUnits: .cpuAndNeuralEngine)` and find it missing. Credibility hit.
**How to avoid:** Use **"MLTensor on Apple Silicon"** or **"swift-embeddings via MLTensor on Apple Silicon"** in the new page. If the planner is touching `Features.astro` / `Architecture.astro` anyway, a parallel one-line tweak in those components aligns the marketing copy with the deep page. If not, defer to a follow-up quick task — the deep page's wording is the one that matters most for technical credibility.

---

## Code Examples

### `starlight({ head: [...] })` — delta-only mirror (recommended shape)

```js
// astro.config.mjs (full file after Phase 3)
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://covalence.app',
  output: 'static',
  build: {
    assets: '_assets',
  },
  integrations: [
    starlight({
      title: 'Covalence',
      description: 'Persistent memory for any AI client — local, private, zero configuration.',
      customCss: ['./src/styles/starlight.css'],
      // Starlight already emits canonical, og:title, og:type, og:url, og:description, og:site_name,
      // twitter:card, and meta description on every /docs/* page. This array only adds the tags
      // Starlight does NOT auto-emit — og:image (+ dimensions) and twitter:image — so /docs/* reaches
      // parity with Base.astro's SEO head block without duplicate emission.
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'Covalence Blog',
            href: '/posts/rss.xml',
          },
        },
        { tag: 'meta', attrs: { property: 'og:image',        content: 'https://covalence.app/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width',  content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '627'  } },
        { tag: 'meta', attrs: { name:     'twitter:image',   content: 'https://covalence.app/og-image.png' } },
      ],
      social: [],
      sidebar: [
        { label: 'Getting Started',     slug: 'docs/getting-started' },
        { label: 'Spaces',              slug: 'docs/spaces' },
        { label: 'Core Memories',       slug: 'docs/core-memories' },
        { label: 'Under the Hood',      slug: 'docs/under-the-hood' },   // NEW
        { label: 'MCP Tools',           slug: 'docs/mcp-tools' },
        { label: 'AI Instruction',      slug: 'docs/ai-instruction' },
        { label: 'Keyboard Shortcuts',  slug: 'docs/keyboard-shortcuts' },
      ],
    }),
  ],
});
```
Source of API shape: `node_modules/@astrojs/starlight/schemas/head.ts:4-47` (HeadConfigSchema).
Source of merge semantics: `node_modules/@astrojs/starlight/utils/head.ts:119, 185-187`.

### Retrieval-stack explainer frontmatter (shape for `under-the-hood.md`)

```md
---
title: Under the Hood
description: How Covalence finds the right memory — embedding model, Matryoshka truncation, hybrid search, and recency weighting, with the concrete numbers.
---

Covalence turns text into vectors, stores them in SQLite, and combines vector
similarity with keyword search to answer your AI's questions. Every piece of
this pipeline runs on your Mac. This page explains what's in the pipeline,
and the specific numbers we picked.

## The embedding model
...
```

Source of pattern: `src/content/docs/docs/getting-started.md:1-4` (existing Starlight frontmatter shape).

---

## State of the Art

| Old approach | Current approach | When changed | Impact |
|--------------|------------------|--------------|--------|
| Standalone `astro-expressive-code` on `/posts/*` + Starlight EC on `/docs/*` | Starlight's bundled EC owns both | Phase 2.1 Plan 06 (commit `4d258b0`, 2026-04-21) | Any future Astro integration that touches Markdown rendering on `/docs/*` is a risk of the same regression. Diagram mechanism recommendation above (inline SVG, no plugin) is the defensive choice. |
| Mermaid in plain Astro docs via `rehype-mermaid` or MDX | `astro-mermaid@2.0.1` (client-side, Mermaid v10/11) or `starlight-client-mermaid` (Starlight-specific, v0.1.0, GitHub-only) | 2025 — Mermaid integrations matured in Astro v5/v6 | Neither is adopted here; inline SVG chosen instead. If the page later grows multiple diagrams, `astro-mermaid` is the preferred plugin (no Starlight-specific plugin surface area). |
| Hardcoded `og:*` + `twitter:*` on every layout file | Starlight auto-emits most of the OG/Twitter set from frontmatter + config | Starlight 0.29+ | Means D-12's "full mirror" overstates the delta. Only 4 missing tags on `/docs/*` today; rest is already correct. |

---

## Assumptions Log

> All claims tagged `[ASSUMED]` appear below. The planner and discuss-phase use this table to identify decisions that need user confirmation before execution.

*(Empty — every claim in this research is either VERIFIED (live source code, `dist/` grep, `npm view`) or CITED (Starlight source files, official docs paths). No assumptions requiring user confirmation.)*

---

## Open Questions

1. **Is the planner willing to drop "instant" and "free" from the existing marketing copy while rewriting the `arch-stack` column?**
   - What we know: D-02 says "rewrite arch-stack column (2–3 paragraph teaser + CTA), preserve arch-privacy". The existing arch-stack bullet `Embeddings: CoreML on Apple Neural Engine — on-device, instant, free` contains two promotional adjectives (`instant`, `free`) that clash with the voice principles (no superlatives). The rewrite will replace this whole column anyway, so the words don't survive — but the executor needs to know the replacement voice is *explicitly* not those.
   - Recommendation: planner adds an explicit invariant in the plan — "no evaluative adjectives (instant, fast, powerful, amazing, free); only numeric specifics and neutral descriptors".

2. **`og:type = "article"` on `/docs/*` vs `"website"` on `/` — intentional or drift?**
   - What we know: Starlight emits "article" by design (docs pages are articles). Base.astro emits "website" (the landing page is the site). Both are semantically correct for their surfaces.
   - Recommendation: leave them alone. Success Criterion 5 does not require uniform `og:type`.

3. **Does the planner want to correct `Architecture.astro` + `Features.astro` "CoreML on Apple Neural Engine" wording in this phase, or defer?**
   - What we know: the new `/docs/under-the-hood` page will be specific ("MLTensor on Apple Silicon"). If `/` keeps saying "CoreML on Apple Neural Engine", a reader who clicks through sees a small mismatch.
   - Recommendation: fold the Features.astro fix into this phase (one-line string change) so `/` and `/docs/under-the-hood/` tell the same story. Architecture.astro is being rewritten anyway per D-02.

---

## Sources

### Primary (HIGH confidence — verified this session)

**Covalence app repo — live Swift source**
- `/Users/darron/Work/covalence/Sources/CovalenceCore/EmbeddingEngine.swift` — lines 16-22 (TaskType / prefixes), 39 (model name), 42 (dim=256), 45 (fullDim=768), 125-133 (truncate+L2-normalize)
- `/Users/darron/Work/covalence/Sources/CovalenceCore/MemoryStore.swift` — lines 1193 (query task prefix), 1198-1213 (KNN two-step), 1328-1350 (FTS5 query), 1352-1436 (RRF + recency composition)
- `/Users/darron/Work/covalence/Package.swift` — line 10 (`swift-embeddings` SPM dep)
- `/Users/darron/Work/covalence/CLAUDE.md` — lines 22, 277-283 (embedding strategy), 313 (MLTensor hardware path), 430 (stack table)

**Starlight + sitemap internals (node_modules read directly)**
- `/Users/darron/Work/covalence-website/node_modules/@astrojs/starlight/utils/head.ts` — lines 30-72 (headDefaults array), 119 (createHead merge), 140-155 (hasTag dedup logic), 185-187 (mergeHead)
- `/Users/darron/Work/covalence-website/node_modules/@astrojs/starlight/schemas/head.ts` — lines 4-47 (HeadConfigSchema — static array shape, no function form)
- `/Users/darron/Work/covalence-website/node_modules/@astrojs/starlight/integrations/sitemap.ts` — lines 21-23 (Starlight's internal sitemap wrapper)
- `/Users/darron/Work/covalence-website/node_modules/@astrojs/starlight/utils/canonical.ts` — full file (formatCanonical using `Astro.site`)

**Existing website code + built artifacts**
- `/Users/darron/Work/covalence-website/src/layouts/Base.astro` — lines 11 (canonicalURL), 23 (canonical tag), 29-41 (OG + Twitter block)
- `/Users/darron/Work/covalence-website/astro.config.mjs` — lines 15-24 (existing single-tag head injection — structural template)
- `/Users/darron/Work/covalence-website/src/components/Architecture.astro` — lines 5-14 (arch-stack column to rewrite), 15-25 (arch-privacy column unchanged)
- `/Users/darron/Work/covalence-website/src/pages/releases.astro` — lines 10, 106 (DMG link pattern via `r.download_url`)
- `/Users/darron/Work/covalence-website/src/pages/posts/[...slug].astro` — lines 24-45 (per-page canonical + OG reference pattern)
- `/Users/darron/Work/covalence-website/src/data/releases.json` — lines 7, 17, 27 (DMG URL shape confirmed)
- `/Users/darron/Work/covalence-website/src/components/Hero.astro` — line 26 (`Covalence-latest.dmg` URL shape)
- `/Users/darron/Work/covalence-website/src/components/Features.astro` — line 21 (voice anchor + "CoreML on Apple Neural Engine" wording flag)
- `/Users/darron/Work/covalence-website/src/components/HowItWorks.astro` — line 3 (voice anchor "Two copy-pastes. That's it.")
- `/Users/darron/Work/covalence-website/src/content/docs/docs/getting-started.md` — lines 1-4 (Starlight frontmatter pattern)
- `/Users/darron/Work/covalence-website/package.json` — dependencies (Astro 6.1.6, Starlight 0.38.3, no direct sitemap, no mermaid)
- `/Users/darron/Work/covalence-website/package-lock.json` — line 118 (`@astrojs/sitemap@3.7.2` as transitive dep)
- `/Users/darron/Work/covalence-website/public/` — `_routes.json`, `og-image.png`, `og-image.svg`, fonts, favicons (no existing `robots.txt`)
- `/Users/darron/Work/covalence-website/dist/sitemap-0.xml` — the 10 URLs already emitted (verified)
- `/Users/darron/Work/covalence-website/dist/docs/index.html` — Starlight's current OG/Twitter emission (verified via `grep -oE`)
- `/Users/darron/Work/covalence-website/dist/index.html` — Base.astro's current OG/Twitter emission (verified via `grep -oE`)
- `/Users/darron/Work/covalence-website/dist/_routes.json` — confirms `public/` → `dist/` copy-through is byte-identical

### Secondary (MEDIUM confidence — external references, verified against primary)
- `npm view astro-mermaid version` → `2.0.1`; `peerDependencies` → `astro: '>=4'`, `mermaid: '^10.0.0 || ^11.0.0'`
- `npm view starlight-client-mermaid` → 404 (confirms GitHub-only)
- [Astro Starlight — Plugins and Integrations](https://starlight.astro.build/resources/plugins/) — mermaid support not out-of-box; third-party plugin is the canonical path
- [Mermaid support discussion — withastro/starlight#1259](https://github.com/withastro/starlight/discussions/1259) — Starlight's stance: third-party plugin recommended
- Cormack et al. 2009 "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods" — context for RRF k=60 being a standard constant

### Tertiary
*(none — no LOW-confidence findings in this research)*

---

## Metadata

**Confidence breakdown:**
- Retrieval Stack Parameter Table: **HIGH** — every row sourced from live Swift source code at exact file:line
- Head tag delta & Starlight API: **HIGH** — empirically verified via `grep` of current `dist/` HTML + direct reads of Starlight's `utils/head.ts`
- Sitemap posture: **HIGH** — `dist/sitemap-0.xml` inspected directly
- robots.txt DMG glob: **HIGH** — DMG URL pattern confirmed across 3 release entries + Hero.astro
- Diagram mechanism: **MEDIUM-HIGH** — npm version + peer deps verified; Starlight plugin immaturity claim is a judgment call backed by Phase 2.1 Plan 06 incident
- Voice anchors: **HIGH** — exact quotes from existing files

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (30 days — stable stack, no known upstream breaking changes pending)

---

*Phase: 03-content-depth-seo*
*Researched: 2026-04-22*

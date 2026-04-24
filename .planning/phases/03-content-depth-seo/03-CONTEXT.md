# Phase 3: Content Depth & SEO - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Two closely-related deliverables on a single milestone phase:

1. **Content depth (CONT-01):** A technical reader can evaluate Covalence's retrieval stack — embedding model, asymmetric search, Matryoshka truncation, hybrid search, and recency weighting — without leaving the site.
2. **SEO + social sharing (SEO-01..04):** Every public page is cleanly indexable and shareable — `/robots.txt` exists and points at the sitemap, `/sitemap-index.xml` covers every public route, every page emits `<link rel="canonical">`, and at minimum the home page and docs root render a complete OG + Twitter card.

**In scope:**
- A new `/docs/under-the-hood` Starlight page with the full five-topic retrieval-stack explainer (prose + one diagram + concrete numbers sourced from the main Covalence app repo).
- A refreshed `Architecture.astro` on `/` that serves as a 2–3 paragraph teaser and links into the new docs page.
- `public/robots.txt` (new file) with `Allow: /`, a `Sitemap:` reference, and a `Disallow: /releases/*.dmg` directive for the worker-proxied DMG routes.
- Verification that `@astrojs/sitemap` auto-coverage includes `/`, `/releases/`, `/docs/*`, `/posts/` (and `/posts/*` once any post ships). Sitemap config only touched if a URL is missing or a non-public URL appears.
- Mirror of the site-wide SEO head set — `<link rel="canonical">`, `og:*` (type/title/description/url/image), `twitter:*` — into `starlight({ head: [...] })` in `astro.config.mjs` so Starlight `/docs/*` routes get parity with Base.astro-rendered routes.
- No new OG images — `public/og-image.png` remains the single site-wide image. Per-page differentiation (title/description) is sufficient.

**Out of scope for this phase (deferred to future work or permanent):**
- Per-surface or per-page auto-generated OG images.
- JSON-LD `Article` / structured data on blog posts or release entries.
- RSS feed richness (IN-05: `<atom:updated>` per item, `<enclosure>` for `og_image`).
- RSS `<link>` absolutisation (IN-06: stylistic inconsistency only; output is already spec-compliant via @astrojs/rss).
- Design-system extraction or any refactor beyond the mechanical head-config mirror.
- Accessibility pass on the new `/docs/under-the-hood` content — that's Phase 4's domain.

</domain>

<decisions>
## Implementation Decisions

### Content placement (CONT-01)
- **D-01:** The full five-topic depth lives on a new Starlight page at `/docs/under-the-hood`, added to the sidebar under `src/content/docs/docs/under-the-hood.md`.
- **D-02:** `Architecture.astro` on `/` is rewritten into a 2–3 paragraph teaser that introduces the retrieval stack at a marketing-accessible altitude and links into `/docs/under-the-hood/` with an inline "Full technical deep-dive" CTA. Existing "Privacy by architecture" column is preserved.

### Content depth (CONT-01)
- **D-03:** The `/docs/under-the-hood` page uses **prose + one schematic diagram + concrete numbers**. Concrete values (embedding dimensions, Matryoshka truncation sizes, RRF parameters, recency half-life / weighting function) are non-optional — Success Criterion 1 says "at enough depth to decide whether the approach is credible", and plain prose alone doesn't clear that bar.
- **D-04:** The five topics are covered in this order so the diagram maps to the prose:
  1. Embedding model (what runs, what dimensions, on what hardware)
  2. Asymmetric search (query vs document encoder asymmetry, why it matters)
  3. Matryoshka truncation (dimension schedule, trade-offs)
  4. Hybrid search (vector + keyword via Reciprocal Rank Fusion; current `Architecture.astro` already name-drops this)
  5. Recency weighting (weighting function or half-life; how it composes with the fused score)
- **D-05:** **Source of concrete numbers is the main Covalence app repo** (`../covalence/`). The phase researcher MUST scout `../covalence/` for the retrieval-stack implementation — likely in Swift source under app-repo `Sources/` (retrieval/search files) and/or documented in app-repo `.planning/`. If a value can't be sourced, the page notes it qualitatively rather than fabricating a number. This is a **hard research dependency** — the planner cannot author accurate copy without these numbers.

### robots.txt (SEO-01)
- **D-06:** `public/robots.txt` (new) contains three directives:
  ```
  User-agent: *
  Allow: /
  Disallow: /releases/*.dmg
  Sitemap: https://covalence.app/sitemap-index.xml
  ```
  Rationale: allow-all default aligns with the site's open/public stance (this is a tool that gives AI memory — blocking AI crawlers would be philosophically inconsistent). The DMG exclusion keeps crawler budget off the worker-proxied download route. Sitemap reference satisfies SEO-01's "points crawlers at the sitemap URL" clause.
- **D-07:** No blanket AI-crawler blocks (GPTBot / Claude-Web / CCBot / Google-Extended). Explicitly rejected.

### Sitemap (SEO-02)
- **D-08:** `@astrojs/sitemap` already auto-generates `dist/sitemap-index.xml` + `sitemap-0.xml` on the current config. Plan verifies coverage in `dist/sitemap-0.xml` includes `/`, `/releases/`, `/docs/*` (every Starlight page), and `/posts/` (index) at minimum.
- **D-09:** **No sitemap config changes unless verification surfaces a gap.** Only touch `astro.config.mjs` `@astrojs/sitemap` options if a URL is missing (needs inclusion) or a non-public URL is leaking (needs a filter). Prefer absence of config.

### Canonical URLs (SEO-03)
- **D-10:** `Base.astro` already emits `<link rel="canonical">` using `new URL(Astro.url.pathname, Astro.site)` — no change on marketing/posts/releases routes.
- **D-11:** Starlight `/docs/*` routes are patched via `starlight({ head: [...] })` in `astro.config.mjs` to emit the same canonical tag. Uses the same `Astro.site`-based construction (per the 02.1-03 decision: "never `Astro.url.pathname` alone — always `new URL(path, Astro.site)`").

### OG + Twitter metadata (SEO-04)
- **D-12:** `Base.astro`'s full OG + Twitter head block (og:type=website, og:title, og:description, og:url, og:image + width/height, twitter:card=summary_large_image, twitter:title/description/image) is mirrored into `starlight({ head: [...] })`. Per-page values use Starlight's frontmatter (title/description) resolved at render time. This is the same pattern Plan 02.1-04 used for the single RSS `<link rel="alternate">` tag — scaled to the full metadata set.
- **D-13:** `public/og-image.png` (1200×627) stays as the single site-wide OG image. Differentiated per-surface images are deferred.
- **D-14:** Success Criterion 5 (OG renders for home + docs root) is verified by visiting the built `dist/index.html` and `dist/docs/index.html` and inspecting `<meta>` tags. Social-card debugger check on the deployed CF Pages preview is the final acceptance gate.

### Phase 2.1 follow-ups (deferred, not folded)
- **D-15:** IN-05 (RSS feed richness: `<atom:updated>`, per-post `og_image` enclosure) **deferred**. Collection is empty today; feed richness is polish on a feed with no subscribers. Revisit when cadence warrants.
- **D-16:** IN-06 (RSS `<link>` absolutisation) **deferred**. Output is already spec-compliant via `@astrojs/rss` auto-absolutisation. Pure stylistic inconsistency; fold only if/when a future phase adopts an "always-absolute" rule for structured data.

### Claude's Discretion
- Exact Swift file paths in `../covalence/` that the researcher scouts for retrieval-stack numbers — researcher picks what to read.
- Mermaid vs inline SVG vs plain image for the one schematic diagram on `/docs/under-the-hood`. Constraint: Starlight's Expressive Code owns code blocks; the diagram mechanism should not conflict. Mermaid via a Starlight-compatible approach is likely the cleanest; researcher/planner decide.
- Exact wording of the home-page teaser CTA link (e.g. "Read the technical deep-dive" vs "How it actually works"). Must match the site's voice from 02.1 CONTEXT (short bursts, no ceremony, no superlatives, British spelling).
- Whether the Starlight `head: [...]` mirror is hand-authored as a literal array or computed from a helper (e.g. iterating a shared object). 02.1-04 flagged "today's one tag doesn't justify a shared head-config module" — with ~8 tags now, this is the revisit point; planner decides if it warrants a module.
- Whether `Disallow: /releases/*.dmg` uses that exact glob or a tighter pattern (e.g. `Disallow: /releases/Covalence-`). Planner can narrow once the DMG URL shape is re-confirmed from `src/pages/releases.astro`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — project mission, cross-repo contract with main Covalence app repo.
- `.planning/REQUIREMENTS.md` §CONT-01 + §SEO-01..04 — literal acceptance clauses.
- `.planning/ROADMAP.md` — Phase 3 goal, dependencies, 5 Success Criteria.
- `.planning/STATE.md` — current state after Phase 2.1 merge + 2026-04-22 cleanups.
- `CLAUDE.md` — project instructions (Astro `^6.1.6` / Starlight `^0.38.3`, 2-space indent, single-quote JS / double-quote HTML, no Prettier/ESLint, PascalCase components, kebab-case docs, snake_case JSON keys).

### Codebase intel
- `.planning/codebase/STACK.md` — tech stack (Astro `^6.1.6`, Starlight `^0.38.3`, Node `22.16.0`, npm, CF Pages, hand-authored CSS).
- `.planning/codebase/ARCHITECTURE.md` — dual-mode build (marketing at `/`, Starlight at `/docs/*`), build-time data pipeline.
- `.planning/codebase/CONVENTIONS.md` — file naming, component conventions, no preprocessor.
- `.planning/codebase/INTEGRATIONS.md` — cross-repo contract with the app repo (dispatch payload D-09..D-14); relevant if Phase 3 touches the ingestion surface (it should NOT — SEO only).

### Closest analogs in the current codebase
- `src/layouts/Base.astro` — **the SEO head reference implementation**. Contains the canonical + OG + Twitter head block that Phase 3 mirrors into Starlight. Mirror precisely; don't re-derive.
- `src/components/Architecture.astro` — current "Under the hood" section. Phase 3 rewrites the `arch-stack` column into a prose teaser + deep-docs CTA; preserves the `arch-privacy` column unchanged.
- `src/components/Hero.astro` / `Features.astro` / `HowItWorks.astro` — voice and typography reference for the Architecture.astro teaser copy.
- `src/content/docs/docs/getting-started.md` — pattern for a Starlight doc file (frontmatter + markdown, no MDX, no JSX). `/docs/under-the-hood` follows the same shape. Remember: Starlight's bundled Expressive Code owns fenced code blocks.
- `astro.config.mjs` — where the `starlight({ head: [...] })` mirror lands. Pre-existing single-tag `<link rel="alternate">` head entry (from Plan 02.1-04) is the structural template; Phase 3 expands it to the full metadata set.
- `src/pages/posts/[...slug].astro:24-45` — reference pattern for per-page canonical + per-page OG (even though posts are out of this phase's direct scope, they model the right shape).
- `src/pages/releases.astro` — verify its DMG download URL shape so the `robots.txt` `Disallow:` pattern matches exactly.
- `public/og-image.png` (1200×627) + `public/og-image.svg` — the single site-wide OG image; unchanged by this phase.

### Phase 2.1 artifacts (recent prior-phase context)
- `.planning/phases/2.1-blog/02.1-CONTEXT.md` — explicitly defers sitemap/robots/canonical to Phase 3 (see `<deferred>` section, final line). Phase 3 closes that deferral.
- `.planning/phases/2.1-blog/02.1-REVIEW.md` §IN-05, §IN-06 — advisory items flagged "push to Phase 3's SEO sweep if that's already the staged owner of per-post structured data / feed richness". Decision recorded above as D-15 / D-16 (defer both, document rationale).
- `.planning/phases/2.1-blog/02.1-SUMMARY.md` (Plan 04 subsection, decision 02.1-04) — "Base.astro head tags do NOT reach Starlight's /docs/* routes — any site-wide head tag must be mirrored in `starlight({ head: [...] })`". This is the load-bearing discovery that shapes D-11 / D-12.

### External / cross-repo (MUST scout for CONT-01 numbers)
- **Main Covalence app repo** at `../covalence/` (sibling directory) — authoritative source of retrieval-stack implementation details. Researcher scouts:
  - `../covalence/.planning/` for any DECISIONS / DESIGN / ADR docs covering embedding model, Matryoshka schedule, RRF params, recency weighting.
  - `../covalence/Sources/**` (or wherever Swift retrieval code lives) for concrete dimension/parameter values in code comments or constant declarations.
  - If `../covalence/` is not accessible during planning, flag as a blocker; researcher should NOT fabricate numbers.

### External docs
- `@astrojs/sitemap` docs — config options (`filter`, `customPages`, `serialize`) for the "only-if-needed" path in D-09.
- Starlight `head` config docs — `starlight({ head: [{ tag, attrs, content }] })` syntax for D-11 / D-12.
- Mermaid-in-Starlight integration docs (if planner picks Mermaid for the D-03 diagram).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`Base.astro` head block** — full canonical + OG + Twitter set already authored (lines 11, 23, 29-41). Phase 3 work is to port this into Starlight, not rewrite it.
- **`Architecture.astro` `arch-privacy` column** — unchanged. Only the `arch-stack` column is rewritten.
- **`public/og-image.png`** — 1200×627 OG image exists; reused everywhere.
- **Starlight `head: [...]` slot in `astro.config.mjs`** — Plan 02.1-04 already wired one `<link rel="alternate">` tag here. Phase 3 extends this array with canonical + OG + Twitter tags.
- **`@astrojs/sitemap` integration** — already emitting `dist/sitemap-index.xml` + `sitemap-0.xml`. No new dependency.

### Established Patterns
- **Head tags that must cover both Base.astro and Starlight must live in two places** — Base.astro for marketing/releases/posts, `starlight({ head: [...] })` for `/docs/*`. Confirmed invariant from 02.1-04.
- **Canonical URLs use `new URL(path, Astro.site)` — never `Astro.url.pathname` alone** (02.1-03). Applies equally to Phase 3's canonical emission on Starlight.
- **New docs pages land in `src/content/docs/docs/` (nested-docs pattern)**, not `src/content/docs/` — matches the existing six Starlight pages (`getting-started.md`, `spaces.md`, etc.).
- **Fenced code blocks in .md files MUST start at column 1** (02.1-07 landmine). Applies to the new `/docs/under-the-hood` page if it contains any code-like snippets.
- **Starlight sidebar entries are manually listed in `astro.config.mjs` `sidebar: [...]`** — adding `/docs/under-the-hood` requires an entry there too.

### Integration Points
- `astro.config.mjs` `starlight({ head: [...], sidebar: [...] })` — both arrays extended in this phase.
- `src/components/Architecture.astro` — `arch-stack` column rewritten to prose teaser + CTA.
- `src/content/docs/docs/under-the-hood.md` — new file; frontmatter + markdown prose + one diagram.
- `public/robots.txt` — new file; three directives.

</code_context>

<specifics>
## Specific Ideas

### Diagram direction
The D-03 schematic diagram should show the retrieval pipeline linearly:
`[Query] → [Embedding encoder] → [Matryoshka truncation]` then the fused search path `[Vector search] + [FTS5 keyword search] → [RRF merge] → [Recency weighting] → [Results]`. The five CONT-01 topics map 1:1 to stations on that line.

### Teaser copy tone
Home-page teaser must match the voice locked in 02.1 CONTEXT: British spelling, short bursts, no ceremony, allergic to superlatives. One concrete model for length: each of the existing `Architecture.astro` `arch-privacy` column paragraphs ≈ the right length for the teaser paragraphs that replace the `arch-stack` bullets.

### Files expected

**Created:**
- `public/robots.txt`
- `src/content/docs/docs/under-the-hood.md`

**Edited:**
- `astro.config.mjs` — extend `starlight({ head: [...] })` with canonical + OG + Twitter; add sidebar entry for Under the hood; optionally add `@astrojs/sitemap` filter/serialize config (only if verification surfaces a gap).
- `src/components/Architecture.astro` — rewrite `arch-stack` column (2–3 paragraph teaser + CTA to `/docs/under-the-hood/`); leave `arch-privacy` column and styles unchanged.

**Unchanged (verified only):**
- `src/layouts/Base.astro` — already emits canonical + OG + Twitter; no change.
- `src/pages/posts/[...slug].astro` — already emits per-post canonical + OG; no change.
- `public/og-image.png` / `public/og-image.svg` — single site-wide image; no change.
- `@astrojs/sitemap` default coverage — verified, not reconfigured, unless a gap is found.

### Verification approach
Consistent with the project's "v1 acceptance = build passes + manual verification" rule:
1. `npm run build` exits 0; `dist/robots.txt`, `dist/sitemap-index.xml`, `dist/docs/under-the-hood/index.html` all present.
2. Grep verification: `<link rel="canonical">` appears in `dist/index.html`, `dist/docs/index.html`, `dist/docs/under-the-hood/index.html`, `dist/releases/index.html`, `dist/posts/index.html`.
3. Grep verification: `<meta property="og:image">` appears on all of the above.
4. `dist/robots.txt` contains the three expected directives, nothing else.
5. `dist/sitemap-0.xml` lists `/`, `/releases/`, each `/docs/*`, `/posts/`.
6. CF Pages preview: visit `/docs/under-the-hood/` and confirm the page renders with the diagram + five topics; paste the preview URL into a social-card debugger and confirm a populated OG card.

</specifics>

<deferred>
## Deferred Ideas

### Explicitly out of scope this phase
- **Per-surface or per-page OG images.** Single image for v1 (D-13). Revisit if a specific surface's share looks visually wrong.
- **JSON-LD / structured data** (Article schema on posts, SoftwareApplication on releases, FAQ on docs). Carried forward from 02.1 CONTEXT's deferred list. Would slot cleanly into a future "SEO-02" or "Rich results" phase.
- **RSS feed richness (IN-05).** See D-15 for rationale.
- **RSS `<link>` absolutisation (IN-06).** See D-16 for rationale.
- **Accessibility audit of the new content.** The new `/docs/under-the-hood` page inherits Starlight's a11y; custom diagram requires a11y attention (alt text / `<title>` / `<desc>`). Phase 4 owns the full a11y sweep — Phase 3 just needs to not introduce obvious regressions (meaningful alt text on the diagram at minimum).

### Reviewed but not folded
- **Blanket AI-crawler blocks in robots.txt** (GPTBot, Claude-Web, CCBot, Google-Extended). Rejected (D-07). The site's entire pitch is open, public content about giving AI memory — blocking AI crawlers would be philosophically inconsistent.
- **Hand-rolled sitemap.** Rejected. `@astrojs/sitemap` already works; writing `sitemap.xml.ts` manually is overkill for a site this size.
- **Extract shared head config into a TypeScript module** consumed by both Base.astro and `starlight({ head })`. Deferred to "if a future phase adds more head metadata that needs a single source of truth". For Phase 3, mirror literally into `astro.config.mjs`.

</deferred>

---

*Phase: 03-content-depth-seo*
*Context gathered: 2026-04-22*

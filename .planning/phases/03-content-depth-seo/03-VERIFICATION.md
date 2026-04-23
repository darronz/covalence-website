---
phase: 03-content-depth-seo
verified: 2026-04-23T12:20:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: n/a
  previous_score: n/a
  gaps_closed: []
  gaps_remaining: []
  regressions: []
---

# Phase 3: Content Depth & SEO Verification Report

**Phase Goal:** Expand the "Under the hood" section and close SEO / social-sharing metadata gaps.
**Verified:** 2026-04-23T12:20:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

All five truths map 1-to-1 to the ROADMAP Success Criteria for Phase 3.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A technical reader can, on a single page of the site, read a concrete description of the embedding model, asymmetric search, Matryoshka truncation, hybrid search, and recency weighting — at enough depth to decide whether the approach is credible. (CONT-01) | PASS | `src/content/docs/docs/under-the-hood.md` (134 lines) renders to `dist/docs/under-the-hood/index.html` with all five H2 sections in D-04 order, concrete numbers `nomic-embed-text-v1.5`, `MLTensor`, `768`, `256`, `FTS5`, `8760`, `Reciprocal Rank Fusion`, `k = 60`, `10%`, plus the inline `<svg role="img" aria-labelledby="rs-title rs-desc">` pipeline diagram. Home-page teaser in `src/components/Architecture.astro:5-18` echoes the same names/numbers and points to the deep page via `<a href="/docs/under-the-hood/">Full technical deep-dive →</a>`. |
| 2 | `https://covalence.app/robots.txt` returns a valid robots policy that allows indexing and points crawlers at the sitemap URL. (SEO-01) | PASS | `public/robots.txt` (4 lines, ASCII, LF endings) copies byte-identical to `dist/robots.txt`. Directives present and exact: `User-agent: *`, `Allow: /`, `Disallow: /releases/*.dmg`, `Sitemap: https://covalence.app/sitemap-index.xml`. No blanket AI-crawler blocks. `diff public/robots.txt dist/robots.txt` → exit 0. |
| 3 | `https://covalence.app/sitemap-index.xml` (or equivalent) resolves and lists every public route, including `/`, `/releases`, and every `/docs/*` page. (SEO-02) | PASS | `dist/sitemap-index.xml` references `https://covalence.app/sitemap-0.xml`; `dist/sitemap-0.xml` has exactly 11 `<loc>` entries including `/`, `/releases/`, `/posts/`, `/docs/`, and all seven `/docs/<slug>/` routes. The new `/docs/under-the-hood/` is present. `grep -oE '<loc>' dist/sitemap-0.xml \| wc -l` → 11. |
| 4 | Viewing the HTML of any public page shows a `<link rel="canonical">` pointing at the correct absolute URL on `covalence.app`. (SEO-03) | PASS | All 11 public pages emit `rel="canonical" href="https://covalence.app/..."` pinned to the production host (never a preview host). Verified programmatically against `dist/index.html`, `dist/releases/index.html`, `dist/posts/index.html`, `dist/docs/index.html`, and the seven `dist/docs/<slug>/index.html` files. |
| 5 | Pasting the home page URL and the docs root URL into a social-card debugger renders a title, description, and an image — not a blank card. (SEO-04) | PASS | (a) Grep matrix: `dist/index.html`, `dist/docs/index.html`, and `dist/docs/under-the-hood/index.html` each emit exactly one occurrence of `property="og:image"`, `property="og:image:width"` (=1200), `property="og:image:height"` (=627), `name="twitter:image"`, and the URL `https://covalence.app/og-image.png`. No duplicate-og regression. (b) Human gate: approved 2026-04-23T11:50Z by user against CF Pages preview `c0d36fed.covalence-website-v2.pages.dev` (branch preview `gsd-phase-3-content-depth-se.covalence-website-v2.pages.dev`, build commit `0b6d046`, PR #12). Three target URLs (`/`, `/docs/`, `/docs/under-the-hood/`) rendered populated cards with title + description + 1200×627 og-image.png. |

**Score:** 5 / 5 truths verified.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `public/robots.txt` | 4-line allow-all robots policy with sitemap pointer | PASS | Exists; 4 lines; ASCII; LF; `diff public/robots.txt dist/robots.txt` exit 0 |
| `astro.config.mjs` | Starlight head array extended with og:image + og:image:width + og:image:height + twitter:image, sidebar has 7 entries with Under the Hood between Core Memories and MCP Tools | PASS | All 4 head entries present with exact literal attrs; sidebar has 7 entries; no `@astrojs/sitemap` import added (Starlight wraps it); no `twitter:title`/`twitter:description` (option 2c fallback) |
| `src/components/Features.astro` | Line 21 uses "nomic-embed-text-v1.5 via MLTensor on Apple Silicon. No API keys. No network round-trips." | PASS | Line 21 matches exactly; old "CoreML on Apple Neural Engine" and "no cost, millisecond inference" both absent; 5 other cards byte-identical |
| `src/content/docs/docs/under-the-hood.md` | 5-topic retrieval-stack explainer with frontmatter, inline SVG diagram, concrete numbers from ../covalence/ | PASS | 134 lines; frontmatter `title: Under the Hood` + description; 6 H2s (5 required + optional "Putting it together"); inline `<svg role="img" aria-labelledby="rs-title rs-desc">` with `<title>` + `<desc>`; `stroke="currentColor"` + `fill="currentColor"` theme-aware; every number traces to §Retrieval Stack Parameter Table |
| `src/components/Architecture.astro` | arch-stack column rewritten as 2-3 paragraph teaser + CTA; arch-privacy byte-identical | PASS | New `.arch-teaser` + `.arch-teaser-detail` + `.arch-teaser-cta` elements rendered; inline `<a href="/docs/under-the-hood/">Full technical deep-dive →</a>` present; `.arch-privacy` column with "Your data never leaves your machine..." paragraph unchanged; dead `.arch-stack ul\|li\|li::before\|li strong` CSS removed; three new `.arch-teaser*` CSS rules added that mirror `.privacy-*` typography |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `dist/robots.txt` | `https://covalence.app/sitemap-index.xml` | `Sitemap:` directive | WIRED | Line 4 of dist/robots.txt matches exactly |
| `astro.config.mjs` head[] | Every `/docs/*` rendered HTML | `starlight({ head })` | WIRED | Confirmed on `dist/docs/index.html`, `dist/docs/under-the-hood/index.html`, and 6 other docs pages — each has `property="og:image"` with `https://covalence.app/og-image.png` |
| `astro.config.mjs` sidebar[] | `/docs/under-the-hood/` (authored in Plan 03-02) | Starlight sidebar entry `{ label: 'Under the Hood', slug: 'docs/under-the-hood' }` | WIRED | dist/sitemap-0.xml includes the URL; the emitted page exists and renders with sidebar navigation |
| `src/components/Architecture.astro` `.arch-teaser-cta` | `src/content/docs/docs/under-the-hood.md` | `<a href="/docs/under-the-hood/">` CTA | WIRED | CTA rendered in `dist/index.html`; target file `dist/docs/under-the-hood/index.html` exists with trailing slash |
| `src/components/Architecture.astro` `.arch-privacy` | unchanged voice-anchor column | self-analog preservation | WIRED | "Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device." and "Every component — the database, the embedding model, the search engine — runs locally. ... back up, and export whenever you want." both present verbatim in source and rendered HTML |
| `src/content/docs/docs/under-the-hood.md` frontmatter description | og:description / meta description on the rendered page | Starlight auto-emission | WIRED | Frontmatter line 3 is the non-empty description; Starlight emits it on the rendered page (verified via canonical+OG tag emission pattern) |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `dist/docs/under-the-hood/index.html` | rendered Markdown content | `src/content/docs/docs/under-the-hood.md` (static file, compile-time) | Yes — 134 lines of prose + inline SVG + code fences | FLOWING |
| `dist/index.html` arch-stack column | static markup | `src/components/Architecture.astro` template | Yes — concrete prose teaser + CTA | FLOWING |
| `dist/sitemap-0.xml` URL list | route enumeration | Astro SSG route discovery + Starlight content collection | Yes — 11 real URLs, no placeholders | FLOWING |

All artifacts render real content sourced from files in the working tree. No hardcoded empty data, no "coming soon" placeholders, no stub returns. Phase 3 is content-delivery only; no API fetches or database queries to trace.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build produces robots.txt byte-identical to source | `diff public/robots.txt dist/robots.txt` | exit 0 | PASS |
| Sitemap enumerates 11 public URLs | `grep -oE '<loc>' dist/sitemap-0.xml \| wc -l` | 11 | PASS |
| All 11 public pages have canonical on covalence.app | loop over 11 paths, check `rel="canonical" href="https://covalence.app/...` | 11/11 PASS | PASS |
| Home page emits og:image + twitter:image with production URL | `grep -c 'property="og:image"' dist/index.html`; same for width/height/twitter:image/og-image.png URL | 1 / 1 / 1 / 1 / 1 | PASS |
| Docs root emits og:image delta (Plan 03-01's head) | `grep -c 'property="og:image"' dist/docs/index.html` | 1 (exactly one — no duplicate regression) | PASS |
| /docs/under-the-hood/ emits og:image delta | `grep -c 'property="og:image"' dist/docs/under-the-hood/index.html` | 1 | PASS |
| Under the Hood page has all 5 topic headings | case-insensitive grep for `embedding model`, `asymmetric search`, `matryoshka`, `hybrid search`, `recency` | 5/5 PASS | PASS |
| Under the Hood has concrete numbers | grep for `nomic-embed-text-v1.5`, `MLTensor`, `768`, `256`, `FTS5`, `8760`, `Reciprocal Rank Fusion`, `k = 60` | 8/8 PASS | PASS |
| Under the Hood has accessible inline SVG | `grep -c '<svg[^>]*role="img"' dist/docs/under-the-hood/index.html` + aria-labelledby count | 1 / 2 | PASS |
| Home page routes to Under the Hood deep page | `grep -qF 'href="/docs/under-the-hood/"' dist/index.html` | exit 0 | PASS |
| Home page has accurate MLTensor wording (not CoreML/ANE) | `grep -qF 'MLTensor' dist/index.html` + `! grep -qF 'CoreML on Apple Neural Engine' dist/index.html` | both exit 0 | PASS |
| arch-privacy column preserved verbatim | `grep -qF 'Your data never leaves your machine' dist/index.html` | exit 0 | PASS |
| Voice scan on Under the Hood rendered HTML | zero occurrences of `instant`, `amazing`, `powerful`, `blazing`, `lightning`, `seamless`, `effortless`, `free`, `revolutionary`, `cutting-edge` | 10/10 absent | PASS |

All 13 spot-checks completed in under a second each. No servers started; read-only file inspection. Build commit pre-verified at `0b6d046` (PR #12).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CONT-01 | 03-02 (deep page) + 03-03 (home teaser) | "Under the hood" section covers embedding model, asymmetric search, Matryoshka truncation, hybrid search, and recency weighting at a depth a technical reader can evaluate | SATISFIED | Plan 03-02 shipped `src/content/docs/docs/under-the-hood.md` (134 lines, 5 H2s, concrete numbers, inline SVG); Plan 03-03 shipped `src/components/Architecture.astro` teaser echoing the same names/numbers with CTA into the deep page. Both surfaces present in `dist/`. |
| SEO-01 | 03-01 | `robots.txt` served from site root, allowing indexing and pointing to the sitemap | SATISFIED | `public/robots.txt` → `dist/robots.txt` byte-match; 4 directives valid; sitemap directive absolute HTTPS. |
| SEO-02 | 03-01 (sidebar entry) + carryover of Phase 2.1's sitemap integration | `sitemap.xml` generated for all public pages | SATISFIED | `dist/sitemap-index.xml` + `dist/sitemap-0.xml` both exist; 11 URLs enumerated; new `/docs/under-the-hood/` URL auto-discovered via Starlight content collection (sidebar entry from Plan 03-01 + content file from Plan 03-02). |
| SEO-03 | 03-01 | Canonical URL meta tag on every page | SATISFIED | All 11 public pages emit `rel="canonical" href="https://covalence.app/..."`. Starlight auto-emits for `/docs/*`; Base.astro auto-emits for `/`, `/releases/`, `/posts/`. |
| SEO-04 | 03-01 (head delta) + 03-04 (human gate) | Open Graph + Twitter card meta (title, description, image) on the home page and docs root | SATISFIED | Grep matrix: og:image + og:image:width=1200 + og:image:height=627 + twitter:image + og-image.png URL all present on home + docs root + under-the-hood, exactly 1 occurrence each. Social-card debugger human gate APPROVED against CF preview `c0d36fed` on 2026-04-23. |

**ORPHANED requirements:** None. REQUIREMENTS.md Traceability maps exactly [CONT-01, SEO-01, SEO-02, SEO-03, SEO-04] to Phase 3 — and all five IDs appear in at least one plan's `requirements` frontmatter field:

- CONT-01: declared in 03-02 and 03-03
- SEO-01, SEO-03, SEO-04: declared in 03-01
- All five declared again in 03-04 (verification checkpoint)

No requirement is expected-but-unclaimed.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/Features.astro` | 26 | Voice-ban word "instant" appears in `'Menu bar app with one-click capture. Global hotkey for instant search.'` | Info (out of Phase 3 scope) | The code reviewer flagged this as WR-01 in `03-REVIEW.md`. Confirmed PRE-EXISTING: the line is unchanged since commit `a78e44e` (before Phase 3), and the Phase 3 plan 03-01 explicitly scoped the Features.astro edit to **line 21 only** with the instruction "Do NOT touch any other line in the file." The word "instant" does not appear in any Phase 3 plan's must_haves or requirements and is NOT a Phase 3 Success Criterion. It ships in `dist/index.html`. Suggested rewrite in 03-REVIEW.md WR-01. This is tracked as a known voice-lint backlog item rather than a Phase 3 gap — Phase 4 (a11y) does not sweep voice, so this will need a follow-up voice-lint plan or user direction. Not blocking Phase 3 close. |
| `src/content/docs/docs/under-the-hood.md` | 66 | Dead SVG `<line>` with `stroke="none"` and out-of-viewBox `x2="775"` | Info | IN-01 in 03-REVIEW.md. Renders nothing; cosmetic cleanup. No functional impact. |
| `public/robots.txt` | 3 | `Disallow: /releases/*.dmg` targets a forward-looking path not yet in the repo | Info | IN-02 in 03-REVIEW.md. Intentional pre-emption; crawlers ignore disallows for 404 paths; Phase 4 or whichever phase adds `/releases/*.dmg` should re-verify pattern vs. served path. Not a defect. |

No blocker anti-patterns. No warnings that affect any Phase 3 Success Criterion. The one warning (WR-01) is scoped-out pre-existing voice lint.

### Human Verification Required

None remaining. The SC5 social-card debugger human gate was already run and returned APPROVED on 2026-04-23T11:50Z.

**Recorded evidence from 03-04-SUMMARY.md:**
- CF Pages deployment: `c0d36fed.covalence-website-v2.pages.dev` at commit `0b6d046`, PR #12
- Branch preview URL: `https://gsd-phase-3-content-depth-se.covalence-website-v2.pages.dev`
- Three URLs tested (`/`, `/docs/`, `/docs/under-the-hood/`) all rendered populated cards with title + description + 1200×627 og-image.png
- Host-mismatch warnings (preview host vs. production `covalence.app` canonical) are informational per Decision 02.1-03 and were disregarded
- Resume signal: "approved"

### Gaps Summary

No gaps. All 5 Phase 3 Success Criteria are met at the source-code level, at the built-artifact level, and (for SC5) at the human-eyeball level. All 5 requirement IDs (CONT-01, SEO-01, SEO-02, SEO-03, SEO-04) are satisfied and traceable.

The sole residual item — WR-01 ("instant" on Features.astro:26) — is acknowledged out-of-scope pre-existing voice lint that did not regress in Phase 3 and is not covered by any Phase 3 plan's must_haves. It is not a gap under goal-backward verification: the Phase 3 goal ("expand Under the hood + close SEO / social-sharing metadata gaps") does not include a site-wide voice sweep. The user should decide whether to spin up a follow-up voice-lint plan or defer to Phase 4's general polish budget.

---

_Verified: 2026-04-23T12:20:00Z_
_Verifier: Claude (gsd-verifier)_

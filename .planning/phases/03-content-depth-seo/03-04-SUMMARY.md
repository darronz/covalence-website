---
plan_id: 03-04
phase: 03-content-depth-seo
plan: 04
title: Phase 3 verification checkpoint — consolidated build + grep matrix + social-card debugger gate
status: partial
requirements: [CONT-01, SEO-01, SEO-02, SEO-03, SEO-04]
started: "2026-04-23T07:20:00Z"
updated: "2026-04-23T07:21:08Z"
build_commit: 83bba68
---

# 03-04 Summary — Phase 3 Verification Checkpoint (Task 1 of 2 complete)

## PASS/FAIL Matrix

| Success Criterion | Status | Verified via |
|-------------------|--------|---------------|
| SC1 — CONT-01 (Under the Hood depth) | **PASS** | Step 6 grep matrix on `dist/docs/under-the-hood/index.html` — all 5 topics, all concrete numbers (nomic-embed-text-v1.5, MLTensor, 768, 256, FTS5, 8760, RRF, k=60), diagram present (inline `<svg role="img">`), zero banned adjectives; home-page sweep confirms MLTensor, CTA `href="/docs/under-the-hood/"`, `Your data never leaves your machine`, and no `CoreML on Apple Neural Engine` regression |
| SC2 — SEO-01 (robots.txt) | **PASS** | Step 2: `dist/robots.txt` byte-matches `public/robots.txt`; 4 lines exactly; all 4 directives present (`User-agent: *`, `Allow: /`, `Disallow: /releases/*.dmg`, `Sitemap: https://covalence.app/sitemap-index.xml`); zero AI-crawler blocks leaked |
| SC3 — SEO-02 (sitemap coverage) | **PASS** | Step 3: both `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist; index has 1 `<loc>`; sitemap-0.xml contains **all 11 expected URLs** including the new `/docs/under-the-hood/`; zero non-public leaks (no draft/admin/api/test URLs); total `<loc>` count = 11 |
| SC4 — SEO-03 (canonical URLs) | **PASS** | Step 4: all 11 public HTML pages exist; each emits `rel="canonical"` pinned to `https://covalence.app/...` (never preview host) |
| SC5 — SEO-04 (OG + Twitter grep matrix) | **PASS** on grep matrix; **AWAITING** social-card debugger (Task 2) | Step 5: `og:image`, `og:image:width`, `og:image:height`, `twitter:image` + `https://covalence.app/og-image.png` URL all present on `dist/index.html`, `dist/docs/index.html`, and `dist/docs/under-the-hood/index.html`; exactly 1 `og:image` on `/docs/` (no Starlight auto + user-supplied duplicate regression) |

## Build Details

- Fresh build: `rm -rf dist/ && npm run build` exited 0
- 12 pages built, pagefind search index generated, sitemap-index.xml written
- Build commit: `83bba68` (merge commit containing all of Plans 03-01, 03-02, 03-03)

## Deviations (Rule 1 — verification-pattern issues caught)

| Step | Plan pattern | Issue | Workaround applied |
|------|-------------|-------|--------------------|
| Step 3 | `[ "$(grep -c '<loc>' dist/sitemap-0.xml)" -ge 11 ]` | `dist/sitemap-0.xml` is minified to 0 newlines; `grep -c` reports the **line count** of matching lines (1), not the **occurrence count** (11). Same class as the STATE.md 02.1-04/02.1-08 decision: *use `grep -oE pattern file \| wc -l`, NOT `grep -c`, when counting occurrences in minified output.* | Re-ran with `grep -oE '<loc>' dist/sitemap-0.xml \| wc -l` → 11 ✓ |
| Step 5 (dup og:image) | `grep -oE 'property="og:image"' dist/docs/index.html \| wc -l` | Plan's pattern is already the correct `grep -oE` idiom — no fix needed here; noted alongside Step 3 for consistency | n/a |

Neither deviation reflects a source-code bug; both are artifact-shape issues in the verification pattern that land correct with the `grep -oE` idiom. Captured so future Phase 3-style verification plans use the same pattern.

## Task 2 — Social-Card Debugger Human Gate (AWAITING)

Task 1's build-time grep matrix confirms all five Success Criteria pass against `dist/`. The only remaining acceptance gate is pasting the live CF Pages preview URL into a social-card debugger and eyeballing the rendered card for `/`, `/docs/`, and `/docs/under-the-hood/` — the one check no grep can substitute for.

**Awaiting from user:** A CF Pages preview URL for the current branch (or confirmation that the preview has deployed with these commits) + a pass/fail per card from one of:

- LinkedIn Post Inspector — https://www.linkedin.com/post-inspector/ (no login)
- Twitter/X Card Validator — https://cards-dev.twitter.com/validator (login)
- Meta Sharing Debugger — https://developers.facebook.com/tools/debug/ (Facebook login)
- Generic OG inspector — https://www.opengraph.xyz/

Expected: three populated cards (home / docs root / under-the-hood) with title + description + 1200×627 `og-image.png`. Host-mismatch warnings are informational per D-14 (Astro.site pins canonical/og:url to `https://covalence.app` regardless of preview host).

## Key Files

- **Read:** `dist/robots.txt`, `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, 11 `dist/**/*.html` canonical-bearing pages
- **Modified:** none (this plan is verification-only; no source files touched)
- **Created:** this SUMMARY

## Phase-Complete Signal

Task 1: **GREEN** on all 5 Success Criteria at the grep-matrix level.
Task 2: **AWAITING USER** — social-card debugger check against CF Pages preview.

Once Task 2 returns "approved", Phase 3 is complete and the orchestrator can proceed to code-review → verifier → roadmap update → PROJECT.md evolve → next-phase routing.

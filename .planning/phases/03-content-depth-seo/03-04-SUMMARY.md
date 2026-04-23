---
plan_id: 03-04
phase: 03-content-depth-seo
plan: 04
title: Phase 3 verification checkpoint — consolidated build + grep matrix + social-card debugger gate
status: complete
requirements: [CONT-01, SEO-01, SEO-02, SEO-03, SEO-04]
started: "2026-04-23T07:20:00Z"
updated: "2026-04-23T11:50:00Z"
build_commit: 0b6d046
cf_preview_commit: c0d36fed
pr_number: 12
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

## Task 2 — Social-Card Debugger Human Gate (APPROVED 2026-04-23)

Task 1's build-time grep matrix confirmed all five Success Criteria pass against `dist/`. Task 2 was the one check no grep can substitute for: pasting the live CF Pages preview into a social-card debugger and eyeballing the rendered card for `/`, `/docs/`, and `/docs/under-the-hood/`.

**CF Pages deployment:** `c0d36fed.covalence-website-v2.pages.dev` at commit `0b6d046` — CI build ✓ and CF Pages ✓ both green (PR #12).

**Branch preview URL:** https://gsd-phase-3-content-depth-se.covalence-website-v2.pages.dev

**Result: APPROVED by user (2026-04-23T11:50Z).** All three target URLs (`/`, `/docs/`, `/docs/under-the-hood/`) render populated social cards with title + description + the 1200×627 `og-image.png` against the chosen debugger. Host-mismatch warnings (preview host vs. `https://covalence.app` canonical/og:url) are informational per Decision 02.1-03 and were disregarded.

## Key Files

- **Read:** `dist/robots.txt`, `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, 11 `dist/**/*.html` canonical-bearing pages
- **Modified:** none (this plan is verification-only; no source files touched)
- **Created:** this SUMMARY

## Phase-Complete Signal

Task 1: **GREEN** on all 5 Success Criteria at the grep-matrix level (build commit `0b6d046`).
Task 2: **APPROVED** — three populated social cards on the CF Pages preview (`c0d36fed.covalence-website-v2.pages.dev`).

Phase 3 is **complete**. Orchestrator proceeding to code-review → verifier → roadmap/STATE update → PROJECT.md evolve → next-phase routing.

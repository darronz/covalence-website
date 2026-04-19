---
phase: 260419-wks-fix-broken-homepage-anchor-links-in-prim
plan: 01
subsystem: navigation
tags: [quick, nav, bugfix, anchors, static-site]
type: quick
requires: []
provides: ["primary-nav-cross-page-anchors"]
affects: ["src/components/Nav.astro"]
tech-stack:
  added: []
  patterns: ["absolute-anchor-hrefs"]
key-files:
  created: []
  modified:
    - src/components/Nav.astro
decisions:
  - "Use absolute homepage anchors (`/#id`) in primary nav so links resolve against the site root from any page (e.g. /releases/, /docs/*) rather than the current URL."
metrics:
  duration: "~2m"
  completed: 2026-04-19
---

# Quick Task 260419-wks: Fix Broken Homepage Anchor Links in Primary Nav Summary

Two-line href-prefix fix in `src/components/Nav.astro` so the "How It Works" and "Features" nav links are resolved against the site root on every page instead of the current URL, restoring cross-page navigation to the homepage anchor sections.

## What Changed

- `src/components/Nav.astro` line 10: `href="#how-it-works"` → `href="/#how-it-works"`
- `src/components/Nav.astro` line 11: `href="#features"` → `href="/#features"`

No other lines, classes, markup, or CSS were touched. The `/releases/`, `/docs/`, and DMG download links were already correct and were left alone.

## Why

In Astro's static output, a bare `href="#id"` is resolved by the browser against the **current** URL. On `/releases/` that produced `/releases/#features`, an anchor that does not exist on that page, so the click appeared broken. Prefixing with `/` forces resolution to the site root, which is where the `#how-it-works` and `#features` sections actually live (rendered by `src/pages/index.astro`).

Same-page behavior on `/` is preserved: the browser resolves `/#features` against the document's own URL when already at the root, so clicks still scroll to the local anchor as before.

## Verification

- Post-change grep for absolute form: `href="/#how-it-works"` and `href="/#features"` each appear exactly once in `Nav.astro` (lines 10-11).
- Post-change grep for bare anchors: `href="#how-it-works"` / `href="#features"` no longer appear in `Nav.astro`.
- `npm run build` completed cleanly: 10 pages built in 1.77s, no new warnings attributable to this change.
- Manual preview spot-check (per plan `<verify>` section) is a user step; build is the automated gate and passed.

## Deviations from Plan

None — plan executed exactly as written (pure two-character prepend on two lines).

## Commits

| Task | Name                                                     | Commit    | Files                    |
| ---- | -------------------------------------------------------- | --------- | ------------------------ |
| 1    | Make homepage anchor links absolute in Nav.astro         | `31f0452` | `src/components/Nav.astro` |

## Requirements Completed

- `QUICK-260419-wks` — Primary nav "How It Works" and "Features" links navigate to the homepage's corresponding sections from any page.

## Self-Check: PASSED

- FOUND: `src/components/Nav.astro` (modified, both absolute anchors present)
- FOUND: commit `31f0452` in `git log`
- FOUND: `npm run build` exit 0 with 10 pages generated

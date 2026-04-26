---
phase: 05-accessibility-pass
plan: 01
subsystem: ui
tags: [a11y, wcag, focus-visible, sr-only, skip-link, aria-label]

# Dependency graph
requires:
  - phase: 04-marketing-copy-rewrite
    provides: final v1 copy in Features.astro, Hero.astro, Footer.astro, Architecture.astro
provides:
  - sr-only utility class in global.css
  - ":focus-visible outline on all interactive elements"
  - skip-to-main link in Base.astro targeting main#main-content
  - role="img" + aria-label on all Features emoji tiles
  - verified SVG a11y across all custom components
affects: [05-02, 05-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "sr-only visually-hidden class in global.css for accessible content"
    - ":focus-visible (not :focus) for keyboard-only focus outlines"
    - "skip-link hidden with sr-only, revealed on :focus with fixed positioning"
    - "role=\"img\" + aria-label on decorative emoji spans"

key-files:
  created: []
  modified:
    - src/styles/global.css
    - src/layouts/Base.astro
    - src/pages/index.astro
    - src/pages/releases.astro
    - src/components/Features.astro

key-decisions:
  - "Used :focus-visible (not :focus) for interactive element outlines -- mouse clicks do not trigger outlines"
  - "Skip-link uses :focus (not :focus-visible) because the element is only reachable via keyboard -- distinction irrelevant, :focus ensures max browser compat"
  - "Emoji aria-label values describe the tile concept (e.g. 'data ownership') not the emoji character (e.g. 'lock')"

patterns-established:
  - "sr-only class: standard visually-hidden pattern from global.css"
  - ":focus-visible outline: 2px solid var(--accent-subtle) with 2px offset on all interactive elements"
  - "Skip link pattern: sr-only + skip-link class, revealed on focus with fixed positioning z-index 200"

requirements-completed: [A11Y-01, A11Y-02]

# Metrics
duration: 2min
completed: 2026-04-26
---

# Phase 5 Plan 1: CSS + HTML Accessibility Fixes Summary

**Skip-to-main link, :focus-visible keyboard outlines, and emoji aria-labels across all custom marketing components**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-26T08:42:15Z
- **Completed:** 2026-04-26T08:44:42Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Added sr-only utility class and :focus-visible outline styles covering a, button, input, select, textarea, [tabindex] in global.css
- Added skip-to-main link as first focusable element in Base.astro body, targeting main#main-content on both index.astro and releases.astro
- Added role="img" and descriptive aria-label to all 6 Features.astro emoji tiles
- Completed SVG a11y audit across Hero, Nav, Footer, NoticeBanner -- all SVGs already have either aria-hidden="true" or aria-label

## Task Commits

Each task was committed atomically:

1. **Task 1: Add sr-only utility class and :focus-visible styles to global.css** - `871659a` (feat)
2. **Task 2: Add skip-to-main link in Base.astro and id="main-content" on page main tags** - `a839ef5` (feat)
3. **Task 3: Add role="img" and aria-label to Features.astro emoji tiles and verify SVGs** - `1dcb855` (feat)

## Files Created/Modified
- `src/styles/global.css` - Added sr-only class and :focus-visible outline rules under new "Accessibility" section
- `src/layouts/Base.astro` - Added skip link as first body child + scoped skip-link:focus styles
- `src/pages/index.astro` - Added id="main-content" to main tag
- `src/pages/releases.astro` - Added id="main-content" to main tag
- `src/components/Features.astro` - Added aria field to each feature object + role="img" and aria-label on emoji spans

## Decisions Made
- Used :focus-visible (not :focus) for all interactive element outlines to avoid showing outlines on mouse click -- :focus-visible is the modern standard with excellent browser support
- Skip-link's own reveal uses :focus (not :focus-visible) because the element is only reachable via keyboard, so the distinction is irrelevant and :focus ensures maximum browser compatibility
- Emoji aria-label values describe the tile's concept (search, pinned memory, connected clients, on-device processing, always available, data ownership) rather than literal emoji character descriptions -- per D-06

## SVG Audit Results

All SVGs across custom components verified:

| Component | SVG | Attribute | Status |
|-----------|-----|-----------|--------|
| Hero.astro | Logo SVG | aria-label="Covalence logo" | OK (meaningful) |
| Hero.astro | Download icon SVG | aria-hidden="true" | OK (decorative) |
| Nav.astro | Logo SVG | aria-hidden="true" | OK (decorative, parent has text) |
| Nav.astro | Hamburger open SVG | aria-hidden="true" | OK (decorative, button has aria-label) |
| Nav.astro | Hamburger close SVG | aria-hidden="true" | OK (decorative, button has aria-label) |
| Footer.astro | Download icon SVG | aria-hidden="true" | OK (decorative, link has text) |
| NoticeBanner.astro | (no SVGs) | n/a | OK |

All interactive elements verified to have accessible names (visible text or aria-label).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 05-02 (contrast audit) can execute immediately -- this plan's changes are in different global.css sections (:root for 05-02, interactive selectors for 05-01)
- Plan 05-03 (consolidated a11y scan) depends on both 05-01 and 05-02

## Self-Check: PASSED

All files exist. All commits verified in git log. No missing items.

---
*Phase: 05-accessibility-pass*
*Completed: 2026-04-26*

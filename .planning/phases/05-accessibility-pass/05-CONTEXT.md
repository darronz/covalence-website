# Phase 5: Accessibility Pass - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Run an automated a11y audit + keyboard/focus verification on the site's custom (non-Starlight) marketing surfaces — `/` (home) and `/releases` — so brand-owned components meet WCAG AA. Starlight handles its own a11y for `/docs/*`; this phase does not touch those.

**In scope:** skip-to-main link, focus indicators on all interactive elements, accessible names for unlabelled controls, emoji tile a11y labelling, WCAG AA contrast verification, automated scanner integration.

**Out of scope (locked):** Starlight `/docs/*` pages, `/posts/*` pages, full manual screen-reader pass (v2 — A11Y-v2-01), design-system extraction, CSS restructuring beyond focus styles, new components, new pages.

</domain>

<decisions>
## Implementation Decisions

### A11y scanner tool (Area A)

- **D-01:** Use `@axe-core/cli` as the automated scanner, run against the built `dist/` output. axe-core is the industry standard, runs in Node without a browser, and can be integrated into CI later. Success criterion: zero critical or serious violations on `/` and `/releases`.
- **D-02:** Scan scope limited to `/index.html` and `/releases/index.html` in `dist/`. Starlight-owned `/docs/*` pages are explicitly excluded per ROADMAP notes.

### Focus indicator styling (Area B)

- **D-03:** Add `:focus-visible` styles to `src/styles/global.css` using `outline: 2px solid var(--accent-subtle)` with `outline-offset: 2px`. The `:focus-visible` pseudo-class avoids showing outlines on mouse click (only keyboard/programmatic focus). This is visible on the dark `--bg-primary` background.
- **D-04:** Do NOT use `:focus` (shows on mouse click too) or `box-shadow` (affects layout in some browsers). `:focus-visible` is the modern standard with excellent browser support.
- **D-05:** Apply to all interactive elements: `a`, `button`, `input`, `select`, `textarea`, `[tabindex]`. Use a single global rule, not per-component.

### Emoji tile accessibility (Area C)

- **D-06:** Each Features.astro tile emoji is wrapped in `<span role="img" aria-label="[description]">`. This ensures screen readers announce a meaningful label. The `aria-label` should be a brief description of the tile's concept (e.g., "memory sharing" for the multi-client tile, "search" for semantic search), not a literal description of the emoji character.
- **D-07:** Decorative SVGs already have `aria-hidden="true"` (Nav logo, Footer RSS icon). Verify all SVGs have either `aria-hidden="true"` (decorative) or `aria-label` / `<title>` (meaningful). No new SVGs are created.

### Skip-to-main link (Area D)

- **D-08:** Add a visually-hidden skip link as the first focusable element inside `<body>` in `src/layouts/Base.astro`. Target: `<main id="main-content">` (add `id` to existing `<main>` if not present).
- **D-09:** Skip link styling: visually hidden by default, becomes visible on `:focus`. Use the standard `sr-only` + `:focus:not(:sr-only)` pattern. Add the class to `src/styles/global.css`.
- **D-10:** The skip link only appears on Base.astro (marketing pages). Starlight has its own skip link for `/docs/*`.

### Interactive element labelling (Area E)

- **D-11:** Audit all `<a>` and `<button>` elements in custom components for accessible names. Links with visible text are fine. Icon-only or image-only elements need `aria-label`. Known items to check:
  - `Hero.astro` download CTA (has visible text — likely OK)
  - `Nav.astro` hamburger button (already has `aria-label="Open menu"` — OK)
  - `Footer.astro` links (all have visible text — likely OK)
  - `Architecture.astro` CTA link (has visible text — likely OK)

### Contrast verification (Area F)

- **D-12:** Verify WCAG AA contrast ratios for these pairings:
  - `--text-primary` (#e8e6ed) on `--bg-primary` (#08060d) — body text
  - `--accent` (#f0506a) on `--bg-primary` (#08060d) — CTA buttons
  - `--accent-subtle` (#a78bfa) on `--bg-primary` (#08060d) — links
  - Button text (#1a0e00) on `--accent` (#f0506a) — CTA button text
  - Use axe-core's contrast checks as the definitive test. If any fail, adjust the failing color minimally to pass AA.
- **D-13:** Contrast fixes are CSS variable adjustments only — no visual redesign. If a color needs to change, adjust it in `global.css` `:root` block.

### Plan structure (Area G)

- **D-14:** Three plans, two waves:
  - **Wave 1 (2 plans, parallel):**
    1. `05-01-PLAN.md` — CSS + HTML fixes: skip-to-main link (Base.astro), focus-visible styles (global.css), emoji aria-labels (Features.astro), any missing aria-labels (A11Y-01, A11Y-02)
    2. `05-02-PLAN.md` — Contrast audit: verify all color pairings via axe-core, fix any failing pairs in global.css (A11Y-03)
  - **Wave 2 (1 plan, depends on both Wave 1 plans):**
    3. `05-03-PLAN.md` — Consolidated a11y scan: run `@axe-core/cli` against dist/index.html + dist/releases/index.html, keyboard tab-through verification, report results (all requirements)
- **D-15:** Plans 05-01 and 05-02 are parallelizable — 05-01 touches Base.astro + Features.astro + global.css (focus styles section), 05-02 touches global.css (`:root` color variables only). File overlap exists on global.css but the edits are in different sections (`:root` vs interactive selectors) so a sequential-within-wave execution is safer. Planner: set both as Wave 1 but mark `05-02 depends_on: []` — the orchestrator's intra-wave overlap check will force sequential execution if needed.

### Claude's Discretion

- Exact `aria-label` text for each Features.astro emoji tile — planner picks descriptive labels.
- Whether `@axe-core/cli` is installed as a devDependency or run via npx — planner picks.
- Exact CSS class name for the sr-only utility (`.sr-only`, `.visually-hidden`, etc.) — match whatever is most conventional for the codebase.
- Commit message conventions — follow existing pattern.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap + requirements
- `.planning/ROADMAP.md` (Phase 5 detail block) — phase goal, success criteria, requirements list, depends-on chain (Phase 4), notes on Starlight a11y exclusion
- `.planning/REQUIREMENTS.md` §"Accessibility" (A11Y-01..A11Y-03) — the three requirements this phase satisfies

### Prior phase context
- `.planning/phases/04-marketing-copy-rewrite-pro-tier-readiness/04-CONTEXT.md` — Phase 4's voice-invariant verification norms (D-13..D-15) carry forward; the five components edited in Phase 4 are the same components audited here
- `.planning/PROJECT.md` — voice anchors and project conventions

### No external specs
No external specs/ADRs are referenced. WCAG 2.1 AA is the standard; axe-core encodes its rules.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Nav.astro already has good a11y:** `aria-label="Main navigation"`, hamburger button has `aria-label`, `aria-expanded`, `aria-controls`, SVGs have `aria-hidden="true"`.
- **Footer.astro RSS SVG** has `aria-hidden="true"` — correct pattern for decorative icons.
- **global.css `:root` block** (lines 1-14) — all color variables in one place, easy to adjust for contrast.

### Established Patterns
- **No existing focus styles.** `global.css` has no `:focus` or `:focus-visible` rules — this is a gap, not a conflict. New styles won't override anything.
- **No skip link exists.** `Base.astro` has no skip navigation link. Adding one is additive.
- **No sr-only utility class exists.** Will need to create one in `global.css`.

### Integration Points
- **Base.astro** is the layout for all marketing pages (`/`, `/releases`). Adding a skip link here covers all non-Starlight surfaces.
- **Features.astro** tile structure: each tile is a `<div class="feature-card">` with an emoji span + heading + body. The emoji spans need `role="img"` + `aria-label`.
- **global.css** is imported by Base.astro — any new styles here apply to all marketing pages automatically.

</code_context>

<specifics>
## Specific Ideas

- The axe-core scan should produce zero critical AND zero serious violations. Moderate/minor violations are acceptable for v1 (flagged for review but not blocking).
- Keyboard tab order should follow visual reading order: skip link → nav links → hero CTA → how-it-works → features → architecture CTA → footer links → download CTA.
- The `:focus-visible` outline should be `var(--accent-subtle)` (#a78bfa) — visible on the dark background and consistent with the link color.

</specifics>

<deferred>
## Deferred Ideas

- **Full manual screen-reader pass (A11Y-v2-01)** — NVDA/VoiceOver walkthrough deferred to v2 per REQUIREMENTS.md.
- **Reduced motion preference** — `prefers-reduced-motion` media query for any CSS transitions/animations. Not in scope but a good v2 addition.
- **Automated a11y CI gate** — Running axe-core in CI on every PR. Useful but out of scope for this phase (Phase 1 CI only runs `npm run build`).
- **Dark/light mode a11y** — Site is dark-mode only; no theme toggle exists. If a light mode is added later, re-run contrast verification.

</deferred>

---

*Phase: 05-accessibility-pass*
*Context gathered: 2026-04-26*

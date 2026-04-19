---
phase: 260419-wks-fix-broken-homepage-anchor-links-in-prim
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/Nav.astro
autonomous: true
requirements:
  - QUICK-260419-wks
must_haves:
  truths:
    - "Clicking 'How It Works' in the nav from /releases/ jumps to the homepage's #how-it-works section"
    - "Clicking 'Features' in the nav from /releases/ jumps to the homepage's #features section"
    - "Clicking 'How It Works' and 'Features' from / still jumps to the corresponding section on the same page"
    - "Clicking 'How It Works' and 'Features' from /docs/* navigates to the homepage and jumps to the correct section"
  artifacts:
    - path: "src/components/Nav.astro"
      provides: "Primary nav with absolute homepage anchor hrefs"
      contains: 'href="/#how-it-works"'
  key_links:
    - from: "src/components/Nav.astro"
      to: "homepage sections #how-it-works and #features"
      via: "absolute anchor href from any page"
      pattern: 'href="/#(how-it-works|features)"'
---

<objective>
Fix two broken anchor links in the primary navigation so they always jump to the correct homepage section from any page (e.g. /releases/, /docs/*), not just from the homepage itself.

Purpose: In Astro's static output, a bare `href="#features"` is resolved by the browser against the *current* URL. On /releases/ it becomes /releases/#features (which has no such anchor), so the click appears broken. Prefixing with `/` (`/#features`) forces resolution to the site root so the nav behaves consistently from every page.

Output: Two-line edit to src/components/Nav.astro, verified by a successful build and a manual check on the preview server.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/STATE.md
@src/components/Nav.astro
</context>

<tasks>

<task type="auto">
  <name>Task 1: Make homepage anchor links absolute in Nav.astro</name>
  <files>src/components/Nav.astro</files>
  <action>
In src/components/Nav.astro, change the two relative homepage anchor hrefs on lines 10-11 to be absolute so they resolve against the site root from any page:

- Line 10: change `<a href="#how-it-works">How It Works</a>` to `<a href="/#how-it-works">How It Works</a>`
- Line 11: change `<a href="#features">Features</a>` to `<a href="/#features">Features</a>`

Do NOT touch any other link (the `/releases/`, `/docs/`, and DMG download links are already correct). Do NOT change link text, classes, surrounding markup, or the `<style>` block. This is a pure href-prefix edit: two characters prepended (`/`) on two lines.

Rationale: a bare `href="#id"` is resolved by the browser against the current page URL, so on /releases/ it becomes /releases/#id (broken). Prefixing with `/` anchors resolution to the site root, which is where the #how-it-works and #features sections actually live (rendered by src/pages/index.astro).
  </action>
  <verify>
    <automated>npm run build</automated>

Manual spot-check after automated build succeeds:
1. Run `npm run preview` (or open the freshly built `dist/releases/index.html`).
2. Visit `/releases/`, click "How It Works" — URL becomes `/#how-it-works` and page scrolls to that section on the homepage.
3. Click "Features" from `/releases/` — URL becomes `/#features` and page scrolls to that section.
4. From `/`, click "How It Works" and "Features" — still scroll to the same-page sections (no regression).
  </verify>
  <done>
- src/components/Nav.astro line 10 contains `href="/#how-it-works"`.
- src/components/Nav.astro line 11 contains `href="/#features"`.
- No other line in Nav.astro is modified.
- `npm run build` completes successfully with no new warnings attributable to this change.
  </done>
</task>

</tasks>

<verification>
- `grep -n 'href="/#' src/components/Nav.astro` returns exactly two matches: `/#how-it-works` and `/#features`.
- `grep -nE 'href="#(how-it-works|features)"' src/components/Nav.astro` returns zero matches (no leftover relative anchors).
- `npm run build` exits 0.
- Manual nav check from `/releases/` confirms both anchors now navigate to the homepage and scroll to the correct section.
</verification>

<success_criteria>
From any page on the site (`/`, `/releases/`, `/docs/*`), clicking "How It Works" or "Features" in the primary nav lands the user on the homepage at the correct anchor section. Behavior on `/` itself is unchanged.
</success_criteria>

<output>
After completion, create `.planning/quick/260419-wks-fix-broken-homepage-anchor-links-in-prim/260419-wks-SUMMARY.md`
</output>

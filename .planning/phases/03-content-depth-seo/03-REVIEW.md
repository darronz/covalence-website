---
phase: 03-content-depth-seo
reviewed: 2026-04-23T00:00:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - astro.config.mjs
  - public/robots.txt
  - src/components/Architecture.astro
  - src/components/Features.astro
  - src/content/docs/docs/under-the-hood.md
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: has_findings
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-23T00:00:00Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** has_findings

## Summary

Phase 3 (Content Depth & SEO) is structurally sound and cleanly implemented. The four changed files plus the new `under-the-hood.md` page all pass the XSS / HTML-injection, accessibility, scoped-CSS, and SEO-head checks described in the review brief:

- **SEO head (`astro.config.mjs`):** The four new `meta` tags use absolute URLs matching `Base.astro` (`/og-image.png`, width 1200, height 627) exactly. The pre-existing Phase 2.1 RSS `<link rel="alternate">` is preserved. Sidebar array contains 7 entries with "Under the Hood" correctly inserted between "Core Memories" and "MCP Tools".
- **robots.txt:** Four directives syntactically valid. `Disallow: /releases/*.dmg` wildcard is valid under the de facto extended robots.txt spec honored by Googlebot / Bingbot / etc. `Sitemap:` is absolute HTTPS. No AI-crawler blocks.
- **Accessibility (`under-the-hood.md`):** The SVG's `aria-labelledby="rs-title rs-desc"` correctly references two unique IDs within the same SVG root (`rs-title`, `rs-desc`), each bound to a `<title>` / `<desc>` element. The CTA link in `Architecture.astro` uses descriptive link text ("Full technical deep-dive →") — no "click here" anti-pattern.
- **Scoped CSS (`Architecture.astro`):** All four removed selectors (`.arch-stack ul`, `.arch-stack li`, `.arch-stack li::before`, `.arch-stack li strong`) are gone cleanly. No orphan `<style>` rules targeting removed elements. The `.arch-privacy` column (lines 19-28) and its `.privacy-statement` / `.privacy-detail` CSS rules are byte-identical to the pre-phase version, preserving the critical invariant. New `.arch-teaser`, `.arch-teaser-detail`, `.arch-teaser-cta` selectors all correspond to elements in the template.
- **Voice invariants (`under-the-hood.md`, `Architecture.astro`):** Neither file contains the banned words (`instant`, `amazing`, `blazing`, `effortless`, `powerful`, `free`, `millisecond inference`, `CoreML on Apple Neural Engine`). The `Architecture.astro` rewrite correctly replaces the old "CoreML on Apple Neural Engine" with "MLTensor on Apple Silicon" and drops the old "instant, free" phrasing.
- **Frontmatter:** `under-the-hood.md` has a valid Starlight frontmatter with non-empty `title` and `description` for SEO meta emission.

One voice-invariant regression survived in `Features.astro` — the word "instant" still appears on line 26 (`"Global hotkey for instant search."`). The phase plan explicitly fixed the "CoreML on Apple Neural Engine" line in Features.astro (line 21), but did not also clean the "instant" on line 26 two lines away. Per `.planning/phases/03-content-depth-seo/03-PATTERNS.md:395` ("instant ... all banned") this is a warning-level voice violation that would also fail the Phase 4 plan's build-time grep (`! grep -qwi 'instant' dist/...`) if that check were extended to `index.html`.

Two info-level items: a dead SVG `<line>` element with `stroke="none"` and an out-of-viewBox coordinate, and a note that the new `Disallow:` path targets a `/releases/` tree that does not yet exist in the repo (forward-looking — harmless).

## Warnings

### WR-01: Banned voice word "instant" remains in Features.astro

**File:** `src/components/Features.astro:26`
**Issue:** The Phase 3 voice-invariant list (ROADMAP + 03-PATTERNS.md:395) bans the word `instant`. The rewrite of line 21 ("MLTensor on Apple Silicon") correctly removed one voice violation, but line 26 still reads:

```astro
description: 'Menu bar app with one-click capture. Global hotkey for instant search.',
```

This is emitted into the production homepage (`index.astro` renders `Features.astro`), so the banned word ships to covalence.app. The Phase 4 verification plan already runs `! grep -qwi 'instant'` against the built `/docs/under-the-hood/index.html`; extending that check to `dist/index.html` would catch this. It should be fixed in this phase rather than deferred — the rewrite was explicitly a "voice correction" pass on this file (03-01 scope) and it would be inconsistent to leave a sibling-line violation standing.

**Fix:** Drop the superlative and keep the concrete mechanism. Suggested rewrite preserving the card's two-claim structure:

```astro
description: 'Menu bar app with one-click capture. Global hotkey opens search from anywhere.',
```

Or if you want to emphasise speed without a banned qualifier:

```astro
description: 'Menu bar app with one-click capture. Global hotkey for search — no window switch.',
```

Either rewrite keeps the 2-sentence, numeric-adjacent rhythm used by the other five cards and avoids the evaluative adjective.

## Info

### IN-01: Dead SVG `<line>` element in retrieval-pipeline diagram

**File:** `src/content/docs/docs/under-the-hood.md:66`
**Issue:** The line

```html
<line x1="175" y1="80" x2="775" y2="80" stroke="none" />
```

has `stroke="none"`, so it renders nothing. Its `x2="775"` also exceeds the diagram's `viewBox="0 0 700 260"` width by 75 units. The visible horizontal bus that connects truncation-output to the two branches is already drawn by the two adjacent lines (`175,80 → 475,80` on line 67 and `475,80 → 525,80` on line 68), so this element is redundant dead code.

Not a rendering bug — the browser simply paints nothing — but it's unreachable markup that survived a draft. Slightly misleading for anyone reading the source to understand the diagram geometry.

**Fix:** Delete the line outright:

```html
<!-- before -->
<line x1="475" y1="56" x2="475" y2="80" />
<line x1="175" y1="80" x2="775" y2="80" stroke="none" />
<line x1="175" y1="80" x2="475" y2="80" />

<!-- after -->
<line x1="475" y1="56" x2="475" y2="80" />
<line x1="175" y1="80" x2="475" y2="80" />
```

### IN-02: robots.txt `Disallow: /releases/*.dmg` targets a path that does not yet exist

**File:** `public/robots.txt:3`
**Issue:** The directive `Disallow: /releases/*.dmg` pre-emptively blocks crawling of `.dmg` files under a `/releases/` path that currently has no source (`src/pages/releases/` and `public/releases/` both absent at diff time). This is intentional forward-looking pre-emption — Phase 4+ is expected to add the releases page — and it is harmless: crawlers ignore disallow rules for paths that return 404.

Worth flagging only because if the eventual releases page serves `.dmg` files from a different path (for example, `/downloads/*.dmg` or a direct GitHub Releases redirect), this rule will silently not cover them. The directive's correctness is coupled to a future implementation choice.

**Fix:** No change required for this phase. Add a note on the Phase 4 (or whichever phase introduces `/releases`) plan to re-verify the robots.txt pattern matches the actual served path before that phase lands. Alternatively, broaden the rule now to cover both shapes:

```
Disallow: /releases/
```

(Blocks the entire `/releases/` subtree, including non-`.dmg` assets — simpler and future-proof against URL-shape drift. Only do this if you're confident the `/releases/` HTML index page also should not be indexed; if the HTML index *should* be indexed and only the binary `.dmg` payloads should be excluded, the current pattern is correct and the note stands.)

---

_Reviewed: 2026-04-23T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

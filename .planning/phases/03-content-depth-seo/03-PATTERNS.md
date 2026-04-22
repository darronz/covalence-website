# Phase 3: Content Depth & SEO - Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 4 (2 created, 2 edited)
**Analogs found:** 4 / 4
**Project skills:** none (`.claude/skills/` and `.agents/skills/` do not exist)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `public/robots.txt` (created) | static asset (text config) | build-time copy-through | `public/_routes.json` | role-match (both are plain-text site-root configs in `public/`) |
| `src/content/docs/docs/under-the-hood.md` (created) | Starlight doc page (Markdown content) | build-time SSG | `src/content/docs/docs/getting-started.md` | exact (same collection, same frontmatter schema, same Markdown dialect) |
| `astro.config.mjs` (edited) | build config — `starlight({ head, sidebar })` extension | config-time array append | same file, existing entries at lines 15–25 (head) and 27–34 (sidebar) | exact (self-analog — extend what's already there) |
| `src/components/Architecture.astro` (edited) | marketing component (rewrite of `arch-stack` column) | build-time SSG | `src/components/Architecture.astro` `arch-privacy` column (lines 15–25) within the same file; voice anchors in `Hero.astro`, `HowItWorks.astro`, `Features.astro` | exact (self-analog: mirror the sibling column's prose-paragraph shape) |

**Why no controller/service/test analogs:** this is a static Astro site with no runtime server, no test suite, and no service layer. All four files are either content, config, or template.

---

## Pattern Assignments

### `public/robots.txt` (created — static asset, build-time copy-through)

**Analog:** `public/_routes.json`

**Pattern — "plain text file in `public/`":**
Astro 6 SSG copies every file in `public/` verbatim to `dist/` without transformation. `public/_routes.json` (3 lines, JSON, newline-terminated) lands at `dist/_routes.json` byte-identical. The same applies to `public/robots.txt` — it will be served from `https://covalence.app/robots.txt` exactly as written.

**Analog content** (`public/_routes.json`, full file):
```json
{
  "version": 1,
  "exclude": ["/releases/Covalence-*", "/appcast.xml"]
}
```

**Exact bytes to write to `public/robots.txt`** (from RESEARCH.md §robots.txt, confirmed by D-06):
```
User-agent: *
Allow: /
Disallow: /releases/*.dmg
Sitemap: https://covalence.app/sitemap-index.xml
```

**Variables that differ from the analog:** different file format (plain text, not JSON); different purpose (crawler directive, not Pages routing). The shared pattern is only the directory convention: `public/<name>.<ext>` becomes `/<name>.<ext>` at the site root.

**Frontmatter / shape:** none — four lines, ASCII only, trailing newline. No YAML, no JSON, no comments.

**Landmines:**
- **L1 (Pitfall 6, RESEARCH.md):** If the planner ever generalises this file by pulling an absolute URL from a variable, make sure the `Sitemap:` line stays a literal absolute `https://covalence.app/sitemap-index.xml`. Crawlers do not resolve relative URLs in robots.txt directives.
- **L2:** `Disallow: /releases/*.dmg` uses the RFC 9309 `*` wildcard (matches zero-or-more non-`/` chars). Do NOT rewrite as `/releases/Covalence-*.dmg` without re-confirming every DMG filename — `*.dmg` is more robust per RESEARCH.md §Glob analysis.
- **L3:** No trailing/leading blank lines beyond the single trailing newline — keep the file "exactly four lines" per D-06 so the §Verification step 4 grep comparison stays clean.

---

### `src/content/docs/docs/under-the-hood.md` (created — Starlight doc page)

**Analog:** `src/content/docs/docs/getting-started.md`

**Imports / Frontmatter pattern** (`getting-started.md` lines 1–6):
```md
---
title: Getting Started
description: Connect Covalence to Claude Desktop, Claude Code, or Cursor in under a minute.
---

Connect Covalence to your AI client by adding it as an MCP server. Once connected, your AI gains persistent memory that persists across sessions.
```

**Heading structure pattern** (lines 8, 13, 15, 31, 67, 73, 79):
```md
## Prerequisites

## Connect Your AI Client

### Claude Desktop

## Add the AI Instruction

## Verify It Works

## What's Next
```

Top-level `H2` (`##`) for each of the five CONT-01 topics; `H3` (`###`) for sub-sections if needed. No `H1` in the body — Starlight renders the frontmatter `title` as the page `<h1>`.

**Fenced code block pattern** (lines 19–27; critical — must start at column 1):
```md
```json
{
  "mcpServers": {
    "covalence": {
      "command": "/Applications/Covalence.app/Contents/MacOS/cov-mcp"
    }
  }
}
```
```

Note the three-backtick fence has **zero leading whitespace** — any indentation turns it into a CommonMark indented-code-block and Starlight's Expressive Code will not highlight it.

**Inline-link pattern** (line 11):
```md
[Covalence](https://covalence.app/releases/Covalence-latest.dmg) installed in `/Applications`
```

Internal doc links use trailing-slash absolute paths (line 81):
```md
- **[Spaces](/docs/spaces/)** — Isolate memories by project using the `--space` flag
```

**Variables that differ from the analog:**

| Field | `getting-started.md` | `under-the-hood.md` (new) |
|-------|----------------------|----------------------------|
| `title` | `Getting Started` | `Under the Hood` |
| `description` | "Connect Covalence to Claude Desktop, Claude Code, or Cursor in under a minute." | (suggested in RESEARCH.md §Retrieval-stack explainer frontmatter) "How Covalence finds the right memory — embedding model, Matryoshka truncation, hybrid search, and recency weighting, with the concrete numbers." |
| Body structure | 6 `H2` sections, code-heavy (3 JSON blocks + 2 bash) | 5 `H2` sections per D-04 order (Embedding model → Asymmetric search → Matryoshka → Hybrid search → Recency), **prose-dominant** + one inline SVG diagram |
| Code blocks | 3 JSON + 2 bash fences | None required; numbers inline as prose. Optional one small SQL-ish or Swift-ish fence if a specific algorithm snippet adds credibility |
| Inline SVG | none | one `<svg role="img" aria-labelledby="..." width="~700" height="~240">...</svg>` between topics 3 and 4 per RESEARCH.md §Diagram content |

**Concrete numbers to use (all CONFIRMED in RESEARCH.md §Retrieval Stack Parameter Table — do NOT fabricate):**
- Embedding model: `nomic-embed-text-v1.5` (fp16 safetensors, ~261 MB bundled)
- Native dim: 768 → truncated dim: 256 (single-step Matryoshka, ~2% quality loss, 3× smaller vectors — 1KB per memory vs 3KB)
- Task prefixes: `search_document: ` at store, `search_query: ` at retrieval
- Hybrid: vec0 KNN (sqlite-vec) + FTS5 BM25, fetch limit = `max(limit × 4, 20)` (×6 with filters), cosine threshold default 0.3
- RRF k = 60 (Cormack et al. 2009 standard — worth citing)
- Recency: `1.0 / (1.0 + ageHours / 8760.0)`, weighted at 10% of final score via `finalScore = 0.9 × rrf + 0.1 × decay × 0.033`
- Runtime: MLTensor via `jkrukowski/swift-embeddings` on Apple Silicon, macOS 15+

**Voice to match** (anchors from RESEARCH.md §Voice/Tone Anchors):
- `Hero.astro:23` — "Runs on your Mac. Private, fast, and entirely yours." (short bursts, period between)
- `Architecture.astro:18` — "Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device." (denial cascade, two-word sentences)
- `HowItWorks.astro:3` — "Two copy-pastes. That's it." (confident minimal claim)
- British spelling where it arises ("optimise", "behaviour", "serialise"); concrete numbers preferred over adjectives. No "instant", "amazing", "powerful", "free".

**Landmines:**
- **L1 (Pitfall 5, RESEARCH.md):** File extension MUST be `.md` not `.mdx`. `@astrojs/mdx` is not installed. No JSX tags like `<Tabs>` or `<TabItem>` — they will render as lowercase HTML and look broken.
- **L2 (Pitfall 5 + 02.1-07 landmine):** Every fenced code block starts at **column 1**. No leading spaces ahead of the ` ``` `. Indented fences become CommonMark indented-code-blocks and lose Expressive Code highlighting.
- **L3 (Pitfall 4, RESEARCH.md):** Every concrete number must match §Retrieval Stack Parameter Table exactly. Do NOT write "Matryoshka schedule [64, 128, 256, 512, 768]" — that's the nomic paper's claim, not what Covalence ships. Covalence uses a single 768 → 256 truncation.
- **L4 (Pitfall 7, RESEARCH.md):** Do NOT write "CoreML on Apple Neural Engine" on this page — the code does not declare `MLModelConfiguration(computeUnits: .cpuAndNeuralEngine)`. Write "MLTensor on Apple Silicon" or "`jkrukowski/swift-embeddings` via MLTensor on Apple Silicon".
- **L5:** Inline SVG must set `role="img"` and `aria-labelledby` pointing to an inner `<title>`/`<desc>` pair for a11y (Phase 4 will re-audit, but don't regress here). Use `stroke="currentColor"` on primitives so dark/light themes both work without CSS changes.
- **L6:** New page lives at `src/content/docs/docs/under-the-hood.md` (nested-docs pattern) — NOT `src/content/docs/under-the-hood.md`. Matches existing six Starlight pages.

**Frontmatter shape (exact fields / types):**
```yaml
---
title: string          # required — renders as <h1>
description: string    # required — feeds og:description + meta description
---
```
(No other frontmatter fields needed. Starlight's full schema supports `sidebar`, `head`, `template`, etc., but none are required for this page.)

---

### `astro.config.mjs` (edited — extend `starlight({ head, sidebar })`)

**Analog:** same file (self-analog). Current `head: [...]` array at lines 15–25 and `sidebar: [...]` at lines 27–34 are the structural templates to extend.

**Existing `head` entry pattern** (lines 15–25):
```js
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
      ],
```

**Existing `sidebar` entry pattern** (lines 27–34):
```js
      sidebar: [
        { label: 'Getting Started', slug: 'docs/getting-started' },
        { label: 'Spaces', slug: 'docs/spaces' },
        { label: 'Core Memories', slug: 'docs/core-memories' },
        { label: 'MCP Tools', slug: 'docs/mcp-tools' },
        { label: 'AI Instruction', slug: 'docs/ai-instruction' },
        { label: 'Keyboard Shortcuts', slug: 'docs/keyboard-shortcuts' },
      ],
```

**Delta to add — `head` array (RESEARCH.md §Head Tag Mirror option 2c — delta-only mirror):**
```js
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
        // Starlight already emits canonical, og:title, og:type, og:url, og:description,
        // og:site_name, twitter:card, and meta description on every /docs/* page.
        // This array only adds the tags Starlight does NOT auto-emit — og:image
        // (+ dimensions) and twitter:image — so /docs/* reaches parity with
        // Base.astro's SEO head block without duplicate emission.
        { tag: 'meta', attrs: { property: 'og:image',        content: 'https://covalence.app/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width',  content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '627'  } },
        { tag: 'meta', attrs: { name:     'twitter:image',   content: 'https://covalence.app/og-image.png' } },
      ],
```

**Delta to add — `sidebar` array (insert between `Core Memories` and `MCP Tools`, per RESEARCH.md §Code Examples):**
```js
        { label: 'Core Memories',       slug: 'docs/core-memories' },
        { label: 'Under the Hood',      slug: 'docs/under-the-hood' },   // NEW
        { label: 'MCP Tools',           slug: 'docs/mcp-tools' },
```

**Variables that differ from the analog:** existing single `head` entry is a `<link rel="alternate">` (tag: `'link'`); the four new entries are all `<meta>` tags (tag: `'meta'`). Existing sidebar has 6 entries; new sidebar has 7 entries (one insertion). No new top-level Starlight config keys — only two existing array extensions.

**Frontmatter / config shape (Starlight `head` entry schema — from `node_modules/@astrojs/starlight/schemas/head.ts:4-47`):**
```ts
{
  tag: 'link' | 'meta' | 'script' | 'style' | 'title' | 'base' | 'noscript' | 'template';
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}
```

For `<meta>` tags the attr keys that matter are `property` (OG) or `name` (Twitter / generic) plus `content` (absolute URL or literal string). Starlight's `mergeHead()` dedupes by `property` / `name` / `http-equiv` — no risk of duplicate emission when both the user-supplied array and the built-in defaults target the same key.

**Landmines:**
- **L1 (Pitfall 1, RESEARCH.md):** Do NOT add `import sitemap from '@astrojs/sitemap'` or register `sitemap()` in the top-level `integrations: [...]` array. Starlight registers `@astrojs/sitemap` internally via `starlightSitemap(opts)`; double-registering produces duplicate emission or plugin-ordering errors. D-09 mandates "no sitemap config changes unless verification surfaces a gap" — respect this.
- **L2 (Pitfall 2, RESEARCH.md):** `starlight({ head })` is a **static array** evaluated at config-load time. Do NOT write `content: new URL(...)` or `content: Astro.site + '...'` — `Astro` is not in scope here. Use a hardcoded absolute URL: `'https://covalence.app/og-image.png'`. Site URL is pinned at line 5 of this file anyway.
- **L3 (Pitfall 6, RESEARCH.md):** Do NOT use relative paths in `og:image` / `twitter:image` — `content: '/og-image.png'` renders as a root-relative URL that social-card debuggers (Twitter, Facebook) do not resolve. Always full absolute origin.
- **L4:** Do NOT mirror the OG/Twitter tags Starlight already emits (canonical, og:title, og:type, og:url, og:description, og:site_name, twitter:card, meta description). Mirroring works (Starlight's `mergeHead` at `utils/head.ts:185-187` dedupes by name/property) but it's redundant noise. Delta-only mirror keeps the config readable.
- **L5 (02.1-06 landmine, now captured in comments):** Do NOT install standalone `astro-expressive-code` or any Markdown-rendering integration. Starlight owns code-block rendering via its bundled EC. This rule is not directly touched by the Phase 3 diff but is worth preserving as a comment if the planner adds one above the `head: [...]` block.
- **L6:** Keep 2-space indent and single quotes — matches the rest of the file and CLAUDE.md conventions. No trailing commas in the wrong places (but Astro config supports trailing commas, and the existing file uses them — match it).

---

### `src/components/Architecture.astro` (edited — rewrite `arch-stack` column only)

**Analog:** same file — `arch-privacy` column (lines 15–25) is the sibling to copy the prose-paragraph rhythm from. Voice anchors live in `Hero.astro:22-24`, `HowItWorks.astro:3-4`, and `Features.astro:21`.

**`arch-privacy` column pattern (MUST survive unchanged, lines 15–25):**
```astro
      <div class="arch-privacy">
        <h3>Privacy by architecture</h3>
        <p class="privacy-statement">
          Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device.
        </p>
        <p class="privacy-detail">
          Every component — the database, the embedding model, the search engine — runs locally.
          There are no network calls, no API keys, no external dependencies.
          Your memories are a single SQLite file on your Mac that you own, back up, and export whenever you want.
        </p>
      </div>
```

Structural template:
1. `<h3>` heading (short, no trailing punctuation).
2. Short "statement" paragraph (1 sentence, ~15–25 words, denial-cascade rhythm acceptable).
3. Longer "detail" paragraph (2–4 sentences, concrete specifics — names of components, file types, numbers).

**Current `arch-stack` column to REPLACE (lines 5–14):**
```astro
      <div class="arch-stack">
        <h3>The stack</h3>
        <ul>
          <li><strong>Database:</strong> SQLite + sqlite-vec — single file, embedded, battle-tested</li>
          <li><strong>Embeddings:</strong> CoreML on Apple Neural Engine — on-device, instant, free</li>
          <li><strong>Search:</strong> Hybrid vector + FTS5 keyword, merged via Reciprocal Rank Fusion</li>
          <li><strong>Protocol:</strong> MCP (stdio) — the standard for AI tool integration</li>
          <li><strong>UI:</strong> Native SwiftUI — belongs on your Mac</li>
        </ul>
      </div>
```

**Replacement shape (per D-02 + RESEARCH.md §Voice/Tone Anchors + Pitfall 7 + Pitfall 3):**
```astro
      <div class="arch-stack">
        <h3>How retrieval works</h3>
        <p class="arch-teaser">
          {/* 1 short statement paragraph — matches privacy-statement cadence.
              Example shape: "Every memory becomes a 256-dimension vector. Search runs on-device.
              Vector similarity meets keyword match via RRF. No cloud round-trips." */}
        </p>
        <p class="arch-teaser-detail">
          {/* 1–2 detail paragraphs — name the components at marketing altitude:
              nomic-embed-text-v1.5 via MLTensor on Apple Silicon, Matryoshka truncation,
              hybrid vector + FTS5, RRF k=60, recency at 10%. Concrete but not exhaustive. */}
        </p>
        <p class="arch-teaser-cta">
          <a href="/docs/under-the-hood/">Full technical deep-dive →</a>
        </p>
      </div>
```

**Variables that differ from the analog:**

| Field | `arch-privacy` | new `arch-stack` |
|-------|----------------|------------------|
| `<h3>` text | `Privacy by architecture` | `How retrieval works` (or similar — planner picks; British spelling, no superlatives) |
| Paragraph count | 2 (statement + detail) | 2–3 (teaser statement + detail + CTA link), per D-02 "2–3 paragraph teaser" |
| CSS classes on paragraphs | `privacy-statement`, `privacy-detail` | new classes (e.g. `arch-teaser`, `arch-teaser-detail`, `arch-teaser-cta`) — the current stylesheet targets `.arch-stack li` and `.arch-stack ul` which will have no matches after the rewrite. Planner decides whether to add new rules or reuse `.privacy-statement`/`.privacy-detail` with renamed selectors. |
| Content shape | declarative privacy claims | 5-topic retrieval stack teaser + CTA to `/docs/under-the-hood/` |

**CSS cleanup** — current `<style>` block at lines 30–89 has rules for `.arch-stack ul` (lines 44–49), `.arch-stack li` (lines 51–57), `.arch-stack li::before` (lines 59–64), and `.arch-stack li strong` (lines 66–68). After the rewrite the `<ul>` is gone, so these four rules become dead code. Planner chooses:
- **Option A** — delete the dead `.arch-stack ul/li` rules, add new `.arch-teaser*` rules mirroring `.privacy-statement` / `.privacy-detail` typography.
- **Option B** — repurpose `.arch-stack` as a container class, add `arch-teaser*` classes on paragraphs, leaving the `<h3>` rule (lines 37–42) untouched since it already targets both `.arch-stack h3` and `.arch-privacy h3`.

Option B is cleaner — the `.arch-stack h3` selector at lines 37–42 already works for the new heading without change.

**Landmines:**
- **L1 (Pitfall 3, RESEARCH.md):** `arch-privacy` column (lines 15–25) MUST survive byte-identical. Do NOT touch `.privacy-statement` or `.privacy-detail` styles or content. Only lines 5–14 (the `arch-stack` `<div>`) + the dead `.arch-stack ul/li` CSS rules get rewritten/deleted.
- **L2 (Pitfall 7, RESEARCH.md):** Do NOT write "CoreML on Apple Neural Engine" in the new copy — that's the line the rewrite exists to fix. Use "MLTensor on Apple Silicon" or "nomic-embed-text-v1.5 on Apple Silicon". Planner may also want to fold the Features.astro line 21 "CoreML on Apple Neural Engine" one-line correction into this phase (per RESEARCH.md §Open Questions 3) — it's a 1-line string change that keeps the home page and deep page telling the same story.
- **L3 (voice invariant from RESEARCH.md §Voice/Tone Anchors):** no "instant", "amazing", "powerful", "free" or similar evaluative adjectives. The current `arch-stack` line 9 has "instant, free" — both must die in the rewrite. Only numeric specifics and neutral descriptors.
- **L4:** CTA link goes to `/docs/under-the-hood/` (with trailing slash — matches the trailing-slash convention in `getting-started.md` and all other internal doc links).
- **L5:** Keep the two-column `.arch-grid` structure intact — it's the shape the CSS `@media (max-width: 768px)` breakpoint at lines 84–88 collapses to single-column on mobile. The new `arch-stack` column must stay inside that grid.
- **L6:** 2-space indent, double quotes on HTML attributes, single quotes nowhere here (no JS in this file currently) — matches CLAUDE.md conventions.

---

## Shared Patterns

### Canonical URL construction
**Source:** `src/layouts/Base.astro:11` — `const canonicalURL = new URL(Astro.url.pathname, Astro.site);`
**Apply to:** any new canonical emission on a Base.astro-rendered page. (Phase 3 does not add any — Base.astro already emits correctly, and Starlight auto-emits on `/docs/*`. Pattern is listed for completeness / Pitfall 2 defence.)

**Pattern:**
```astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// …
<link rel="canonical" href={canonicalURL} />
```

Decision 02.1-03 invariant: **never `Astro.url.pathname` alone — always `new URL(path, Astro.site)`**. Applies universally.

### OG image URL construction
**Source:** `src/layouts/Base.astro:33, 41` — `new URL('/og-image.png', Astro.site)` produces an absolute URL.
**Apply to:** any new OG/Twitter image emission.

**Base.astro pattern** (runtime — has `Astro.site` in scope):
```astro
<meta property="og:image" content={new URL('/og-image.png', Astro.site)} />
<meta name="twitter:image" content={new URL('/og-image.png', Astro.site)} />
```

**`astro.config.mjs` pattern** (config-time — no `Astro` object; hardcode the absolute URL):
```js
{ tag: 'meta', attrs: { property: 'og:image', content: 'https://covalence.app/og-image.png' } },
```

Both resolve to the same output string. The config-time version must be literal.

### Starlight head entry schema
**Source:** `node_modules/@astrojs/starlight/schemas/head.ts:4-47` (HeadConfigSchema).
**Apply to:** every new entry in `astro.config.mjs` `starlight({ head: [...] })`.

```ts
type HeadEntry = {
  tag: 'link' | 'meta' | 'script' | 'style' | 'title' | 'base' | 'noscript' | 'template';
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
};
```

Existing entry (already in file, lines 15–24) as working precedent:
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

### File-naming conventions (CLAUDE.md)
**Apply to all new files:**
- Docs content: `kebab-case.md` in `src/content/docs/docs/` → `under-the-hood.md` ✓
- Static assets: lowercase, no underscores → `robots.txt` ✓
- Config extension: same file, same indent (2 spaces), same quote style (single in JS, double in HTML/attrs)

### Voice / tone (applies to all copy on both new pages)
**Sources and exact anchors:**
- `Hero.astro:22-24` — short bursts, period between claims, load-bearing adjectives only
- `Architecture.astro:18` — denial-cascade rhythm ("No X. No Y. No Z.")
- `HowItWorks.astro:3` — confident minimal claims, two-word sentences allowed
- British spelling, no superlatives ("instant", "amazing", "powerful", "free" all banned)
- Concrete numbers preferred over qualifiers

---

## No Analog Found

All four files have close analogs. No "no-analog" row needed.

---

## Metadata

**Analog search scope:**
- `src/components/*.astro` (7 components — all read in prior research or skimmed this session)
- `src/content/docs/docs/*.md` (6 Starlight pages — `getting-started.md` read in full as the exact analog for the new page)
- `src/layouts/Base.astro` (read in full — SEO head reference)
- `src/pages/posts/[...slug].astro:1-50` (per-post canonical + OG pattern, confirms `new URL(path, Astro.site)` rule)
- `public/*` (7 entries — `_routes.json`, `og-image.png`, `og-image.svg`, `favicon.svg`, `favicons/`, `fonts/` — `_routes.json` picked as closest static-text analog for `robots.txt`)
- `astro.config.mjs` (full file — self-analog for head/sidebar extension)

**Files scanned:** ~12 (bounded — stopped once every new/edited file had a strong analog, per critical rule "stop at 3–5 analogs").

**Pattern extraction date:** 2026-04-22

**Downstream notes for the planner:**
1. All four files can be worked in isolation — no ordering dependency between them at the file-system level. Logical ordering per RESEARCH.md §Primary recommendation: `robots.txt` first (trivial), then `astro.config.mjs` head+sidebar delta (enables the docs sidebar entry), then `under-the-hood.md` (the big content task), then `Architecture.astro` rewrite (depends on the deep page existing so the CTA link resolves).
2. Verification grep sequence (CONTEXT.md §Verification approach + RESEARCH.md §Sitemap Verification Plan) is the same across all four edits — single `npm run build` followed by greps on `dist/robots.txt`, `dist/sitemap-0.xml`, `dist/docs/under-the-hood/index.html`, `dist/index.html`, `dist/docs/index.html`.
3. RESEARCH.md §Open Question 3 (fold a Features.astro:21 one-line "CoreML on Apple Neural Engine" → "MLTensor on Apple Silicon" fix into this phase) is a planner decision — the pattern is the same one-line string edit and will not change this pattern map if folded in.

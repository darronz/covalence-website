# Phase 2.1 — Blog: Design Brief

Inserted 2026-04-21 via `/gsd-insert-phase`. Design agreed via brainstorming session the same day. This file is the seed for `/gsd-spec-phase 2.1` or `/gsd-plan-phase 2.1` — it replays what was decided so the planner doesn't have to re-brainstorm.

## Goal

Long-form writing from Covalence lives at `/posts/` — styled consistently with the marketing site, with Starlight-grade code blocks, an RSS feed, and the two most recent posts surfaced on the landing page. First real post will be an explainer of the **Project Context Sync** feature (v1.3 milestone in the app repo).

## Framing decisions

- **Purpose**: showcase + technical credibility ("show the app off" and "earn technical credibility"). Not a news feed — release notes stay on `/releases/`.
- **Cadence assumption**: low and bursty. Tied to feature ships or deliberate deep-dives. Pagination and tag taxonomy are premature until the archive is ~20 posts deep.
- **Voice constraint**: writing style is short bursts, British spelling, no ceremony, allergic to superlatives (see user writing-style memory). Post layout must not force "blog post shape" (big TL;DRs, summary bands, CTAs at the end).
- **Naming**: URL segment `/posts/`, nav label "Blog" (searchable word; clean URL slug).

## Architecture

- **Content**: new Astro content collection at `src/content/posts/`. Files named `YYYY-MM-DD-<kebab-slug>.md` (date prefix is filing ergonomics only). Published URL is `/posts/<slug>/`, derived from frontmatter `slug` or filename minus date prefix.
- **Routes**:
  - `src/pages/posts/index.astro` — reverse-chronological list (title, date, description, link). No pagination.
  - `src/pages/posts/[...slug].astro` — per-post detail. Uses `[...slug]` so future nesting (`/posts/deep-dives/xyz`) doesn't require migration.
  - `src/pages/posts/rss.xml.ts` — RSS 2.0 via `@astrojs/rss`, full rendered HTML in `<content:encoded>`, capped at 50 items.
- **Code blocks**: `astro-expressive-code` installed as a standalone integration. Starlight auto-detects and defers to it, so `/docs/*` and `/posts/*` share a single Expressive Code config. Themes: `starlight-dark` / `starlight-light` to match docs.
- **Prose**: hand-authored in `src/styles/posts.css`, scoped under a `.prose` wrapper. Targets `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<blockquote>`, `<a>`, `<hr>`, `<img>` only. Code blocks are Expressive Code's concern.
- **Components**:
  - `src/components/PostList.astro` — renders array of posts for index page and home-page "Latest writing" band. Props: `posts`, `limit?`.
  - `src/components/PostLayout.astro` — wraps post body in title block, pub-date, author, `<hr>`, prose container. Uses `Base.astro` for nav/footer.
- **Reuse**: `Nav.astro`, `Footer.astro`, `Base.astro` — unchanged except for nav link + RSS footer link + `<link rel="alternate">` head tag in `Base`.

## Frontmatter schema (Zod-validated in `src/content.config.ts`)

| Field          | Type     | Required | Purpose |
|----------------|----------|----------|---------|
| `title`        | string   | yes      | H1 + `<title>` + OG |
| `description`  | string   | yes      | meta/OG/RSS; <160 chars |
| `pub_date`     | Date     | yes      | ordering + display |
| `updated_date` | Date     | no       | optional freshness marker |
| `author`       | string   | no       | default "Darron Schall" |
| `og_image`     | string   | no       | absolute `/public` path; falls back to site default |

No `draft`, `tags`, `reading_time`, or `slug` field in v1.

## SEO / metadata

Per post: `<title>`, `<meta description>`, `<link rel="canonical">` (absolute on `covalence.app`), OG + Twitter card tags (`og:title`, `og:description`, `og:type=article`, `og:url`, `og:image`, `article:published_time`, `article:author`). No JSON-LD `Article` schema in v1.

Sitemap inclusion happens automatically once Phase 3's sitemap work lands — Phase 2.1 uses standard Astro routes so nothing extra is needed. **This is why 2.1 is inserted before 3**: Phase 3's SEO work covers `/posts/*` in the same pass.

## Home-page integration

New "Latest writing" band inserted on `src/pages/index.astro` between `Architecture` and `Footer` — shows 2 most recent posts via `<PostList posts={latestPosts} limit={2} />`. Empty collection → render nothing (no empty-state UI). Gated by a single boolean `showLatestWriting` at the top of `index.astro` for easy landing-page A/B without touching components.

## Navigation

`Nav.astro` desktop link row and mobile drawer gain one `<a href="/posts/">Blog</a>` entry, placed between "Releases" and "Docs". `Footer.astro` gets a small "RSS" text link.

## Files to create / edit (summary for plan-phase)

**New files:**
- `src/content/posts/` (directory)
- `src/pages/posts/index.astro`
- `src/pages/posts/[...slug].astro`
- `src/pages/posts/rss.xml.ts`
- `src/components/PostList.astro`
- `src/components/PostLayout.astro`
- `src/styles/posts.css`

**Edits:**
- `src/content.config.ts` — add `posts` collection with Zod schema
- `astro.config.mjs` — add `astro-expressive-code` integration with theme config
- `src/components/Nav.astro` — Blog link (desktop + drawer)
- `src/components/Footer.astro` — RSS link
- `src/pages/index.astro` — Latest writing band + `showLatestWriting` boolean
- `src/layouts/Base.astro` — RSS `<link rel="alternate">` head tag
- `package.json` — `astro-expressive-code` and `@astrojs/rss` deps

## Explicit YAGNI (locked for v1)

- No tags, no categories, no `/posts/tag/[tag]/` routes
- No reading time, no word count
- No per-post auto-generated OG images (hand-specify `og_image` or fall back)
- No draft flag / preview workflow — WIP posts live on feature branches, CF Pages preview deploys give a URL
- No author pages
- No comments, reactions, per-post analytics
- No search within posts (Starlight search doesn't see `/posts/*`; not adding a second search)
- No "related posts" section
- No pagination on the index page
- No MDX — plain markdown only. Opt-in per-post if a concrete embed need appears.

## Acceptance — what must be TRUE

1. `https://covalence.app/posts/` renders reverse-chron list with marketing-site typography (not Starlight docs chrome).
2. `https://covalence.app/posts/<slug>/` renders with Expressive-Code-styled code blocks that visually match `/docs/*`.
3. Primary nav + mobile drawer show "Blog" → `/posts/`. Footer shows "RSS".
4. `https://covalence.app/posts/rss.xml` returns valid RSS 2.0 with full body HTML; `Base.astro` head advertises the feed via `<link rel="alternate">`.
5. Landing page shows "Latest writing" band with 2 most recent posts (or renders nothing if empty — no "coming soon" placeholder).
6. `npm run build` passes; CF Pages preview deploy is manually verified on the Project Context Sync explainer post before merge.

## Out-of-band notes for plan-phase

- **Cross-repo dependency**: the Project Context Sync post references the v1.3 milestone in the main Covalence app repo. Coordinate publishing with the v1.3 ship date. The post can be written and queued in a feature branch; merge to `main` when the feature lands.
- **Expressive Code / Starlight collision risk**: Starlight (v0.38.3) bundles its own Expressive Code internally. Standalone `astro-expressive-code` install is supposed to supersede Starlight's bundled one per Starlight docs — verify in a preview build that `/docs/*` code blocks still render correctly after the integration is added.
- **Prose iteration**: expect `src/styles/posts.css` to need tuning after the first real post is written. Ship v1 styling hand-authored against the Project Context Sync post content, not against a Lorem Ipsum draft.

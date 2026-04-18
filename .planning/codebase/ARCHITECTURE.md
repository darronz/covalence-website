# Architecture

**Analysis Date:** 2026-04-18

## Pattern Overview

**Overall:** Astro static site generator (SSG) with an integrated Starlight documentation theme. A single build produces a fully pre-rendered set of static HTML files served from a CDN (Cloudflare Pages). There is no runtime server, no API layer, and no client-side framework beyond the small amount of JavaScript shipped by Starlight itself.

**Key Characteristics:**
- Pure static output — `output: 'static'` in `astro.config.mjs` forces every route to be rendered at build time.
- Two visual modes coexist in one build: a custom marketing landing page at `/` (Astro `.astro` components) and a Starlight-themed `/docs/*` section (MDX / Markdown content collection).
- File-based routing — pages live under `src/pages/` and content lives under `src/content/docs/` with no code configuring individual routes.
- Zero custom server code. Release metadata is ingested at build time from JSON files committed by a GitHub Actions workflow.
- Minimal JS on the wire: no framework integrations are installed (`@astrojs/react` etc. are absent); only Starlight's small client bundle for search, theme toggle, and table-of-contents behaviour.

## Layers

**Marketing landing page (root `/`)**
- Purpose: Home page with Hero, How It Works, Features, Architecture, and Footer sections.
- Location: `src/pages/index.astro`
- Contains: A single Astro page composing the `Base` layout with six marketing components.
- Depends on: `src/layouts/Base.astro`, all files in `src/components/`, `src/styles/global.css`, release data in `src/data/latest-release.json`.
- Used by: Astro routing — emitted as `dist/index.html`.

**Documentation section (`/docs/*`)**
- Purpose: User-facing product documentation rendered by Starlight.
- Location: `src/content/docs/docs/` (nested `docs/docs` is intentional — see Starlight collection shape below).
- Contains: One Markdown/MDX file per page: `index.md`, `getting-started.md`, `spaces.md`, `core-memories.md`, `mcp-tools.md`, `ai-instruction.md`, `keyboard-shortcuts.md`.
- Depends on: Starlight's own layouts and UI, plus `src/styles/starlight.css` for brand colour overrides.
- Used by: The `starlight()` integration in `astro.config.mjs`, which registers the `docs` content collection and renders each entry into `dist/docs/<slug>/index.html`.

**Content collection layer**
- Purpose: Type-safe registration of the Starlight `docs` collection for Astro's Content Layer API.
- Location: `src/content.config.ts`
- Contains: A single `collections` export using `docsLoader()` and `docsSchema()` from `@astrojs/starlight`.
- Depends on: `@astrojs/starlight/loaders` and `@astrojs/starlight/schema`.
- Used by: Astro at build time to discover and validate docs content.

**Layout layer**
- Purpose: HTML shell for the marketing site (head tags, OG metadata, font preloading, body slot).
- Location: `src/layouts/Base.astro`
- Contains: `<html>`, `<head>`, `<body>` with a `<slot />`. Imports `src/styles/global.css` once for the whole marketing page.
- Depends on: Astro-injected `Astro.url`, `Astro.site`, `Astro.props`.
- Used by: `src/pages/index.astro`. Starlight pages use Starlight's built-in layouts, not this file.

**Presentational components (marketing)**
- Purpose: Section-sized visual blocks for the landing page.
- Location: `src/components/`
- Files: `Nav.astro`, `Hero.astro`, `HowItWorks.astro`, `Features.astro`, `Architecture.astro`, `Footer.astro`.
- Contains: Scoped `.astro` components with inline `<style>` blocks (component-scoped CSS) and no client-side scripts.
- Depends on: CSS custom properties defined in `src/styles/global.css`; `Hero.astro` also imports `src/data/latest-release.json` to render version and download size.
- Used by: `src/pages/index.astro`.

**Styles layer**
- `src/styles/global.css` — Design tokens (`--bg-primary`, `--accent`, spacing scale, typography variables), resets, `.container` / `.section` / `.btn` utilities, and `@font-face` declarations pointing at `public/fonts/*.woff2`. Loaded only by `Base.astro` (i.e., the marketing page).
- `src/styles/starlight.css` — Starlight theme overrides that remap Starlight's CSS variables (`--sl-color-accent`, `--sl-color-gray-*`, `--sl-font`, `--sl-font-mono`) to the brand palette. Registered via `starlight({ customCss: ['./src/styles/starlight.css'] })`.

**Static assets**
- Location: `public/`
- Contents: `favicon.ico`, `favicon.svg`, `app-icon.svg`, `co-logo.svg`, `icon.png`, `og-image.png`, `og-image.svg`, self-hosted fonts in `public/fonts/`, and `_routes.json` (Cloudflare Pages routing exclusion for `/releases/*` and `/appcast.xml`).
- Served verbatim from the site root at build time.

**Release metadata (build-time data)**
- Location: `src/data/latest-release.json`, `src/data/releases.json`
- Purpose: Source of truth for version number, download size, tag, and release notes consumed by the Hero at build time.
- Produced by: `.github/workflows/new-release.yml` — a `repository_dispatch` handler (`types: [new-release]`) that rewrites `latest-release.json` and prepends the payload into `releases.json`, then commits via `stefanzweifel/git-auto-commit-action`. The commit triggers a Cloudflare Pages rebuild.

## Data Flow

**Marketing page render (`/`)**

1. `npm run build` invokes `astro build`.
2. Astro discovers `src/pages/index.astro` as a static route.
3. The page imports `Base.astro` and each section component from `src/components/`.
4. `src/components/Hero.astro` imports `src/data/latest-release.json` and computes a human-readable MB size string at the top of the Astro frontmatter.
5. Astro renders the page to `dist/index.html`, extracts scoped component CSS into `dist/_assets/*.css`, and copies `public/*` to `dist/*`.

**Documentation render (`/docs/*`)**

1. The `starlight()` integration registers the `docs` content collection using `docsLoader()` from `src/content.config.ts`.
2. Astro scans `src/content/docs/**/*.{md,mdx}` at build time. Each file's path under `src/content/docs/` becomes a route under the Starlight base path, so `src/content/docs/docs/getting-started.md` is served at `/docs/getting-started/`.
3. Frontmatter (`title`, `description`) is validated against `docsSchema()`.
4. Starlight renders each entry using its built-in page layout, sidebar (configured inline in `astro.config.mjs`), and components such as `<Tabs>` / `<TabItem>` imported from `@astrojs/starlight/components` in MDX files.
5. Starlight invokes Pagefind at the end of the build to index the generated HTML, emitting `dist/pagefind/*` which powers in-browser search at runtime.
6. Output is written to `dist/docs/<slug>/index.html` plus `dist/docs/index.html` for the docs landing page.

**Content pipeline (MDX/MD → Starlight → HTML)**

Markdown / MDX file in `src/content/docs/docs/` → content collection loader → Starlight page layout (applies sidebar, TOC, header, footer, prev/next) → Astro compiler (renders MDX, lowers scoped styles) → HTML + hashed JS/CSS assets in `dist/_assets/` → Pagefind indexer → static files under `dist/docs/<slug>/`.

**Release metadata flow**

1. External release tooling POSTs a `repository_dispatch` event of type `new-release` with a JSON payload (`tag`, `version`, `download_url`, `download_size_bytes`, `sha256`, `notes_markdown`, `released_at`, `delta_urls`).
2. `.github/workflows/new-release.yml` writes the payload to `src/data/latest-release.json` and merges it into `src/data/releases.json` (deduping by `version`).
3. The workflow commits the change on `main` with message `chore(release): <tag>`.
4. Cloudflare Pages detects the push and triggers `npm run build`.
5. `Hero.astro` reads the new JSON and the rendered `dist/index.html` contains the updated version string and download size.

**State Management:**
- None. The site has no client-side state management. The Starlight theme toggle and sidebar use Starlight's built-in client logic; no application state is persisted or hydrated.

## Key Abstractions

**Astro component (`.astro`)**
- Purpose: Server-rendered component with a frontmatter script block and a template; scoped `<style>` blocks are extracted at build time.
- Examples: `src/components/Hero.astro`, `src/components/Nav.astro`, `src/layouts/Base.astro`, `src/pages/index.astro`.
- Pattern: Frontmatter (between `---` fences) runs at build time; the template emits HTML. No runtime JavaScript is shipped unless a `<script>` tag is present (none are in this repo).

**Starlight content collection entry**
- Purpose: A Markdown/MDX file whose frontmatter is validated by `docsSchema()` and whose body is rendered by Starlight's page layout.
- Examples: `src/content/docs/docs/getting-started.md`, `src/content/docs/docs/mcp-tools.md`.
- Pattern: YAML frontmatter with `title` and `description`, optional MDX imports such as `import { Tabs, TabItem } from '@astrojs/starlight/components';`, body written in Markdown/MDX.

**Sidebar configuration**
- Purpose: Static, inline list that controls the left-hand navigation of the docs site.
- Location: `astro.config.mjs` — the `sidebar` array passed to `starlight()`.
- Pattern: Each entry is `{ label, slug }` where `slug` is the content collection slug (for example `docs/getting-started` resolves to `src/content/docs/docs/getting-started.md`).

**Design tokens (CSS custom properties)**
- Purpose: Single source of truth for colour, spacing, typography, and layout metrics used across marketing components.
- Location: `src/styles/global.css` (`:root` block at the top).
- Pattern: Components reference `var(--bg-surface)`, `var(--accent)`, `var(--space-lg)`, etc. Starlight's palette is remapped to the same physical colours in `src/styles/starlight.css` by reassigning Starlight's own `--sl-color-*` variables.

**Release metadata JSON**
- Purpose: Typed-ish, build-time data contract between the external release pipeline and the site.
- Location: `src/data/latest-release.json` (single latest release), `src/data/releases.json` (full history).
- Pattern: Static JSON imported directly by `Hero.astro`. Fields: `tag`, `version`, `download_url`, `download_size_bytes`, `sha256`, `notes_markdown`, `released_at`, `delta_urls`.

## Entry Points

**Build entry — landing page**
- Location: `src/pages/index.astro`
- Triggers: Astro's file-based router at build time.
- Responsibilities: Compose the marketing page from `Base` + `Nav`/`Hero`/`HowItWorks`/`Features`/`Architecture`/`Footer`, setting the `<title>` and description that populate `<head>` metadata.

**Build entry — documentation**
- Location: `src/content/docs/docs/index.md` (root docs landing) plus every sibling `.md` file.
- Triggers: The `starlight()` integration expands the `docs` content collection into routes under `/docs/`.
- Responsibilities: Each file declares its own title/description in frontmatter; Starlight wraps the content with navigation, TOC, and search UI.

**Build configuration entry**
- Location: `astro.config.mjs`
- Triggers: `astro dev`, `astro build`, `astro preview`.
- Responsibilities: Set `site: 'https://covalence.app'`, force `output: 'static'`, rename the build asset directory to `_assets`, register the `starlight()` integration with title, description, custom CSS, empty social list, and the sidebar.

**Content collection entry**
- Location: `src/content.config.ts`
- Triggers: Astro's content layer at build time.
- Responsibilities: Declare the `docs` collection with Starlight's loader and schema so Astro knows how to discover and validate docs files.

**Release ingestion entry**
- Location: `.github/workflows/new-release.yml`
- Triggers: `repository_dispatch` event with `types: [new-release]`.
- Responsibilities: Rewrite `src/data/latest-release.json`, merge into `src/data/releases.json`, commit to `main` so Cloudflare Pages rebuilds.

## Error Handling

**Strategy:** Build-time only. Content and data errors surface as build failures rather than runtime errors, because there is no runtime.

**Patterns:**
- Starlight's `docsSchema()` validates doc frontmatter; missing or malformed `title` / `description` fails the build.
- TypeScript strict mode (`astro/tsconfigs/strict` via `tsconfig.json`) catches type errors in `.astro` frontmatter scripts and `.ts` config files.
- Cloudflare Pages `public/_routes.json` excludes `/releases/*` and `/appcast.xml` from Pages routing, which is how external binary downloads are kept off the site's origin.
- `Hero.astro` assumes `src/data/latest-release.json` exists and is well-formed; if it is missing the build fails at import time, which is the intended fail-fast behaviour.

## Cross-Cutting Concerns

**Logging:** None at runtime. Build output goes to stdout via the `astro` CLI. GitHub Actions logs capture the release-ingestion workflow.

**Validation:**
- Doc frontmatter via `docsSchema()` in `src/content.config.ts`.
- No runtime form or input validation (there are no forms).

**Authentication:** None. The site is fully public and has no authenticated surfaces.

**Search:** Starlight bundles Pagefind and generates a static search index under `dist/pagefind/` at build time. The in-browser search UI is Starlight's default component — no configuration beyond enabling Starlight.

**SEO and social metadata:** `src/layouts/Base.astro` sets `<title>`, canonical URL (from `Astro.url.pathname` + `Astro.site`), Open Graph tags, and Twitter card tags. The OG image is `public/og-image.png` served at an absolute URL built from `Astro.site`. Starlight pages use Starlight's own metadata conventions driven by frontmatter.

**Typography and fonts:** Self-hosted via `public/fonts/*.woff2`. `@font-face` declarations live in `src/styles/global.css`; critical weights (Inter 400 and 600) are `<link rel="preload">`ed in `Base.astro`. `src/styles/starlight.css` remaps `--sl-font` and `--sl-font-mono` to the same families so docs and marketing pages share typography. The `@fontsource/inter` and `@fontsource/jetbrains-mono` dev dependencies supply the source `.woff2` files but are not imported into the runtime bundle.

**Theming:** A unified dark palette is defined once in `src/styles/global.css` (marketing) and re-applied to Starlight variables in `src/styles/starlight.css` (docs), so both surfaces look visually consistent despite using different layout systems.

---

*Architecture analysis: 2026-04-18*

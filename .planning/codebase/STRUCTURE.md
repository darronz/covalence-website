# Codebase Structure

**Analysis Date:** 2026-04-18

## Directory Layout

```
covalence-website/
├── astro.config.mjs                  # Astro + Starlight configuration (site, output, integrations, sidebar)
├── package.json                      # Dependencies, scripts, Node engine pin (>=22.12.0)
├── package-lock.json                 # npm lockfile (committed)
├── tsconfig.json                     # Extends astro/tsconfigs/strict, includes generated .astro/types.d.ts
├── .nvmrc                            # Pinned Node version (22.16.0) for CI/CF Pages determinism
├── .gitignore                        # Ignores dist/, .astro/, node_modules/, env files
├── .github/
│   └── workflows/
│       └── new-release.yml           # repository_dispatch handler that writes src/data/*.json
├── .vscode/
│   ├── extensions.json               # Recommends astro-build.astro-vscode
│   └── launch.json                   # "Development server" launch config (astro dev)
├── .astro/                           # Generated — Astro content-collection types (gitignored)
├── .planning/                        # GSD planning documents (this directory)
├── public/                           # Static assets copied verbatim to site root
│   ├── _routes.json                  # Cloudflare Pages routing excludes (/releases/*, /appcast.xml)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── app-icon.svg
│   ├── co-logo.svg
│   ├── icon.png
│   ├── og-image.png
│   ├── og-image.svg
│   └── fonts/
│       ├── inter-latin-400.woff2
│       ├── inter-latin-600.woff2
│       ├── inter-latin-700.woff2
│       └── jetbrains-mono-latin-400.woff2
├── src/
│   ├── content.config.ts             # Registers the `docs` Starlight collection
│   ├── pages/
│   │   └── index.astro               # Marketing landing page at /
│   ├── layouts/
│   │   └── Base.astro                # HTML shell for the marketing page
│   ├── components/
│   │   ├── Nav.astro                 # Fixed top nav + logo + download CTA
│   │   ├── Hero.astro                # Headline, download CTA, version/size (reads latest-release.json)
│   │   ├── HowItWorks.astro          # Two-step onboarding with code samples
│   │   ├── Features.astro            # Feature grid (semantic search, core memories, etc.)
│   │   ├── Architecture.astro       # "Under the hood" stack list + privacy statement
│   │   └── Footer.astro              # Download CTA band + footer links + copyright
│   ├── content/
│   │   └── docs/
│   │       └── docs/                 # Starlight collection root — produces /docs/<slug>/
│   │           ├── index.md
│   │           ├── getting-started.md
│   │           ├── spaces.md
│   │           ├── core-memories.md
│   │           ├── mcp-tools.md
│   │           ├── ai-instruction.md
│   │           └── keyboard-shortcuts.md
│   ├── data/
│   │   ├── latest-release.json       # Current release metadata (consumed by Hero at build time)
│   │   └── releases.json             # Append-only history of releases
│   └── styles/
│       ├── global.css                # Design tokens, resets, shared utilities, @font-face
│       └── starlight.css             # Overrides for Starlight's --sl-color-* / --sl-font variables
└── dist/                             # Build output (gitignored) — static HTML, _assets/, pagefind/
```

## Directory Purposes

**`astro.config.mjs`**
- Purpose: Single source of build configuration.
- Key settings: `site: 'https://covalence.app'`, `output: 'static'`, `build.assets: '_assets'`, the `starlight(...)` integration with `title`, `description`, `customCss`, empty `social`, and a hard-coded `sidebar` array.

**`public/`**
- Purpose: Files served verbatim at the site root. Everything here is copied into `dist/` during build.
- Contains: Favicons, logos, OG images, self-hosted web fonts, Cloudflare Pages routing hints.
- Key files: `public/_routes.json` (CF Pages excludes), `public/fonts/*.woff2` (referenced by `@font-face` in `src/styles/global.css`).

**`src/pages/`**
- Purpose: File-based routes for Astro. Any `.astro`, `.md`, or `.mdx` file here becomes a page at the matching URL.
- Contains: `src/pages/index.astro` only — the marketing landing page.
- Note: Documentation routes are NOT in this directory. They are generated from the `docs` content collection by Starlight.

**`src/layouts/`**
- Purpose: Reusable HTML shells for pages.
- Contains: `Base.astro` — the layout for the marketing page (head metadata, OG tags, font preloads, body slot). Starlight pages bypass this layout and use Starlight's own internal layouts.

**`src/components/`**
- Purpose: Marketing-page section components. Each file is a full landing-page section with its own scoped `<style>` block.
- Contains: `Nav.astro`, `Hero.astro`, `HowItWorks.astro`, `Features.astro`, `Architecture.astro`, `Footer.astro`.
- Key files: `src/components/Hero.astro` imports `src/data/latest-release.json` and is the only component reading dynamic build-time data.

**`src/content/docs/`**
- Purpose: Root of the Starlight `docs` content collection (required by Starlight's loader).
- Contains: A single `docs/` subdirectory. Starlight serves collection entries under `/` by default, so `src/content/docs/docs/getting-started.md` is served at `/docs/getting-started/`. The nested `docs/docs` structure is intentional.
- Key files: All `.md` files listed in the sidebar config inside `astro.config.mjs`.

**`src/data/`**
- Purpose: Build-time JSON consumed by components via `import`.
- Contains: `latest-release.json` (single most recent release), `releases.json` (full history).
- Written by: `.github/workflows/new-release.yml` on `repository_dispatch` events.

**`src/styles/`**
- Purpose: Global CSS split into two concerns — marketing design tokens and Starlight overrides.
- Contains:
  - `global.css` — tokens (`--bg-primary`, `--accent`, `--space-*`, `--font-sans`, `--font-mono`), resets, `.container`/`.section`/`.btn`/`.section-title` utilities, `@font-face` for Inter and JetBrains Mono.
  - `starlight.css` — remaps Starlight's `--sl-color-*` and `--sl-font` variables to the brand palette. Registered through `starlight({ customCss: ['./src/styles/starlight.css'] })`.

**`src/content.config.ts`**
- Purpose: Type-safe registration of Astro content collections.
- Contains: One export, `collections`, declaring the `docs` collection with `docsLoader()` and `docsSchema()` from `@astrojs/starlight`.

**`.github/workflows/`**
- Purpose: CI automation. The single workflow ingests release metadata into `src/data/*.json`.

**`.astro/`**
- Purpose: Generated TypeScript definitions for content collections and Astro globals.
- Generated: Yes (by `astro dev` / `astro build`).
- Committed: No (`.gitignore` excludes it).

**`dist/`**
- Purpose: Build output consumed by Cloudflare Pages.
- Generated: Yes (by `astro build`).
- Committed: No (`.gitignore` excludes it).
- Notable subdirectories when built: `dist/_assets/` (hashed CSS/JS), `dist/docs/<slug>/index.html` per doc page, `dist/pagefind/` (static search index), `dist/sitemap-0.xml` + `dist/sitemap-index.xml`.

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Marketing landing page composed from `Base` + six section components.
- `src/content/docs/docs/index.md`: Docs landing page rendered by Starlight.
- `astro.config.mjs`: Build configuration and Starlight sidebar.
- `src/content.config.ts`: Content collection registration.

**Configuration:**
- `astro.config.mjs`: Site URL, static output, Starlight integration, sidebar.
- `tsconfig.json`: Extends `astro/tsconfigs/strict`; includes generated `.astro/types.d.ts`.
- `.nvmrc`: `22.16.0` for reproducible builds on CI and Cloudflare Pages.
- `package.json`: Node engine `>=22.12.0`; scripts `dev`, `build`, `preview`, `astro`.
- `public/_routes.json`: Cloudflare Pages routing exclusions (`/releases/*`, `/appcast.xml`).

**Core Logic:**
- `src/components/Hero.astro`: Only component with build-time data logic (reads JSON, formats MB size).
- `src/layouts/Base.astro`: Builds canonical URL and OG metadata from `Astro.url` + `Astro.site`.
- `.github/workflows/new-release.yml`: Produces the release JSON that the Hero consumes.

**Styling:**
- `src/styles/global.css`: Design tokens and marketing CSS.
- `src/styles/starlight.css`: Docs theme overrides.

**Content:**
- `src/content/docs/docs/*.md`: All user-facing documentation.
- `src/data/latest-release.json` / `src/data/releases.json`: Release metadata.

**Testing:**
- None. There is no test runner, test directory, or test configuration in the repository.

## Naming Conventions

**Files:**
- Astro components: `PascalCase.astro` (for example `Hero.astro`, `HowItWorks.astro`).
- Layouts: `PascalCase.astro` under `src/layouts/`.
- Pages: lowercase file names matching the URL segment (`index.astro`).
- Docs content: lowercase kebab-case Markdown files (`getting-started.md`, `core-memories.md`, `keyboard-shortcuts.md`).
- Config files: lowercase with extension convention (`astro.config.mjs`, `content.config.ts`, `tsconfig.json`).
- Data files: lowercase kebab-case JSON (`latest-release.json`, `releases.json`).
- Styles: lowercase single-word filenames (`global.css`, `starlight.css`).

**Directories:**
- All lowercase (`components`, `content`, `data`, `layouts`, `pages`, `styles`, `public`).
- The `src/content/docs/docs/` doubling is deliberate: the outer `docs/` is the Starlight content collection name, and the inner `docs/` is the URL segment under which the docs are served.

**CSS custom properties:**
- Design tokens use `--kebab-case` (`--bg-primary`, `--text-secondary`, `--space-lg`, `--nav-height`).
- Starlight overrides follow Starlight's own `--sl-color-*`, `--sl-font`, `--sl-font-mono` naming.

**Sidebar slugs (`astro.config.mjs`):**
- `docs/<kebab-case-filename-without-extension>` — mirrors the content collection path.

## Where to Add New Code

**New marketing section on the landing page:**
- Create `src/components/<PascalCase>.astro` with a scoped `<style>` block.
- Import and place it inside `<main>` in `src/pages/index.astro`.
- Use design tokens from `src/styles/global.css` (`var(--accent)`, `var(--space-lg)`, `.container`, `.section`, `.section-title`).

**New marketing page (not a doc):**
- Add `src/pages/<route>.astro`.
- Wrap content in `<Base title="…" description="…">` from `src/layouts/Base.astro` to get shared `<head>` metadata and fonts.
- The page is automatically emitted at `/<route>/`.

**New documentation page:**
- Add `src/content/docs/docs/<slug>.md` (or `.mdx` if you need imports such as `Tabs`, `TabItem`).
- Frontmatter must include `title` and `description` (validated by `docsSchema()`).
- Add a matching entry to the `sidebar` array in `astro.config.mjs` as `{ label: 'Display Name', slug: 'docs/<slug>' }` — pages are NOT auto-added to the sidebar.

**New MDX doc with tabs / other Starlight components:**
- Rename the file to `.mdx`.
- Import from the package: `import { Tabs, TabItem } from '@astrojs/starlight/components';` (see `src/content/docs/docs/getting-started.md`).

**New shared design token:**
- Add the CSS variable to the `:root` block at the top of `src/styles/global.css`.
- If the token should also apply inside the docs theme, mirror the Starlight variable assignment in `src/styles/starlight.css`.

**New release metadata field:**
- Update the CI-produced shape in `.github/workflows/new-release.yml` (the workflow writes whatever `client_payload` fields are sent).
- Consume the new field in `src/components/Hero.astro` or any other component that imports the JSON.

**New static asset (image, font, binary artefact):**
- Place it in `public/` (e.g. `public/images/screenshot.png`) and reference it via an absolute URL (`/images/screenshot.png`).
- For fonts, also add a corresponding `@font-face` rule in `src/styles/global.css` and a `<link rel="preload">` in `src/layouts/Base.astro` if it is critical.

**Utilities / helpers:**
- None currently exist. If a shared TypeScript helper becomes necessary, the idiomatic placement is `src/utils/<name>.ts`. Nothing in the repository blocks this, but no such file exists today.

## Special Directories

**`.astro/`**
- Purpose: Astro's generated type definitions and content-collection caches.
- Generated: Yes.
- Committed: No.

**`dist/`**
- Purpose: Static build output for Cloudflare Pages.
- Generated: Yes.
- Committed: No.
- Expected contents after `npm run build`: `index.html` (marketing page), `docs/<slug>/index.html` (one per doc), `_assets/*.css` and `_assets/*.js` (Starlight runtime + scoped component CSS), `pagefind/*` (search index), `sitemap-index.xml` + `sitemap-0.xml`, plus every file copied from `public/`.

**`node_modules/`**
- Purpose: npm-installed dependencies (`astro`, `@astrojs/starlight`, `@fontsource/*`).
- Generated: Yes.
- Committed: No.

**`.planning/`**
- Purpose: GSD workflow scratchpad (plans, codebase maps, phase notes). Not part of the website output.
- Generated: Yes (by GSD commands).
- Committed: Yes.

**`public/releases/` (absent)**
- The `public/_routes.json` file excludes `/releases/*` from Cloudflare Pages routing, meaning DMG downloads at `https://covalence.app/releases/Covalence-latest.dmg` are served from a different origin (for example R2 or direct GitHub redirect) rather than from the built site. Do not add files to a `public/releases/` directory — the exclusion takes effect before any static file lookup.

---

*Structure analysis: 2026-04-18*

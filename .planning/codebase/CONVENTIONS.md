# Coding Conventions

**Analysis Date:** 2026-04-18

This project is an Astro + Starlight static marketing site. Conventions are inferred from the actual files in the repo — there is no ESLint, Prettier, Biome, or EditorConfig configuration committed. What follows is the _de facto_ style the existing files already follow; new contributions should stay consistent with it.

## Naming Patterns

**Astro components (`src/components/*.astro`):**
- `PascalCase.astro` — e.g. `Hero.astro`, `Nav.astro`, `HowItWorks.astro`, `Architecture.astro`, `Features.astro`, `Footer.astro`
- One component per file
- File name matches the logical section it renders

**Layouts (`src/layouts/*.astro`):**
- `PascalCase.astro` — e.g. `Base.astro`

**Pages (`src/pages/*.astro`):**
- `lowercase.astro` matching the URL segment — e.g. `index.astro` for `/`

**Content collections (`src/content/docs/docs/*.md`):**
- `kebab-case.md` — e.g. `getting-started.md`, `core-memories.md`, `mcp-tools.md`, `ai-instruction.md`, `keyboard-shortcuts.md`
- `index.md` used as the collection landing page

**Data files (`src/data/*.json`):**
- `kebab-case.json` — `latest-release.json`, `releases.json`
- JSON keys use `snake_case` (e.g. `download_size_bytes`, `download_url`, `released_at`, `notes_markdown`)

**CSS files (`src/styles/*.css`):**
- `lowercase.css` — `global.css`, `starlight.css`

**Config files:**
- Root-level `astro.config.mjs`, `tsconfig.json`, `content.config.ts` — Astro's default names

## Code Style

**Formatting:**
- No Prettier/Biome/ESLint config exists. Formatting is manually consistent across files.
- 2-space indentation throughout (`.astro`, `.css`, `.json`, `.ts`, `.mjs`)
- Single quotes for JS/TS strings: `import Base from '../layouts/Base.astro';`
- Double quotes for HTML attributes: `<section class="hero">`
- Semicolons in JS/TS — see `src/layouts/Base.astro`, `src/components/Hero.astro`, `src/pages/index.astro`
- Trailing commas in multi-line object/array literals (see the `features` array in `src/components/Features.astro:2-33`)
- Blank line between the Astro frontmatter fence and the template

**Linting:**
- None configured. TypeScript strictness is delegated entirely to `astro/tsconfigs/strict` via `tsconfig.json`.

**TypeScript:**
- `tsconfig.json` extends `astro/tsconfigs/strict`
- Includes `.astro/types.d.ts` (generated) and `**/*`, excludes `dist`
- No custom `paths`, `baseUrl`, or compiler overrides — Astro defaults apply
- `src/content.config.ts` uses the Astro Content Layer API (`defineCollection`, `docsLoader`, `docsSchema`) rather than the legacy content config

## Import Organization

**Astro frontmatter imports:**
Order observed in `src/pages/index.astro`:
1. Layouts
2. Components (grouped together, roughly in render order)

Example from `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import HowItWorks from '../components/HowItWorks.astro';
import Features from '../components/Features.astro';
import Architecture from '../components/Architecture.astro';
import Footer from '../components/Footer.astro';
---
```

**Layout imports:**
`src/layouts/Base.astro` imports its global stylesheet first:
```astro
import '../styles/global.css';
```

**Data imports:**
JSON is imported directly as an ES module — see `src/components/Hero.astro:2`:
```astro
import latestRelease from '../data/latest-release.json';
```

**MDX (in Starlight content):**
Starlight components are imported inside `.md` frontmatter-adjacent MDX blocks — see `src/content/docs/docs/getting-started.md:6`:
```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';
```

**Path aliases:**
None configured. All imports use relative paths (`../layouts/`, `../components/`, `../data/`, `../styles/`).

## Component Patterns (Astro-specific)

**Frontmatter script block:**
- Opened/closed with `---` fences
- Used only when the component needs imports, props, or computed values
- Components with no script logic omit the fence entirely — see `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/Architecture.astro`, `src/components/HowItWorks.astro`

**Props typing:**
Use a local `interface Props` and destructure from `Astro.props`. See `src/layouts/Base.astro:4-9`:
```astro
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
```

**Slots:**
Default slot only — `<slot />` in `src/layouts/Base.astro:44`. No named slots in use.

**Astro globals:**
- `Astro.props`, `Astro.url`, `Astro.site` used in `src/layouts/Base.astro`
- Canonical URLs built with `new URL(Astro.url.pathname, Astro.site)`

**Inline computed values:**
Small derived values live directly in the frontmatter. Example from `src/components/Hero.astro:4-5`:
```astro
const sizeMb = latestRelease.download_size_bytes / (1024 * 1024);
const sizeStr = sizeMb < 10 ? sizeMb.toFixed(1) : Math.round(sizeMb).toString();
```

**Expressions in templates:**
Single braces, JSX-style: `{title}`, `{sizeStr}`, `{new URL('/og-image.png', Astro.site)}`.

**List rendering:**
Inline `.map()` with parentheses-wrapped JSX return. See `src/components/Features.astro:40-45`:
```astro
{features.map((feature) => (
  <div class="feature-card">
    <h3><span class="feature-icon">{feature.icon}</span>{feature.title}</h3>
    <p>{feature.description}</p>
  </div>
))}
```

**Scoped styles:**
- Every component keeps its CSS in a `<style>` block at the bottom of the file (Astro scopes them automatically).
- Design tokens (colors, spacing, layout) come from CSS custom properties defined in `src/styles/global.css:2-30` (`--bg-primary`, `--accent`, `--space-md`, `--max-width`, etc.). Components reference `var(--...)` rather than hardcoded values.
- Media queries use mobile-last breakpoints: `@media (max-width: 768px)`, `@media (max-width: 640px)`, `@media (max-width: 1024px)`.

**Global styles:**
Only `src/styles/global.css` is global (imported once from `Base.astro`). `src/styles/starlight.css` is passed to Starlight via `customCss` in `astro.config.mjs:14`.

## CSS Conventions

**Design tokens** live at `:root` in `src/styles/global.css:2-30`:
- Colors: `--bg-primary`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--accent-glow`, `--accent-subtle`, `--accent-subtle-hover`, `--border`
- Typography: `--font-sans`, `--font-mono`
- Spacing scale: `--space-xs` through `--space-2xl`
- Layout: `--max-width`, `--nav-height`

**Class naming:**
- Plain lowercase with hyphens — `.hero-inner`, `.feature-grid`, `.code-block`, `.arch-grid`, `.nav-logo-icon`
- No BEM, no utility framework, no CSS modules
- Shared utilities live in `global.css`: `.container`, `.section`, `.section-title`, `.btn`, `.btn-primary`

**Fonts:**
Self-hosted WOFF2 under `public/fonts/` with `@font-face` declarations in `global.css:146-180`. Critical weights (Inter 400, 600) are `<link rel="preload">`-ed in `src/layouts/Base.astro:40-41`.

## Content Authoring Conventions (Starlight MDX/Markdown)

**Frontmatter shape (every doc page):**
```markdown
---
title: Getting Started
description: Connect Covalence to Claude Desktop, Claude Code, or Cursor in under a minute.
---
```
Both `title` and `description` are always present — see every file under `src/content/docs/docs/`.

**Starlight components:**
Imported at the top of the file when used — `<Tabs>` / `<TabItem>` is the only one currently in use (`src/content/docs/docs/getting-started.md:6`).

**Headings:**
- `##` for top-level sections within a page (the frontmatter `title` is the H1)
- `###` for sub-sections
- Never skip a level

**Links:**
- Internal docs: root-relative with trailing slash — `[Spaces](/docs/spaces/)`
- External product assets: absolute URLs — `https://covalence.app/releases/Covalence-latest.dmg`

**Code blocks:**
- Fenced with language hints: ` ```json `, ` ```bash `, ` ```markdown `
- Indented inside `<TabItem>` (4-space indent) so MDX parses correctly — see `src/content/docs/docs/getting-started.md:21-28`

**Tables:**
Pipe-style Markdown tables for API/parameter references — see `src/content/docs/docs/mcp-tools.md:14-21`. Columns: `Parameter | Type | Required | Description`.

**Tone:**
- Second-person, imperative (“Add the following…”, “Then restart…”)
- Short paragraphs, heavy use of bold labels (`**Claude Desktop**`), bulleted lists for options

## Logging / Error Handling

Not applicable. This is a static site with no runtime JavaScript beyond what Astro/Starlight generate; there is no application-level logging or error handling code in the repo.

## Function Design

Virtually no hand-written functions exist. The only JS/TS logic is:
- Two one-liners in `src/components/Hero.astro:4-5` (size formatting)
- Canonical URL construction in `src/layouts/Base.astro:10`
- Content collection definition in `src/content.config.ts`

Keep logic of this kind inline in the Astro frontmatter unless it grows beyond a few lines.

## Module Design

**Exports:**
- `src/content.config.ts` uses a named export (`export const collections`) as required by Astro
- No other `.ts` modules exist in `src/`

**No barrel files.** Components are imported directly from their own files.

## Comments

- CSS uses section-delimiter comments: `/* === Design Tokens === */`, `/* === Reset === */`, `/* === Shared === */`, `/* === Font Loading === */` in `src/styles/global.css`
- Inline CSS comments explain intent of decorative effects — e.g. `/* Atmospheric glow — warm light emerging from darkness */` in `src/components/Hero.astro:49`
- No JSDoc/TSDoc anywhere; the surface area is too small to need it

## Accessibility Conventions

- Every decorative SVG has `aria-hidden="true"` (see `src/components/Nav.astro:4`, `src/components/Hero.astro:27`, `src/components/Footer.astro:6`)
- Meaningful SVGs get `aria-label` — e.g. `aria-label="Covalence logo"` on the hero logo (`src/components/Hero.astro:11`)
- `<nav>` elements carry `aria-label` — `aria-label="Main navigation"` in `src/components/Nav.astro:1`
- Pages declare `<html lang="en">` (`src/layouts/Base.astro:14`)

## Astro-specific Idioms in Use

- **Static output only** — `output: 'static'` in `astro.config.mjs:6`. No SSR, no server endpoints.
- **Custom asset directory** — `build.assets: '_assets'` in `astro.config.mjs:7-9` (keeps built asset paths out of the way of `public/releases/` on Cloudflare Pages).
- **Starlight integration** — `src/content/docs/` is Starlight-owned; marketing pages live in `src/pages/` and share only `src/layouts/Base.astro` / `src/styles/global.css`.
- **Sidebar configured in code** — `sidebar` array in `astro.config.mjs:16-23` references docs by slug; contributors adding a new doc page must also add it to the sidebar there.
- **`customCss` for Starlight theming** — `src/styles/starlight.css` overrides Starlight's `--sl-color-*` tokens to match the marketing site's palette.
- **Content Layer API** — `src/content.config.ts` uses `docsLoader()` and `docsSchema()` from `@astrojs/starlight`, not the legacy `defineCollection({ type: 'content' })` pattern.
- **Data-driven release info** — `src/data/latest-release.json` is committed JSON that's imported directly at build time; it's rewritten by the `new-release.yml` GitHub Action on `repository_dispatch` and re-built via Cloudflare Pages.
- **Preloaded fonts** — `<link rel="preload">` in `src/layouts/Base.astro:40-41` pairs with self-hosted `public/fonts/*.woff2` and `@font-face` in `global.css`.
- **Cloudflare Pages routing hint** — `public/_routes.json` excludes `/releases/*` and `/appcast.xml` from Pages so they're served directly by the R2/DNS-routed download host.

## Where to Add New Code

- **New marketing section on the landing page** → new `PascalCase.astro` in `src/components/`, imported and placed inside `<main>` in `src/pages/index.astro`
- **New top-level marketing page** → new `lowercase.astro` in `src/pages/` using `<Base>` from `src/layouts/Base.astro`
- **New docs page** → new `kebab-case.md` in `src/content/docs/docs/` with `title` + `description` frontmatter, plus a new entry in the `sidebar` array of `astro.config.mjs`
- **New design token** → add it to `:root` in `src/styles/global.css`, then reference as `var(--token-name)` from component `<style>` blocks
- **New piece of release-related data** → extend `src/data/latest-release.json` (and the dispatch payload in `.github/workflows/new-release.yml`) rather than hardcoding in components

---

*Convention analysis: 2026-04-18*

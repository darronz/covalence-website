# Testing Patterns

**Analysis Date:** 2026-04-18

## Summary

**This project has no automated tests.** There is no unit test runner, no component test harness, no integration tests, no end-to-end tests, and no test files anywhere in the repo.

Verified explicitly:

- No `vitest.config.*`, `jest.config.*`, or `playwright.config.*` exist
- No `*.test.*` or `*.spec.*` files exist under `src/` or anywhere else outside `node_modules/`
- `package.json` has no `test` script — only `dev`, `build`, `preview`, and `astro`
- `devDependencies` contain only `@fontsource/inter` and `@fontsource/jetbrains-mono` — no test framework, no assertion library, no mocking library

This is intentional and appropriate for what the project is: a small Astro + Starlight static marketing/documentation site (six components, one landing page, seven Markdown docs, no runtime JavaScript of consequence). The verification strategy is build-time validation plus preview deploys, described below.

## Test Framework

Not applicable — none configured.

## Test File Organization

Not applicable — none exist.

## Test Structure

Not applicable — none exist.

## Mocking

Not applicable — none exist.

## Fixtures and Factories

Not applicable — none exist.

## Coverage

Not applicable — no tests, so no coverage. Do not add a coverage target without first adding a test framework and a meaningful number of tests.

## How the Project Is Currently Verified

The whole verification pipeline is:

1. **TypeScript strict checking** — `tsconfig.json` extends `astro/tsconfigs/strict`, which Astro enforces during `astro build` (and in the editor via the Astro VS Code extension recommended in `.vscode/extensions.json`).
2. **`astro build`** — compiles every `.astro`, MDX/Markdown collection entry, and Starlight doc. This is the project's main correctness gate; it fails on:
   - Type errors in component frontmatter
   - Broken internal links between Starlight pages
   - Missing imports (component, JSON data, CSS)
   - Invalid Starlight `docsSchema()` frontmatter (missing `title`, malformed keys)
   - Invalid `astro.config.mjs` sidebar slugs (e.g. pointing at a doc that was moved or deleted)
   - Invalid JSON in `src/data/*.json`
3. **`astro preview`** — local visual check of the production build after `astro build`.
4. **Cloudflare Pages preview deploys** — every push produces a preview URL. Rendering, font loading, Starlight navigation, and the CSS glow effects are verified in a real browser against real Cloudflare routing (including `public/_routes.json` exclusions).
5. **GitHub Actions (`.github/workflows/new-release.yml`)** — on `repository_dispatch: new-release`, writes `src/data/latest-release.json` and merges into `src/data/releases.json`, then commits. Cloudflare Pages rebuilds from that commit and verifies the new JSON parses correctly (because `src/components/Hero.astro` imports it at build time and will fail the build if it's malformed).

### Run commands

```bash
nvm use                # pin to 22.16.0 (.nvmrc)
npm install            # install Astro + Starlight
npm run dev            # local dev server with HMR
npm run build          # production build — the main correctness gate
npm run preview        # serve dist/ locally, verifies the built output
```

There is no `npm test`, `npm run lint`, or `npm run typecheck` — `astro build` covers type checking implicitly.

### What the build catches in practice

- **Broken JSON data files:** `src/components/Hero.astro` statically imports `src/data/latest-release.json` and dereferences `.download_size_bytes` and `.version`. A malformed or missing key fails the build.
- **Missing components:** `src/pages/index.astro` statically imports all six landing-page components; a typo or rename fails the build.
- **Sidebar drift:** `astro.config.mjs:16-23` references doc slugs (`docs/getting-started`, `docs/spaces`, …). Starlight fails the build if a slug doesn't resolve to a collection entry.
- **Starlight frontmatter schema:** `docsSchema()` (invoked in `src/content.config.ts`) validates `title`/`description` on every doc page at build time.
- **TypeScript errors:** Strict mode catches incorrect `Astro.props` destructuring and any TS mistakes in `.astro` frontmatter blocks.

### What the build does NOT catch

- Visual regressions (layout, colors, font rendering) — rely on Cloudflare Pages preview deploys and manual review
- Broken external links (e.g. `https://covalence.app/releases/Covalence-latest.dmg`)
- Accessibility regressions beyond what static analysis would require — verify manually with the browser devtools accessibility panel
- Content accuracy (MCP tool parameter tables in `src/content/docs/docs/mcp-tools.md`, AI instruction text in `ai-instruction.md`) — these must track the actual Covalence app; there is no contract test with the app repo

## Test Types

**Unit tests:** None.
**Component tests:** None. (Astro has no mainstream component-test harness equivalent to React Testing Library in use here.)
**Integration tests:** None.
**End-to-end tests:** None. No Playwright/Cypress config.
**Visual regression tests:** None. Visual review is manual via Cloudflare Pages preview URLs.

## Common Patterns

None — there is nothing to pattern-match.

## If Tests Are Added Later

Given the stack (Astro 6, static-only, tiny component surface), the pragmatic additions would be, in rough order of payoff:

1. **Link checker** — run against `dist/` after `astro build` in CI to catch broken internal and outbound links.
2. **Playwright smoke test** — one script that loads `/` and `/docs/`, asserts headings and the presence of the download button. Cheap to maintain and catches real regressions.
3. **JSON schema validation** — validate `src/data/latest-release.json` and `src/data/releases.json` shape in CI to harden the `repository_dispatch` pipeline in `.github/workflows/new-release.yml`.
4. **Vitest** — only if meaningful JS/TS logic starts living in the repo (currently there is essentially none). Avoid adding a test framework purely for ceremony.

Do not introduce a test framework without a real regression to pin down — the current verification strategy (strict build + preview deploy) is sufficient for a site this size.

---

*Testing analysis: 2026-04-18*

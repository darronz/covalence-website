# Codebase Concerns

**Analysis Date:** 2026-04-18

This is an Astro + Starlight static marketing/docs site for Covalence. The codebase is small, clean, and free of TODO/FIXME/HACK markers. The concerns below are real, evidence-based risks the team will want to address as the site grows, particularly around CI gating, content drift between release data and UI, SEO/OG parity with Starlight, and test/lint absence.

## Tech Debt

**No linting or formatting tooling configured:**
- Issue: `package.json` has no `lint`, `format`, `typecheck`, or `check` scripts. No `.eslintrc*`, `.prettierrc*`, `eslint.config.*`, or `biome.json` exist. Contributors rely entirely on editor defaults and TypeScript's `strict` tsconfig for safety.
- Files: `package.json`, project root (no config files present)
- Impact: Style drift, easy-to-miss type errors, and no shared enforcement. `astro check` is not wired up, so TypeScript errors in `.astro` files (including `Hero.astro`'s JSON import) are only caught at build time, not in a dedicated check step.
- Fix approach: Add `astro check` via a `typecheck` script (`"typecheck": "astro check"`), add Prettier with the Astro plugin, and optionally ESLint. Wire into CI.

**Unpinned font dependencies in `devDependencies` with self-hosted copies:**
- Issue: `@fontsource/inter` and `@fontsource/jetbrains-mono` are declared in `package.json` but the built site serves `.woff2` files manually copied into `public/fonts/` and referenced via `@font-face` in `src/styles/global.css`. The fontsource packages are not actually imported anywhere in source.
- Files: `package.json:19-20`, `public/fonts/`, `src/styles/global.css:146-180`
- Impact: Two sources of truth for fonts. If a fontsource version bump ships fixed subsets or filenames, the self-hosted `public/fonts/*.woff2` won't change, so the dependency buys nothing and adds install/update noise. A contributor might also `import '@fontsource/inter'` and double-load fonts.
- Fix approach: Either remove the fontsource packages (fonts are fully self-hosted already) or switch to importing them and drop the manual `public/fonts/*.woff2` + `@font-face` block. Pick one mechanism.

**No docs build check in CI:**
- Issue: The release pipeline (`.github/workflows/new-release.yml`) only writes release JSON and commits. Nothing in CI runs `astro build`, `astro check`, or any test on PRs or pushes.
- Files: `.github/workflows/new-release.yml` (the only workflow)
- Impact: A broken `.astro` component or malformed `latest-release.json` can be merged and only fails on the Cloudflare Pages build. The production site deploy becomes the build verification step.
- Fix approach: Add a `ci.yml` workflow on `pull_request` / `push` that runs `npm ci`, `npx astro check`, `npm run build`, and optionally a link-check step.

**`0.0.1` project version in `package.json`:**
- Issue: The website's own `package.json` declares `"version": "0.0.1"` and the project is in active production use. The real product version lives in `src/data/latest-release.json` (`1.3.2`).
- Files: `package.json:4`
- Impact: Minor — misleading for anyone inspecting the repo or publishing artifacts. Harmless since nothing is published to npm, but worth aligning with the website release cadence or marking as `"private": true`.
- Fix approach: Add `"private": true` to the root `package.json` and either remove `version` or bump it deliberately per release.

## Known Bugs

**Landing page `index.html` is missing the sitemap `<link>` and `og:site_name` that Starlight pages emit:**
- Symptoms: `dist/index.html` (generated from `src/pages/index.astro` → `src/layouts/Base.astro`) has OG and Twitter tags but no `<link rel="sitemap" href="/sitemap-index.xml">` and no `<meta property="og:site_name">`. Starlight-rendered pages under `/docs/*` have both.
- Files: `src/layouts/Base.astro:15-42`, compared with `dist/docs/index.html` head
- Trigger: Any SEO/social crawler hitting `/` gets slightly less metadata than pages under `/docs/`.
- Workaround: Add `<link rel="sitemap" href="/sitemap-index.xml">` and `<meta property="og:site_name" content="Covalence">` to `Base.astro`. Consider also adding `<meta property="og:locale" content="en_US">` for parity.

**Hero size formatting breaks for small DMGs (<1 MB):**
- Symptoms: `src/components/Hero.astro:4-5` computes `sizeMb = bytes / (1024*1024)` and renders `~{sizeMb.toFixed(1)} MB` when `<10`. If a future release reports `download_size_bytes < ~100_000`, this still shows `~0.1 MB` which is fine, but the label is hardcoded to `MB` — a 1.5 GB installer would render as `~1500 MB` rather than `~1.5 GB`.
- Files: `src/components/Hero.astro:4-5, 35`
- Trigger: Installer grows past ~1 GB (not imminent; current is 261 MB) or shrinks dramatically.
- Workaround: Add a GB bucket in the size formatter, or extract into a small util with units (`KB`/`MB`/`GB`).

**No validation that `latest-release.json` payload shape is intact:**
- Symptoms: `src/components/Hero.astro` imports `latest-release.json` and reads `version` and `download_size_bytes` directly. If the `repository_dispatch` client payload is malformed (missing `download_size_bytes`, or `version` is unset), `jq '.'` in the workflow will still write the file, and the build will either produce `NaN MB` or fail with `undefined`.
- Files: `.github/workflows/new-release.yml:17-22`, `src/components/Hero.astro:1-5`
- Trigger: A caller of `repository_dispatch` sends an incomplete or renamed payload.
- Workaround: Validate the JSON shape in the workflow before commit (e.g., `jq -e 'has("version") and has("download_size_bytes") and has("download_url")'`) and fail the job early. Optionally define a Zod or Astro content-collection schema for the file and import through that.

**macOS version string hardcoded in UI (`macOS 15+`) disconnected from release metadata:**
- Symptoms: `src/components/Hero.astro:35` hardcodes "macOS 15+". If a future release raises the minimum to macOS 16, someone has to remember to update the component. The release payload has no `min_os` field to drive this.
- Files: `src/components/Hero.astro:35`, `src/content/docs/docs/getting-started.md:12` (also hardcodes "macOS 15 or later")
- Trigger: Minimum OS requirement changes.
- Workaround: Add `min_os` to the release payload schema and drive both sites from it.

## Security Considerations

**No CSP, Permissions-Policy, or other security headers defined:**
- Risk: The site is pure static hosting on Cloudflare Pages; there is no `_headers` file in `public/` or any CSP meta tag in `src/layouts/Base.astro`. A compromised dependency that injects a third-party script (or a content author adding unintended `<script>` via MDX) would run unrestricted.
- Files: `public/` (no `_headers`), `src/layouts/Base.astro:13-42` (no CSP meta)
- Current mitigation: Site is entirely static, no user input, no analytics, no third-party scripts. Starlight ships its own small inline scripts for theming and search, which a strict CSP would need to allow.
- Recommendations: Add `public/_headers` with at minimum:
  - `Content-Security-Policy` (starlight needs `'unsafe-inline'` for its theme init script unless you add hashes)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**SHA-256 of release DMG is present in data but not surfaced to users:**
- Risk: `src/data/latest-release.json` carries `sha256` but no page renders it. Users downloading `Covalence-latest.dmg` have no way to verify integrity from the site. The initial seed value is literally `"seeded-in-phase-12"`, which would mislead anyone who tried to verify against it.
- Files: `src/data/latest-release.json:7`, `src/components/Hero.astro`, `src/components/Footer.astro`
- Current mitigation: macOS Gatekeeper/notarization is the primary integrity story for `.dmg` distribution; the DMG is served from `covalence.app` over HTTPS.
- Recommendations: Either (a) render the SHA-256 under the hero / on a releases page alongside a verify command, or (b) drop `sha256` from the schema if it's not going to be exposed. The current middle state ("data exists, looks legitimate, but is a placeholder string") is the worst of both worlds.

**`persist-credentials: true` on `actions/checkout` in the release workflow:**
- Risk: `.github/workflows/new-release.yml:13-15` checks out with credentials persisted so that `git-auto-commit-action` can push back. Any step between checkout and commit that runs untrusted input could in principle read the token from `.git/config`. Input is `github.event.client_payload`, which is attacker-controlled in the sense that whoever can trigger `repository_dispatch` (a PAT holder) controls it.
- Files: `.github/workflows/new-release.yml:13-22, 36-40`
- Current mitigation: The only untrusted input is passed via env var `PAYLOAD` and piped into `jq '.'`, which does not execute it. `repository_dispatch` itself is gated by a PAT with `repo` scope.
- Recommendations: Keep as-is but add a guard step that rejects payloads with unexpected keys or shell-metacharacter versions (e.g., validate `client_payload.tag` matches `^v?[0-9]+\.[0-9]+\.[0-9]+$`). Consider using `GITHUB_TOKEN` with a deploy-via-PR flow instead of direct push if audit trail matters.

**`repository_dispatch` PAT scope is opaque from this repo:**
- Risk: Whatever PAT triggers the `new-release` event has to have `repo` scope on this repository. The token lives in the caller (the product repo) and is not visible here, so this repo can't enforce minimum scope or rotation.
- Files: `.github/workflows/new-release.yml:2-4`
- Recommendations: Document in a README or internal runbook which secret/PAT is expected, the required scope (`repo`), and the rotation cadence. Consider switching to a GitHub App with narrow `contents: write` on this repo only.

## Performance Bottlenecks

No measurable performance bottlenecks — the site is static, pages are small, fonts are subset and self-hosted with `font-display: swap`, OG image is 88 KB, and the `icon.png` at 124 KB is the largest asset that ships. The only minor note:

**`icon.png` (124 KB) is shipped but never referenced in the rendered HTML:**
- Problem: `public/icon.png` is 124 KB. `Grep`ing the source shows no reference to it in `.astro`, `.md`, or CSS. It's included only by virtue of being in `public/`.
- Files: `public/icon.png`
- Cause: Appears to be a leftover from `feat: Co swirl logo, app icon, and dynamic CDN latest redirect` (commit `f430420`). The visible favicon/app icon is the SVG at `public/favicon.svg` / `public/app-icon.svg`.
- Improvement path: Verify whether any external redirect or manifest references it; if not, delete it.

## Fragile Areas

**Hard-coded DMG URLs in three components plus three markdown docs:**
- Files: `src/components/Nav.astro:13`, `src/components/Hero.astro:26`, `src/components/Footer.astro:5, 18`, `src/content/docs/docs/index.md:10`, `src/content/docs/docs/getting-started.md:13`
- Why fragile: The string `https://covalence.app/releases/Covalence-latest.dmg` (and the bare `/releases/Covalence-latest.dmg` variant in `Footer.astro:18`) is duplicated across 6 locations. If the CDN path changes, every consumer must be updated individually. The `latest-release.json` file already carries `download_url` pointing at a versioned DMG, but no component uses it — they all hardcode the `-latest.dmg` alias.
- Safe modification: Centralize the download URL (and optionally version-specific URL) in a single module (`src/data/links.ts` or `src/config.ts`) and import where needed. Decide deliberately whether the UI links to `-latest.dmg` (always-fresh but unverifiable version) or the versioned `download_url` from the release JSON (matches what's displayed).
- Test coverage: None.

**`Footer.astro` footer link uses relative `/releases/Covalence-latest.dmg` but every other CTA uses absolute `https://covalence.app/...`:**
- Files: `src/components/Footer.astro:18` vs `src/components/Footer.astro:5`, `src/components/Hero.astro:26`, `src/components/Nav.astro:13`
- Why fragile: If the site is ever served from a preview URL (e.g., Cloudflare Pages preview deploy `*.pages.dev`), the relative link will try to fetch the DMG from the preview host, which won't have `/releases/*` (it's excluded in `public/_routes.json`). The absolute links bypass this issue.
- Safe modification: Pick one convention — all absolute, or all relative — and apply consistently. Given `public/_routes.json` explicitly excludes `/releases/*` from Pages routing, the intent is clearly that Cloudflare's origin serves those at `covalence.app` directly, so all absolute is the safer default.

**Content collection is defined but only `docs` is modeled — `data/*.json` is a raw import:**
- Files: `src/content.config.ts:5-10`, `src/data/latest-release.json`, `src/data/releases.json`, `src/components/Hero.astro:2`
- Why fragile: `Hero.astro` does `import latestRelease from '../data/latest-release.json'`. TypeScript will infer types from the JSON content at build time, but there is no Zod schema, no validation, and no typed content collection for release data. A change in the CI workflow that omits or renames a field silently produces `undefined`/`NaN` in the UI.
- Safe modification: Define a content collection for `data/*.json` using Astro's `glob()` loader or a custom JSON loader, with a Zod schema:
  ```ts
  const releases = defineCollection({
    loader: file('./src/data/releases.json'),
    schema: z.object({ version: z.string(), download_size_bytes: z.number(), ... })
  });
  ```
  Then `getCollection('releases')` gives typed, validated data.
- Test coverage: None.

**Starlight sidebar slugs hardcoded in `astro.config.mjs`:**
- Files: `astro.config.mjs:16-23`
- Why fragile: Adding a new doc file means editing `astro.config.mjs` and creating `src/content/docs/docs/*.md`. Starlight supports `autogenerate: { directory: 'docs' }` which would remove the duplication. The slugs also carry a redundant `docs/` prefix (`slug: 'docs/getting-started'`) because the content lives under `src/content/docs/docs/*.md` — double-nesting that sidebar config tolerates but that's easy to get wrong.
- Safe modification: Either collapse the directory to `src/content/docs/*.md` and drop the `docs/` prefix, or switch the sidebar to `autogenerate`.

**`HowItWorks.astro` contains an escaped JSX-style template literal inside `<pre><code>`:**
- Files: `src/components/HowItWorks.astro:13-19, 29-33`
- Why fragile: The content is wrapped in `{`...`}` template literal expressions inside Astro JSX. This works but is subtle — if the JSON example gains a `${...}` or backtick, it will be evaluated as a template expression. The safer pattern is a fenced code string import or `<Fragment set:html="..." />`.
- Safe modification: Move the snippets to a `.md` or `.json` fixture under `src/data/` and import, or use `set:html` with escaped HTML. Low priority — just a trap for future editors.

## Scaling Limits

**Sitemap is Starlight-generated and excludes the landing page's own anchors:**
- Current capacity: 7 URLs listed in `dist/sitemap-0.xml` (`/`, `/docs/`, and the 6 doc pages).
- Limit: Starlight's sitemap emits every route it controls plus the root. As more standalone `.astro` pages are added (e.g., a `/pricing` page, a `/changelog` page reading `releases.json`), each must be picked up — verify they appear in the generated sitemap.
- Scaling path: If content grows, consider the official `@astrojs/sitemap` integration with explicit config, or verify Starlight's built-in output continues to include non-Starlight pages.

**`releases.json` is a single array, ungrouped, with no archival strategy:**
- Current capacity: 1 entry (`1.3.2`).
- Limit: The `new-release` workflow prepends new versions and dedupes on version (`.github/workflows/new-release.yml:31-34`). Over years of releases this grows unbounded and is shipped in the bundle if ever imported by a `/releases` page.
- Scaling path: If a `/changelog` page consumes this, paginate or archive older entries. At current release cadence this is a non-issue for a long time.

## Dependencies at Risk

**Starlight is pre-1.0 (`^0.38.3`):**
- Risk: Starlight is still on 0.x and makes breaking changes on minor bumps. The caret range `^0.38.3` allows `0.39.x, 0.40.x, ...` which may break. With no CI running `astro build` on PRs, a silent `npm install` in a dev environment could pull a breaking change that only fails on deploy.
- Impact: Sidebar, schema, and custom CSS variables (`src/styles/starlight.css`) all depend on Starlight internals.
- Migration plan: Once CI runs `astro build` on PRs (see tech debt above), this risk is well-contained. Consider pinning to `~0.38.3` (patch-only) until post-1.0.

**Astro `^6.1.6`:**
- Risk: Major version Astro releases do introduce breaking config changes. Caret range tolerates `6.x` but with no CI build check, a new minor with subtle breakage would be caught only at deploy.
- Impact: `astro.config.mjs`, content collections, build output.
- Migration plan: CI build check + follow Astro migration notes per minor.

**Cloudflare Pages build pins Node via `.nvmrc` (`22.16.0`) but `package.json` says `">=22.12.0"`:**
- Risk: Local dev and CF Pages will agree (both see `.nvmrc`). A contributor on Node 24 may install and pass locally but produce a different dev experience than production. This is minor.
- Impact: Mostly cosmetic for a static site.
- Migration plan: Tighten `package.json` engines to match `.nvmrc` exactly (`"node": "22.16.0"`) or use `"engines": { "node": "22.x" }`.

## Missing Critical Features

**No `robots.txt`:**
- Problem: `public/` has no `robots.txt`. `dist/` also has none. The `sitemap-index.xml` exists but there is no `robots.txt` to point crawlers at it. Most crawlers will still discover `/sitemap-index.xml` via the `<link rel="sitemap">` tag, but only on Starlight pages (see known bug above) — not from `/`.
- Blocks: Predictable crawl behavior, explicit sitemap discovery, the ability to disallow staging/preview crawls.
- Fix: Add `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://covalence.app/sitemap-index.xml
  ```

**No link-checker / broken-link CI:**
- Problem: The site has internal links (`/docs/getting-started/`, `#how-it-works`) and external links (the DMG URL, docs cross-references). Nothing verifies they resolve.
- Blocks: A typo in a docs link goes undetected until a user reports 404. The DMG URL pointing at `covalence.app/releases/Covalence-latest.dmg` is never probed.
- Fix: Add `lychee`, `linkinator`, or `htmltest` as a CI step against the built `dist/`.

**No tests at all:**
- Problem: Zero test files, no `vitest`/`jest`/`playwright` config. Components like `Hero.astro` that format bytes could easily regress (see "Hero size formatting" bug above).
- Blocks: Confident refactoring, regression safety on release-data parsing.
- Fix: Start with a single `vitest` unit test for a `formatSize(bytes)` helper extracted from `Hero.astro`. A Playwright smoke test that loads `/` and `/docs/` and asserts on the version string and at least one doc heading is cheap insurance.

**No `Base.astro` for Starlight pages is possible — so docs and landing pages share no layout, no OG image for `/docs`:**
- Problem: Starlight pages render with their own layout and do not include the custom `og-image.png`. Only `src/pages/index.astro` (via `Base.astro`) emits `og:image`. Sharing a link to `/docs/getting-started/` on social media uses no image (or falls back to Starlight's default, which is none in this repo).
- Blocks: Consistent social-share previews for docs URLs.
- Fix: Either configure Starlight's `head` option in `astro.config.mjs` to add the OG/Twitter image globally, or use Starlight's `components` override for `Head.astro`.

**Missing `theme-color` meta and structured data:**
- Problem: `src/layouts/Base.astro` has no `<meta name="theme-color" content="#08060d">` (the brand background). No `application/ld+json` structured data for the SoftwareApplication entity (useful for Google rich results on a downloadable app).
- Blocks: Minor SEO upside and nicer mobile browser chrome theming.
- Fix: Add one-line `theme-color` meta and a small `SoftwareApplication` JSON-LD block driven by `latest-release.json`.

## Accessibility Gaps

**Feature cards use emoji as semantic icons without proper labeling:**
- Files: `src/components/Features.astro:4-33, 42`
- What's missing: Emojis (`🔍`, `⭐`, `🔗`, `⚡`, `📌`, `🔒`) are rendered inside `<h3><span class="feature-icon">{icon}</span>{title}</h3>`. Screen readers will announce each emoji's Unicode name ("magnifying glass tilted left", "pushpin", etc.) before the feature title, which is noisy and sometimes nonsensical ("pushpin Always running").
- Risk: Degraded screen-reader experience on the primary marketing page.
- Fix: Wrap the emoji in `<span aria-hidden="true">` and rely on the visible text for semantics. If the icon conveys meaning, add `role="img" aria-label="..."` with a curated label.

**SVG download icon is decorative (`aria-hidden="true"`) but button text is not visually distinct — fine as-is; just note it.** No action needed.

**Nav mobile behavior hides links entirely on narrow viewports:**
- Files: `src/components/Nav.astro:83-87`
- What's missing: `@media (max-width: 640px)` hides every `.nav-links a:not(.btn)`. On mobile, users see only the Download button — no way to reach `How It Works`, `Features`, or `Docs` from the nav.
- Risk: Mobile users can still scroll to reach anchored sections on `/`, but `/docs/` is unreachable from the nav on mobile. Given mobile is the fallback for social-share clicks, this hurts docs discoverability.
- Fix: Add a hamburger menu, or at minimum surface "Docs" as a secondary mobile button.

**No skip-to-main link on the landing page:**
- Files: `src/layouts/Base.astro`, `src/pages/index.astro`
- What's missing: Starlight pages include a "Skip to content" link (visible in `dist/docs/index.html`: `<a href="#_top" ...>Skip to content</a>`). The landing page's `Base.astro` does not.
- Risk: Keyboard users must tab through nav on every page load.
- Fix: Add `<a href="#main" class="skip-link">Skip to content</a>` as the first child of `<body>` in `Base.astro`, and set `id="main"` on `<main>` in `src/pages/index.astro`.

**Color contrast not verified on accent button:**
- Files: `src/styles/global.css:126-135`
- What's missing: `.btn-primary` uses `color: #1a0e00` on `background-color: #f0506a`. Contrast ratio is roughly 4.5:1 — borderline for AA on large text, fails for small text. No tooling in the repo verifies this (no axe/pa11y in CI).
- Risk: WCAG AA contrast failures in the primary CTA.
- Fix: Run a manual audit with axe DevTools; consider `color: #0a0404` or darker, or run pa11y in CI.

## Test Coverage Gaps

**No tests of any kind:**
- What's not tested: Byte-to-MB formatting in `Hero.astro`, the shape and integrity of `latest-release.json` / `releases.json`, the `.github/workflows/new-release.yml` jq transforms, any rendering regressions.
- Files: entire codebase
- Risk: The release-data pipeline is the most automated part of this repo and has the highest blast radius (a malformed payload corrupts the production hero). It has zero tests.
- Priority: Medium-High for the release pipeline; Low for visual regressions on a small static site.
- Recommended additions (in priority order):
  1. A JSON schema or Zod validation step in the `new-release` workflow that fails before committing bad data.
  2. A unit test on a `formatDownloadSize(bytes)` helper (extract from `Hero.astro`).
  3. A Playwright smoke test hitting `/` and `/docs/getting-started/` in CI after build.

---

*Concerns audit: 2026-04-18*

# Requirements: Covalence Website

**Defined:** 2026-04-18
**Core Value:** When a new Covalence release is tagged in the app repo, this site rebuilds itself with the correct version, download, and release notes — with zero manual intervention — and visitors land on a page that explains what Covalence is clearly enough to decide whether to install it.

## v1 Requirements

Requirements for this milestone. Each maps to a roadmap phase.

### Repo Hygiene

- [ ] **REPO-01**: `README.md` at repo root covers what the site is, prerequisites (Node `>=22.12.0`), install, local dev, build, preview, and deployment flow, with a link to the main app repo
- [ ] **REPO-02**: `CONTRIBUTING.md` covers branching expectations, commit message style, PR workflow, and how to add/edit docs vs. marketing content
- [ ] **REPO-03**: `.github/pull_request_template.md` captures what changed, why, and screenshots for UI changes
- [ ] **REPO-04**: `.github/ISSUE_TEMPLATE/` provides at minimum a bug report template and a content/typo report template

### CI Gating

- [ ] **CI-01**: GitHub Actions workflow runs `npm ci` + `npm run build` on every PR targeting `main`
- [ ] **CI-02**: The build workflow is configured as a required status check so broken builds cannot merge

### Releases Page

- [ ] **REL-01**: Public `/releases` page lists all published Covalence releases with version, date, summary, and download links (implements upstream requirement DOC-09)
- [ ] **REL-02**: `/releases` reads from `src/data/releases.json` at build time (no runtime fetch)
- [ ] **REL-03**: Each listed release links to its DMG under `covalence.app/releases/*`

### Content Expansion

- [ ] **CONT-01**: "Under the hood" section (home or dedicated docs page) covers embedding model, asymmetric search, Matryoshka truncation, hybrid search, and recency weighting at a depth a technical reader can evaluate

### SEO & Sharing

- [ ] **SEO-01**: `robots.txt` served from site root, allowing indexing and pointing to the sitemap
- [ ] **SEO-02**: `sitemap.xml` generated for all public pages
- [ ] **SEO-03**: Canonical URL meta tag on every page
- [ ] **SEO-04**: Open Graph + Twitter card meta (title, description, image) on the home page and docs root

### Copy & Positioning

_Added 2026-04-24 when the pending "marketing copy rewrite for Pro-tier readiness" todo was promoted to Phase 4. Source spec: covalence memory 150._

- [ ] **COPY-01**: Home-page hero subhead commits to "machines you own" / "never anyone else's cloud" (not Mac-specific)
- [ ] **COPY-02**: The privacy-architecture paragraph is reframed as "Your data, your infrastructure" and leads with "no third-party cloud, by architecture"
- [ ] **COPY-03**: Features tiles use implementation-neutral language (no CoreML, Apple Neural Engine, or Mac-specific promises in tile bodies)
- [ ] **COPY-04**: Footer tagline reads correctly for any host shell the product ships (not Mac-only)
- [ ] **COPY-05**: The "Two copy-pastes" sub-copy is tightened for a power-user audience (no MCP explainer sentence)

### Accessibility

- [ ] **A11Y-01**: Custom (non-Starlight) components pass an automated a11y scan with zero critical violations
- [ ] **A11Y-02**: All interactive elements have accessible names and visible keyboard focus styles
- [ ] **A11Y-03**: Brand elements (hero, CTAs) meet WCAG AA color contrast

## v2 Requirements

Deferred to a later milestone.

### Repo Hygiene

- **REPO-v2-01**: `LICENSE` file added once the main Covalence project's open-core licensing decision is finalized

### Accessibility

- **A11Y-v2-01**: Full manual screen-reader pass on all public pages (NVDA or VoiceOver)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Server-side rendering / runtime APIs | SSG-only; would break the CF Pages static deploy model |
| Owning the release pipeline | App repo publishes; this site only consumes the dispatched payload |
| Authentication / accounts | Nothing to log into on a marketing + docs site |
| Backend analytics / telemetry / search index | If added, must be static or edge-only (CF Pages compatible) |
| Component library extraction | Keep components colocated until real reuse pressure exists |
| Multi-language / i18n | English-only for the foreseeable future |
| Migrating pre-v1.3.0 releases into the releases page | Matches upstream decision — only v1.3.0+ flows through the pipeline |
| Ground-up visual redesign | Belongs in its own milestone, not this bootstrap cycle |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REPO-01 | Phase 1 | Pending |
| REPO-02 | Phase 1 | Pending |
| REPO-03 | Phase 1 | Pending |
| REPO-04 | Phase 1 | Pending |
| CI-01 | Phase 1 | Pending |
| CI-02 | Phase 1 | Pending |
| REL-01 | Phase 2 | Pending |
| REL-02 | Phase 2 | Pending |
| REL-03 | Phase 2 | Pending |
| CONT-01 | Phase 3 | Validated (2026-04-24, PR #12) |
| SEO-01 | Phase 3 | Validated (2026-04-24, PR #12) |
| SEO-02 | Phase 3 | Validated (2026-04-24, PR #12) |
| SEO-03 | Phase 3 | Validated (2026-04-24, PR #12) |
| SEO-04 | Phase 3 | Validated (2026-04-24, PR #12) |
| COPY-01 | Phase 4 | Pending |
| COPY-02 | Phase 4 | Pending |
| COPY-03 | Phase 4 | Pending |
| COPY-04 | Phase 4 | Pending |
| COPY-05 | Phase 4 | Pending |
| A11Y-01 | Phase 5 | Pending |
| A11Y-02 | Phase 5 | Pending |
| A11Y-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22 ✓
- Unmapped: 0

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-24 — Phase 3 requirements (CONT-01, SEO-01..04) marked Validated after PR #12 merge; Copy & Positioning section added (COPY-01..05 → Phase 4); Accessibility section re-mapped (A11Y-01..03 → Phase 5)*

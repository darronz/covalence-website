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

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| REPO-01 | — | Pending |
| REPO-02 | — | Pending |
| REPO-03 | — | Pending |
| REPO-04 | — | Pending |
| CI-01 | — | Pending |
| CI-02 | — | Pending |
| REL-01 | — | Pending |
| REL-02 | — | Pending |
| REL-03 | — | Pending |
| CONT-01 | — | Pending |
| SEO-01 | — | Pending |
| SEO-02 | — | Pending |
| SEO-03 | — | Pending |
| SEO-04 | — | Pending |
| A11Y-01 | — | Pending |
| A11Y-02 | — | Pending |
| A11Y-03 | — | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 0 (awaiting roadmap)
- Unmapped: 17 ⚠️ (resolved by gsd-roadmapper)

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 after initialization*

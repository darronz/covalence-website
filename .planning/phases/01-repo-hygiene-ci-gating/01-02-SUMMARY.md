---
phase: 01-repo-hygiene-ci-gating
plan: 02
subsystem: infra
tags: [ci, github-actions, branch-protection, astro, node]

# Dependency graph
requires: []
provides:
  - GitHub Actions CI workflow (.github/workflows/ci.yml) that gates PRs on astro build
  - Required status check job named "build" (CI / build) for branch protection configuration
affects:
  - All future PRs to main (blocked by build check)
  - 02-releases-page (will run under CI gate)
  - 03-content-depth-seo (will run under CI gate)
  - 04-accessibility-pass (will run under CI gate)

# Tech tracking
tech-stack:
  added: [github-actions, actions/checkout@v5, actions/setup-node@v5]
  patterns:
    - "CI workflow triggers on pull_request to main (not pull_request_target — security)"
    - "Node version sourced from .nvmrc via node-version-file (single source of truth)"
    - "Least-privilege permissions: contents: read only"
    - "Concurrency group cancels superseded runs on force-push"

key-files:
  created:
    - .github/workflows/ci.yml
  modified: []

key-decisions:
  - "Used pull_request (not pull_request_target) to prevent forked-PR script injection"
  - "Node version referenced via node-version-file: .nvmrc — a future .nvmrc bump propagates automatically to CI, CF Pages, and local dev"
  - "Required status check job name is 'build' — appears in GitHub branch protection picker as 'CI / build'"
  - "Major-tag action pinning (@v5) accepted for this low-risk static build; SHA pinning deferred unless secrets/publishing are added"
  - "new-release.yml not modified — release-ingestion workflow is isolated from build gate"

patterns-established:
  - "Action pinning: major-tag style (@v5) matching existing new-release.yml pattern"
  - "Workflow permissions: top-level permissions block with minimal scope"

requirements-completed: [CI-01]

# Metrics
duration: partial (paused at checkpoint:human-action Task 2)
completed: 2026-04-18
---

# Phase 1 Plan 02: CI Gating Summary

**GitHub Actions CI workflow added that runs npm ci + astro build on every PR to main, with `build` job name configured for required-status-check branch protection (CI-01 complete; CI-02 pending human GitHub UI action)**

## Performance

- **Duration:** ~5 min (Task 1 only; Tasks 2-3 pending checkpoint)
- **Started:** 2026-04-18T00:00:00Z
- **Completed:** partial — paused at Task 2 checkpoint:human-action
- **Tasks:** 1/3 complete
- **Files modified:** 1

## Accomplishments

- Created `.github/workflows/ci.yml` with exact shape specified in plan
- All 17 automated acceptance checks pass (file exists, security constraints, action versions, cache, etc.)
- Existing `.github/workflows/new-release.yml` confirmed unchanged

## Task Commits

1. **Task 1: Author .github/workflows/ci.yml (CI-01)** - `7a30271` (feat)
2. **Task 2: Enable required status check for `build` on `main` (CI-02)** - PENDING (checkpoint:human-action)
3. **Task 3: Prove the CI gate end-to-end** - PENDING (checkpoint:human-verify)

## Files Created/Modified

- `.github/workflows/ci.yml` - CI build gate workflow; triggers on pull_request and push to main; uses node-version-file: .nvmrc; runs npm ci + npm run build + dist sanity check

## Decisions Made

- Job name `build` chosen per plan spec — this is the exact string that appears as `CI / build` in the GitHub branch protection required-status-check picker.
- `on.push.branches: [main]` included in addition to pull_request so the green check on main itself stays fresh after a merge.
- No `pull_request_target` (security: would expose repo secrets to forked-PR code).
- No `contents: write` (principle of least privilege; workflow only reads and builds).

## Deviations from Plan

None - plan executed exactly as written for Task 1.

## Issues Encountered

None.

## Pending Human Actions

**Task 2 — Enable required status check (CI-02):**
The workflow has been committed and will run once a PR is opened. After the `CI / build` check appears on a PR, the maintainer must:
1. Visit `https://github.com/darronz/covalence-website/settings/branches`
2. Add (or edit) a branch protection rule for `main`
3. Enable "Require status checks to pass before merging"
4. Add `build` (appears as `CI / build`) as the required status check
5. Save the rule

See the full walkthrough in the plan: `.planning/phases/01-repo-hygiene-ci-gating/01-02-PLAN.md` Task 2.

**Task 3 — End-to-end verification:**
After Task 2 is complete, open a PR and confirm the `CI / build` check appears with the Required label and that the Merge button is gated on it.

## Next Phase Readiness

- CI-01 complete: `.github/workflows/ci.yml` is in place and will run on the next PR
- CI-02 blocked on human GitHub UI action (branch protection rules require admin access)
- Once both CI-01 and CI-02 are confirmed, Phase 1 is complete and Phase 2 (Releases Page) can begin

---
*Phase: 01-repo-hygiene-ci-gating*
*Completed: partial — 2026-04-18 (Task 1 done; Tasks 2-3 pending)*

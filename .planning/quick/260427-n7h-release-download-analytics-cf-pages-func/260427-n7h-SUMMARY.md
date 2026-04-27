---
phase: quick-260427-n7h
plan: 01
subsystem: infra
tags: [cloudflare-pages-functions, r2, analytics-engine, workers-types, typescript]

requires:
  - phase: quick-260427-h4g
    provides: current branch state (docs/fix-mcp-tool-return-values)

provides:
  - CF Pages Functions for R2 proxy with Analytics Engine logging
  - functions/releases/[[path]].ts — catch-all handler for /releases/*
  - functions/appcast.xml.ts — exact-match handler for /appcast.xml
  - functions/analytics.ts — shared analytics utilities (classifyFile, extractVersion, parseMacOSVersion, buildDataPoint)
  - functions/env.d.ts — ambient Env interface for RELEASES_BUCKET + RELEASE_ANALYTICS bindings
  - functions/tsconfig.json — scoped TypeScript config for workers runtime

affects: [CF Pages deploy, release download pipeline, Sparkle update checks]

tech-stack:
  added:
    - '@cloudflare/workers-types ^4.20260426.1 (devDependency)'
    - 'typescript (devDependency, for local tsc checks)'
  patterns:
    - 'CF Pages Functions in functions/ directory alongside Astro static build — functions/ is ignored by Astro'
    - 'Separate functions/tsconfig.json scoped to workers runtime (ESNext, bundler moduleResolution, workers types)'
    - 'Shared analytics utilities in functions/analytics.ts imported by sibling function files'
    - 'Non-blocking analytics writes via context.waitUntil(Promise.resolve().then(...))'
    - 'R2 object proxying: writeHttpMetadata → ETag → Cache-Control → content-type fallback → Response(body)'

key-files:
  created:
    - functions/releases/[[path]].ts
    - functions/appcast.xml.ts
    - functions/analytics.ts
    - functions/env.d.ts
    - functions/tsconfig.json
  modified:
    - public/_routes.json
    - package.json
    - package-lock.json

key-decisions:
  - 'functions/analytics.ts is a plain ES module (not a .d.ts) because CF Pages Functions supports sibling imports — shared utilities exported and imported directly'
  - 'env.d.ts contains only the ambient Env interface — all workers globals (R2Bucket, AnalyticsEngineDataset, etc.) come from @cloudflare/workers-types in functions/tsconfig.json'
  - '_routes.json excludes changed from ["/releases/Covalence-*", "/appcast.xml"] to [] so CF Pages routes all requests through functions first'
  - 'Cache-Control 86400s for versioned release artifacts (immutable), 300s for appcast.xml (frequently polled by Sparkle)'
  - 'Content-type fallback block handles cases where R2 object metadata lacks Content-Type (common for programmatically uploaded objects)'
  - 'Analytics data model: blob1=fileName, blob2=fileType, blob3=version, blob4=country, blob5=UA (truncated 256 chars), blob6=macOSVersion; double1=responseSize'

requirements-completed: []

duration: 2min
completed: 2026-04-27
---

# Quick Task 260427-n7h: CF Pages Functions for R2 Proxy + Analytics Engine

**Two CF Pages Functions that proxy R2 release artifacts through Cloudflare's edge and log each request to Analytics Engine — enabling download volume tracking, version distribution, and Sparkle update-check frequency without third-party analytics or client-side JS.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-27T15:46:21Z
- **Completed:** 2026-04-27T15:48:40Z
- **Tasks:** 2 of 2
- **Files modified:** 8

## Accomplishments

- Created `functions/releases/[[path]].ts` — catch-all R2 proxy returning the object stream with ETag, Cache-Control 86400s, content-type fallback for .dmg/.delta/.xml/.html/.md, and a non-blocking Analytics Engine write via `waitUntil`
- Created `functions/appcast.xml.ts` — exact-match proxy for `/appcast.xml` with Cache-Control 300s (Sparkle polling interval) and non-blocking analytics write
- Created `functions/analytics.ts` with five shared utilities (`classifyFile`, `extractVersion`, `parseMacOSVersion`, `buildDataPoint`, `AnalyticsParams`) that normalize the analytics data model across both handlers
- Created `functions/env.d.ts` with ambient `Env` interface declaring `RELEASES_BUCKET: R2Bucket` and `RELEASE_ANALYTICS: AnalyticsEngineDataset`
- Created `functions/tsconfig.json` scoped to the workers runtime — isolated from root Astro tsconfig; zero type errors
- Updated `public/_routes.json` to `"exclude": []` so CF Pages stops bypassing functions for `/releases/*` and `/appcast.xml`
- Installed `@cloudflare/workers-types` and `typescript` as devDependencies

## Task Commits

1. **Task 1: TypeScript scaffolding and shared analytics helper** - `1b714a5` (chore)
2. **Task 2: Create Pages Functions and update _routes.json** - `b36f2e6` (feat)

## Files Created/Modified

- `functions/releases/[[path]].ts` — catch-all CF Pages Function for /releases/*; proxies R2 + logs analytics
- `functions/appcast.xml.ts` — exact-match CF Pages Function for /appcast.xml; proxies R2 + logs analytics
- `functions/analytics.ts` — shared exports: classifyFile, extractVersion, parseMacOSVersion, buildDataPoint
- `functions/env.d.ts` — ambient Env interface for RELEASES_BUCKET and RELEASE_ANALYTICS bindings
- `functions/tsconfig.json` — TypeScript config scoped to workers runtime (ESNext, bundler, workers-types)
- `public/_routes.json` — exclude array changed from ["/releases/Covalence-*", "/appcast.xml"] to []
- `package.json` — @cloudflare/workers-types and typescript added as devDependencies
- `package-lock.json` — updated lockfile

## Decisions Made

- `functions/analytics.ts` as a plain ES module (not `.d.ts`) because CF Pages Functions supports sibling imports — the plan's mid-spec correction was followed.
- `env.d.ts` contains only the ambient `Env` interface — `@cloudflare/workers-types` provides all workers globals (R2Bucket, AnalyticsEngineDataset, AnalyticsEngineDataPoint, IncomingRequestCfProperties, PagesFunction) via `functions/tsconfig.json`.
- Separate `functions/tsconfig.json` with `"include": ["./**/*.ts"]` prevents the root `tsconfig.json` (which extends `astro/tsconfigs/strict`) from picking up workers-types globals, avoiding type conflicts across the two runtime targets.
- Cache-Control strategy: 86400s for versioned artifacts (immutable filenames like `Covalence-1.4.0.dmg`); 300s for `appcast.xml` (polled frequently by Sparkle's built-in update checker).

## Deviations from Plan

None — plan executed exactly as written. The plan's mid-spec self-correction (use `analytics.ts` module, not shared code in `env.d.ts`) was followed as specified.

## Issues Encountered

- `npx tsc` returned a "not the tsc command you are looking for" message because TypeScript was not installed in the project. Fixed by adding `typescript` as a devDependency (Rule 3 — blocking issue: needed to verify zero errors per plan's done criteria).

## User Setup Required

Two Cloudflare bindings must be configured in the CF Pages dashboard before the functions will work in production:

1. **R2 binding** — Variable name: `RELEASES_BUCKET`, R2 bucket: the bucket containing release artifacts
2. **Analytics Engine binding** — Variable name: `RELEASE_ANALYTICS`, Dataset: the Analytics Engine dataset to write download events to

These bindings are set in the CF Pages project settings under "Functions > Bindings". Without them, the functions will throw at runtime (the TypeScript compiles fine, but `context.env.RELEASES_BUCKET` and `context.env.RELEASE_ANALYTICS` will be undefined).

## Next Phase Readiness

- Functions are ready to deploy — `npm run build` succeeds (Astro SSG unaffected) and `tsc --project functions/tsconfig.json --noEmit` is clean
- Post-deploy manual verification: `curl -I https://covalence.app/releases/Covalence-1.4.0.dmg` should return 200 with ETag and Cache-Control headers
- Analytics Engine data visible in Cloudflare dashboard after first download request

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: path-traversal | functions/releases/[[path]].ts | New network endpoint accepting user-supplied path used as R2 key. Mitigated per T-n7h-01: CF Pages routing normalizes paths; no query params; R2Bucket.get() is scoped to the bound bucket. No `../` traversal possible through the normalized URL path segments. |
| threat_flag: new-download-endpoint | functions/releases/[[path]].ts | All /releases/* requests now routed through this function (previously excluded from functions via _routes.json). Scope change: previously CF Pages served release artifacts directly from the static publish directory; now the function is the sole handler. |

## Self-Check: PASSED

- `functions/releases/[[path]].ts`: FOUND
- `functions/appcast.xml.ts`: FOUND
- `functions/analytics.ts`: FOUND
- `functions/env.d.ts`: FOUND
- `functions/tsconfig.json`: FOUND
- `public/_routes.json` contains `"exclude": []`: FOUND (grep count: 1)
- Commit `1b714a5`: FOUND
- Commit `b36f2e6`: FOUND
- `tsc --project functions/tsconfig.json --noEmit`: ZERO ERRORS
- `npm run build`: SUCCESS (13 pages built)
- `writeDataPoint` in releases function: 1 occurrence
- `writeDataPoint` in appcast function: 1 occurrence
- `waitUntil` in releases function: 1 occurrence
- `waitUntil` in appcast function: 1 occurrence

---
*Phase: quick-260427-n7h*
*Completed: 2026-04-27*

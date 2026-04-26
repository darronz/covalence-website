---
phase: 04-marketing-copy-rewrite-pro-tier-readiness
verified: 2026-04-26T09:22:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "CF Pages preview visual check of all nine copy edits"
    expected: "All nine string-level edits visible in context on the deployed preview page, no layout breakage, no truncation"
    why_human: "Grep matrix confirms string presence in rendered HTML but cannot verify visual rendering, line wrapping, or contextual readability on a deployed page"
---

# Phase 4: Marketing Copy Rewrite (Pro-tier readiness) Verification Report

**Phase Goal:** Every claim on the marketing-site surfaces survives the eventual Free/Pro tier split -- the load-bearing principle "no third-party cloud, by architecture" is said once in the hero, once in the privacy paragraph, and once in the relevant features tile. The site stops committing to "runs on your Mac" as a product-wide promise without pre-announcing Pro.
**Verified:** 2026-04-26T09:22:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hero subhead reads "Your memory, on machines you own. Never anyone else's cloud." -- no Mac-specific language (SC1/COPY-01) | VERIFIED | `Hero.astro` line 23 contains exact string; `dist/index.html` grep positive; old string "Runs on your Mac" absent from both source and dist |
| 2 | Architecture.astro right column headed "Your data, your infrastructure" with first sentence naming "no third-party cloud, by architecture" (SC2/COPY-02) | VERIFIED | `Architecture.astro` line 20 heading matches; lines 22 contains "No third-party cloud, by architecture"; `dist/index.html` shows exactly 2 occurrences via `grep -oE | wc -l`; old heading "Privacy by architecture" absent |
| 3 | None of the six Features tiles mentions CoreML, Apple Neural Engine, millisecond inference, or any Apple/Mac-specific implementation detail in tile bodies (SC3/COPY-03) | VERIFIED | All 6 tile descriptions in `Features.astro` (lines 6, 11, 16, 21, 26, 31) scanned -- zero Apple/Mac/CoreML/Neural Engine references in any tile body; "MLTensor on Apple Silicon" exists only in `Architecture.astro` line 11 (Phase 3 content, not a Features tile, not Phase 4 scope) |
| 4 | Footer tagline reads "Built for the machines you own" (SC4/COPY-04) | VERIFIED | `Footer.astro` line 8 contains `<h2>Built for the machines you own</h2>`; `dist/index.html` grep positive; old "Built on macOS, for macOS" absent |
| 5 | "Two copy-pastes" sub-copy reads "Add the MCP snippet. Paste the behavioural prompt. Done." (SC5/COPY-05) | VERIFIED | `HowItWorks.astro` line 4 contains exact string with British spelling "behavioural"; `dist/index.html` grep positive; old explainer "Connect your AI client to Covalence's MCP server" absent |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/Hero.astro` | Pro-tier-ready hero subhead | VERIFIED | Contains "Your memory, on machines you own. Never anyone else's cloud." on line 23; 117 lines; wired via `src/pages/index.astro` import; renders to dist/index.html |
| `src/components/HowItWorks.astro` | Tightened sub-copy for power-user audience | VERIFIED | Contains "Add the MCP snippet. Paste the behavioural prompt. Done." on line 4; 117 lines; wired via index.astro |
| `src/components/Features.astro` | Implementation-neutral feature tiles | VERIFIED | 4 tiles rewritten (lines 14-32), 2 unchanged (lines 3-12); 95 lines; no Apple/Mac refs in any tile body; wired via index.astro |
| `src/components/Architecture.astro` | Pro-tier-ready architecture copy | VERIFIED | Arch-stack teaser (line 8) and arch-privacy (lines 20-28) both rewritten; "No third-party cloud, by architecture" appears twice; 99 lines; wired via index.astro |
| `src/components/Footer.astro` | Pro-tier-ready footer tagline | VERIFIED | "Built for the machines you own" on line 8; "Download for macOS" CTA preserved on line 15; 109 lines; wired via index.astro |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| Hero.astro | dist/index.html | Astro SSG build | WIRED | "Your memory, on machines you own" confirmed in dist/index.html |
| HowItWorks.astro | dist/index.html | Astro SSG build | WIRED | "Add the MCP snippet" confirmed in dist/index.html |
| Features.astro | dist/index.html | Astro SSG build | WIRED | "On-device embeddings", "One memory, every client", "Your data, your infrastructure" all confirmed in dist/index.html |
| Architecture.astro | dist/index.html | Astro SSG build | WIRED | "No third-party cloud, by architecture" confirmed 2x in dist/index.html |
| Footer.astro | dist/index.html | Astro SSG build | WIRED | "Built for the machines you own" confirmed in dist/index.html |

### Data-Flow Trace (Level 4)

Not applicable -- this phase modifies static string content in build-time templates. No dynamic data variables, no fetch/query/store patterns. All content is literal prose rendered at build time.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build succeeds with all 5 edits | `rm -rf dist/ && npm run build` | exit 0, 12 pages built in 1.91s | PASS |
| D-14 positive matrix (12 strings) | `grep -qF` for each locked string in dist/index.html | All 12 found | PASS |
| D-14 negative matrix (9 replaced strings absent) | `! grep -qF` for each old string in dist/index.html | All 9 absent | PASS |
| D-13 voice sweep (7 banned words) | `! grep -qwi` for instant/amazing/blazing/effortless/powerful + phrase checks | All absent; "free" count = 0 | PASS |
| Four-repetition audit | count of "Never anyone else" + "No third-party cloud, by architecture" + "no one else" | 1 + 2 + 1 = 4 | PASS |
| WR-01 closed | `grep -nwi 'instant' Features.astro` + `dist/index.html` | 0 matches | PASS |
| Phase 3 content preserved | grep for nomic-embed-text-v1.5, RRF k=60, /docs/under-the-hood/ link | All present in dist/index.html | PASS |
| Unchanged tiles intact | grep for "Semantic search" and "Core Memories" | Both present in dist/index.html | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| COPY-01 | 04-01 | Hero subhead commits to "machines you own" / "never anyone else's cloud" | SATISFIED | Hero.astro line 23 matches D-03 verbatim; dist/index.html grep positive; old Mac-specific string absent |
| COPY-02 | 04-04 | Privacy-architecture reframed as "Your data, your infrastructure" leading with "no third-party cloud, by architecture" | SATISFIED | Architecture.astro lines 20-28 match D-10 verbatim; heading and first sentence verified; "No third-party cloud, by architecture" count = 2 in dist |
| COPY-03 | 04-03 | Features tiles use implementation-neutral language (no CoreML, Apple Neural Engine, Mac-specific) | SATISFIED | All 6 tile descriptions scanned in Features.astro -- zero Apple/Mac/CoreML references; 4 tiles rewritten per D-05 through D-08; 2 unchanged tiles preserved |
| COPY-04 | 04-05 | Footer tagline reads correctly for any host shell (not Mac-only) | SATISFIED | Footer.astro line 8 reads "Built for the machines you own" per D-11; old "Built on macOS, for macOS" absent |
| COPY-05 | 04-02 | "Two copy-pastes" sub-copy tightened for power-user audience | SATISFIED | HowItWorks.astro line 4 reads "Add the MCP snippet. Paste the behavioural prompt. Done." per D-04; old MCP explainer absent |

No orphaned requirements -- all 5 COPY requirements from REQUIREMENTS.md are covered by plans and verified.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | - | - | - | No TODO, FIXME, placeholder, stub, or empty implementation patterns found in any of the 5 modified components |

### Human Verification Required

### 1. CF Pages Preview Visual Check

**Test:** Open the CF Pages preview URL for the branch containing all five Wave 1 commits. Walk through the nine copy edits visually:
1. Hero subhead reads "Your memory, on machines you own. Never anyone else's cloud."
2. HowItWorks subtitle reads "Add the MCP snippet. Paste the behavioural prompt. Done."
3. Features tile "One memory, every client" body mentions "any MCP-capable agent"
4. Features tile "On-device embeddings" body mentions "your hardware"
5. Features tile "Always running" body includes "Quick capture from anywhere."
6. Features tile "Your data, your infrastructure" body mentions "hardware you own"
7. Architecture teaser includes "on hardware you control" and "No third-party cloud, by architecture."
8. Architecture right column heading reads "Your data, your infrastructure"; body starts with "Covalence runs on machines you control."
9. Footer tagline reads "Built for the machines you own"; Download button still says "Download for macOS."

Optional: resize to mobile width to confirm no wrapping or truncation issues.

**Expected:** All nine edits visible in their correct positions, no layout breakage, no text truncation, no remnants of old copy.
**Why human:** Grep matrix confirms string presence in rendered HTML but cannot verify visual rendering quality, line wrapping behavior, contextual readability, or CSS layout integrity on a deployed page.

### Gaps Summary

No automated gaps found. All 5 ROADMAP Success Criteria (SC1-SC5) verified against actual source files and built output. All 12 D-14 positive-control strings present. All 9 replaced strings absent. D-13 voice sweep clean. Four-repetition audit confirmed (1+2+1=4). WR-01 closed. Phase 3 content preserved.

The only remaining item is the CF Pages preview visual check (human verification), which cannot be performed programmatically.

---

_Verified: 2026-04-26T09:22:00Z_
_Verifier: Claude (gsd-verifier)_

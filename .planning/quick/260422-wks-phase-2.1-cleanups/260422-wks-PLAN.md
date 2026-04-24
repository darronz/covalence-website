---
phase: 260422-wks-phase-2.1-cleanups
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/posts/[...slug].astro
  - package.json
  - package-lock.json
  - src/content/docs/docs/getting-started.md
autonomous: true
requirements:
  - QUICK-260422-wks
source: .planning/phases/2.1-blog/02.1-REVIEW.md (WR-01, IN-02) + .planning/todos/pending/2026-04-21-fix-chatgpt-mcp-support-docs.md
must_haves:
  truths:
    - "A post with an off-origin og_image (e.g. https://evil.com/x.png) fails the build with a same-origin error, not a silent cross-origin emit"
    - "A post with an on-origin og_image (e.g. /blog-hero.png) still builds and the <meta property=og:image> renders the absolute covalence.app URL"
    - "package.json dependencies has exactly 4 entries (@astrojs/rss, @astrojs/starlight, astro, marked) — astro-expressive-code is gone"
    - "getting-started.md ChatGPT section is a forward-looking 3-sentence note, not a dismissive 'does not support' claim"
  artifacts:
    - path: "src/pages/posts/[...slug].astro"
      provides: "Same-origin guard on og_image"
      contains: "u.origin !== new URL(Astro.site"
    - path: "package.json"
      provides: "4-entry dependencies block without astro-expressive-code"
    - path: "src/content/docs/docs/getting-started.md"
      provides: "Accurate, forward-looking ChatGPT compatibility note linking to developers.openai.com/api/docs/mcp"
      contains: "developers.openai.com/api/docs/mcp"
  key_links:
    - from: "src/pages/posts/[...slug].astro:25-36"
      to: "build-time validation of post frontmatter"
      via: "IIFE throwing on cross-origin URL resolution"
      pattern: "u.origin !== new URL(Astro.site"
---

<objective>
Close the three queued follow-ups from Phase 2.1 (per STATE.md line 15):

1. **WR-01** — Tighten `og_image` with a same-origin guard so cross-origin / `javascript:` values throw at build time instead of silently passing through to `<meta property="og:image">`.
2. **IN-02** — Uninstall the dead `astro-expressive-code` dependency (Wave 6 removed the integration but left the dep in `package.json`).
3. **ChatGPT MCP claim** — Replace the inaccurate "ChatGPT does not currently support the MCP protocol" line in `getting-started.md` with a forward-looking 3-sentence note: ChatGPT supports MCP via remote connectors, Covalence is local-only today, remote transport is on the roadmap.

Purpose: Clear the three small items blocking a clean hand-off into Phase 3. None of these shift architecture; all three are scoped doc/config/validation polish.

Output: Three atomic commits on `main`, a clean `npm run build`, and an updated STATE.md Quick Tasks Completed table.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/STATE.md
@.planning/phases/2.1-blog/02.1-REVIEW.md
@.planning/todos/pending/2026-04-21-fix-chatgpt-mcp-support-docs.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add same-origin guard on og_image (WR-01)</name>
  <files>src/pages/posts/[...slug].astro</files>
  <action>
Replace the current `ogImageURL` assignment (lines 25-27) with an IIFE that throws on cross-origin URLs:

```astro
const ogImageURL = post.data.og_image
  ? (() => {
      const u = new URL(post.data.og_image, Astro.site);
      if (u.origin !== new URL(Astro.site!).origin) {
        throw new Error(`og_image must be same-origin: got ${u.origin} for ${post.id}`);
      }
      return u;
    })()
  : new URL('/og-image.png', Astro.site);
```

Rationale: the WHATWG URL parser does NOT throw on absolute or protocol-relative values (e.g. `//evil.com/x.png`, `https://evil.com/x.png`, `javascript:alert(1)`). WR-01 documents all three of those as passing silently through `new URL(relative, base)`. The IIFE guard converts those into build-time failures. The `Astro.site!` non-null assertion is safe because `astro.config.mjs` declares `site: 'https://covalence.app'`.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>
- `src/pages/posts/[...slug].astro` contains the IIFE guard with the `u.origin !== new URL(Astro.site!).origin` check.
- `npm run build` exits 0 (no posts exist today, so the guard is uninvoked — we are only proving it compiles).
  </done>
</task>

<task type="auto">
  <name>Task 2: Uninstall dead astro-expressive-code dep (IN-02)</name>
  <files>package.json, package-lock.json</files>
  <action>
Run:
```
npm uninstall astro-expressive-code
```

Expected post-state:
- `package.json` `dependencies` contains exactly 4 entries: `@astrojs/rss`, `@astrojs/starlight`, `astro`, `marked`.
- `package-lock.json` no longer includes any `astro-expressive-code` entries in its tree (the transitive dependencies may be retained if they are pulled in by other deps like Starlight, which is expected — Starlight bundles its own EC).

Do not edit `package.json` by hand. Let npm handle both manifest and lockfile.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>
- `grep -c 'astro-expressive-code' package.json` returns 0.
- `npm run build` exits 0 and output includes the Starlight-bundled Expressive Code pipeline (confirmed via the absence of a standalone EC boot line and the presence of Starlight's internal EC processing).
  </done>
</task>

<task type="auto">
  <name>Task 3: Fix ChatGPT MCP claim in getting-started.md</name>
  <files>src/content/docs/docs/getting-started.md</files>
  <action>
Replace line 65 of `src/content/docs/docs/getting-started.md` — currently:

> ChatGPT does not currently support the MCP protocol. Watch for updates from OpenAI.

with a forward-looking 3-sentence note using matter-of-fact tone consistent with the Claude Desktop / Claude Code / Cursor / OpenCode sections above it:

> ChatGPT supports MCP via [remote connectors](https://developers.openai.com/api/docs/mcp). Covalence currently ships as a local macOS binary, so it isn't yet reachable by ChatGPT's connector model. Remote/network transport is on the Covalence roadmap — ChatGPT support will land with that.

Do not add setup steps. Do not change the `### ChatGPT` heading, surrounding sections, or any other client tab. The file is a Starlight `.md` doc with no MDX integration, so plain markdown (inline link) is correct — do not introduce any JSX.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>
- `getting-started.md:65` has been replaced with the three-sentence forward-looking note.
- The external link `https://developers.openai.com/api/docs/mcp` is present as a proper markdown link.
- No other line in `getting-started.md` is modified.
- `npm run build` exits 0 and renders `/docs/getting-started/`.
  </done>
</task>

</tasks>

<verification>
- `grep -n 'u.origin !== new URL(Astro.site' src/pages/posts/[...slug].astro` returns exactly one match.
- `grep -c 'astro-expressive-code' package.json` returns 0.
- `grep -n 'developers.openai.com/api/docs/mcp' src/content/docs/docs/getting-started.md` returns exactly one match.
- `grep -c 'does not currently support the MCP protocol' src/content/docs/docs/getting-started.md` returns 0.
- `npm run build` exits 0 with the same page count as before (11 pages).
</verification>

<success_criteria>
All three cleanup items from STATE.md line 15 close: the `og_image` guard is tightened per WR-01, the dead `astro-expressive-code` dep is gone per IN-02, and the ChatGPT section now reads as forward-looking rather than dismissive. STATE.md's Pending Todos and Blockers/Concerns are updated accordingly. Build stays green at 11 pages.
</success_criteria>

<output>
After completion, create `.planning/quick/260422-wks-phase-2.1-cleanups/260422-wks-SUMMARY.md` with `status: complete` in frontmatter and an updated STATE.md Quick Tasks Completed table.
</output>

---
created: 2026-04-21T21:22:31Z
title: Fix incorrect ChatGPT MCP support claim in getting-started docs
area: docs
files:
  - src/content/docs/docs/getting-started.md:62-64
---

## Problem

`src/content/docs/docs/getting-started.md:63` currently tells users:

> ChatGPT does not currently support the MCP protocol. Watch for updates from OpenAI.

This is factually incorrect as of 2026-04-21. OpenAI ships MCP connector support — see https://developers.openai.com/api/docs/mcp. The claim misleads visitors evaluating whether Covalence will work with their AI client and undercuts the "works with your AI clients" pitch on the landing page.

Visible at https://covalence.app/docs/getting-started/ under the "Connect Your AI Client" → "ChatGPT" tab.

## Solution

Replace the ChatGPT `<TabItem>` body with accurate setup guidance:

1. Confirm the current ChatGPT MCP connector story against https://developers.openai.com/api/docs/mcp (which surfaces: developer-mode MCP connectors in ChatGPT, remote MCP server support, auth requirements). Note the gap: Covalence is a **local** MCP server (`/Applications/Covalence.app/Contents/MacOS/cov-mcp`), and ChatGPT's connector model typically expects a remote/HTTPS endpoint.
2. Decide the accurate framing — one of:
   - **If a local transport is viable:** document the exact ChatGPT configuration steps alongside the Claude Desktop / Cursor / OpenCode tabs.
   - **If only remote MCP is supported today:** say so explicitly ("ChatGPT supports MCP via remote connectors; Covalence currently ships as a local binary, so ChatGPT is not yet a supported client — [link to roadmap/issue]") rather than the current blanket "does not support MCP" claim.
3. Update the tab content accordingly and keep the tone consistent with the other client tabs (concise, command-first).
4. Verify with `npm run build` + `astro preview` that the tab still renders and the link lands correctly.

Route through `/gsd-quick` since this is a scoped doc correction.

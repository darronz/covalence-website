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

**Direction (decided 2026-04-21):** Add an explanatory note, not setup steps. ChatGPT supports MCP via **remote** connectors; Covalence currently ships as a **local** macOS binary, so ChatGPT is not compatible today. Planned network/remote MCP functionality in Covalence will make ChatGPT work — the note should be forward-looking, not dismissive.

Steps:

1. Replace the ChatGPT `<TabItem>` body (`src/content/docs/docs/getting-started.md:62-64`) with a short, accurate note. Suggested shape:
   - One sentence: ChatGPT supports MCP via remote connectors (link to https://developers.openai.com/api/docs/mcp).
   - One sentence: Covalence currently ships as a local macOS binary, so it isn't yet reachable by ChatGPT's connector model.
   - One sentence: Remote/network transport is on the Covalence roadmap — ChatGPT support will land with that.
2. Before writing the copy, re-read https://developers.openai.com/api/docs/mcp to confirm the remote-only framing is still accurate at time of fix (OpenAI's MCP surface is moving; avoid re-introducing a stale claim).
3. Keep the tone consistent with the other client tabs (concise, matter-of-fact).
4. Verify with `npm run build` + `astro preview` that the tab still renders and the external link resolves.

Route through `/gsd-quick` since this is a scoped doc correction.

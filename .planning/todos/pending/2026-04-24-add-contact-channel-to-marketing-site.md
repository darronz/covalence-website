---
created: 2026-04-24T00:00:00Z
title: Add an advertised contact channel to covalence.app (no way to reach the maintainer today)
area: ui
files:
  - src/components/Footer.astro
  - src/layouts/Base.astro
---

## Problem

`covalence.app` currently surfaces zero way to contact the maintainer. Confirmed by inspection of `src/components/Footer.astro`: the footer links are only `Releases`, `Latest Release`, and conditional `RSS` — no email, no GitHub Issues link, no "Contact" or "Feedback" surface anywhere on the site. Base.astro has no contact slot either.

This has two concrete costs:

1. **Users with bug reports / feature asks have nowhere to go** — they'd have to dig up the maintainer on social to reach out. Friction this high means most never bother, and the bug log stays artificially empty.
2. **It undercuts the positioning** — the site commits to "no accounts with us" and "no telemetry" (and will lean harder on that with the Pro-tier reframe in memory 150). A reader who buys into a local-first, privacy-first product expects to be able to reach a human, not bounce off a dead-end download page.

Social-only is insufficient: it filters out everyone who isn't already on the same network as the maintainer, it's noisy (DMs get lost), and it doesn't cover the "report a vulnerability" / "security@" register at all.

## Solution

Decide the shape before writing any code — the scope ranges from 30 seconds (one mailto in the footer) to a proper `/contact` route with a voice-matched page. Reasonable options:

- **A. Footer mailto only.** Add `<a href="mailto:hello@covalence.app">Contact</a>` (or whatever address resolves) to `Footer.astro`'s link row. Requires: domain-mail routing set up on covalence.app (Cloudflare Email Routing is free and sufficient). 30-minute task including DNS wait.
- **B. Footer GitHub Issues link.** Add `<a href="https://github.com/darronz/covalence/issues/new">Report an issue</a>` alongside the existing links. Zero infra cost, channels bug reports into the same queue as dev work. Doesn't cover private channel (security, enterprise enquiry, personal hello).
- **C. Both, side-by-side.** Issues link for bugs/feature requests, mailto for everything else. Clearest user mental model. Matches how most open-core projects surface contact.
- **D. `/contact` page.** New Astro route with voice-matched copy explaining which channel to use for what (issues for bugs, email for private/security/enterprise, social for casual/public). Heavier; worth it only if the Pro-tier positioning in memory 150 wants a dedicated page that also hints at commercial conversations.

**Recommended starting point: option C.** Two footer links, no new route, no new assets. Can graduate to D later once there's an actual Pro story to pitch on the page.

**Security register check.** If going with B or C, decide whether private security reports get a separate surface (GitHub's private vulnerability reporting is a one-click enable on the app repo, or `SECURITY.md` with an email address). The site doesn't need to advertise this directly — `SECURITY.md` in the `darronz/covalence` repo is the standard destination — but the site's contact channel should at least route people who open with "I found a security issue" somewhere that isn't a public issue tracker.

## Scope boundary

This todo is about **advertising** a channel, not about **hardening** the inbox or writing contact copy at Pro-tier scale. Scope creeps to watch for:

- Don't build a contact form on this statically-deployed site — that needs Formspree/Basin/Workers and adds a runtime dependency the repo has explicitly avoided (see PROJECT.md "Out of Scope": "Backend for analytics, telemetry, search index — if added later, must be static or edge-only"). A form is fine in principle; just out of scope for this todo.
- Don't bake in a Pro-tier sales line while you're in there — that belongs to the memory-150 copy rewrite todo and should stay coherent with that phase's framing.
- Don't remove social links if there are none — just adding the missing channel.

## Pre-flight

- [ ] Decide address: `hello@`, `support@`, personal, or hybrid. (Ties into whether CF Email Routing needs setup — blocks option A/C if not done.)
- [ ] Decide A/B/C/D (above) — reasonable default is C.
- [ ] Confirm `github.com/darronz/covalence/issues` is the right destination (public issues are enabled, accepting external contributions matches the project stance).
- [ ] Consider whether this needs coordination with memory-150 marketing-copy rewrite — both touch `Footer.astro`. If the memory-150 phase runs first, rebase this todo onto the new footer tagline ("Built for the machines you own").

Small enough for `/gsd-quick` if going with A or B; C is still quick-task territory; D should go through `/gsd-discuss-phase`.

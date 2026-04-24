---
quick_id: 260424-uk9
created: 2026-04-24T21:00:18Z
mode: quick-inline
slug: add-contact-mailto-and-report-an-issue-l
title: Add Contact mailto + Report an issue links to Footer.astro
source_todo: .planning/todos/pending/2026-04-24-add-contact-channel-to-marketing-site.md
files_modified:
  - src/components/Footer.astro
---

## Objective

`covalence.app` advertises no way for users to reach the maintainer — the footer surfaces only Releases / Latest Release / RSS. Add two footer links so inbound bug reports and user email have somewhere to go.

## Scope (option B of the source todo)

Append two links to the existing `.footer-links` row in `src/components/Footer.astro`:

- `<a href="mailto:hello@covalence.app">Contact</a>`
- `<a href="https://github.com/darronz/covalence-website/issues/new" rel="noopener">Report an issue</a>`

Order: after RSS, before the existing copyright line. No CSS changes — the existing `.footer-links` flex row handles additional children, and the 640px breakpoint already switches to column layout for mobile.

## Decisions locked

- **Email address:** `hello@covalence.app` — already set up on Proton Mail, ready today. No CF Email Routing work needed.
- **Issues destination:** `darronz/covalence-website/issues/new`. The app repo (`darronz/covalence`) is private, and GitHub doesn't expose only-issues-public on private repos. Routing through the public website repo lets users file without needing access to the private repo; site maintainer transfers app-specific issues to the private app repo via GitHub's cross-repo issue transfer (history is preserved, user doesn't see the private repo).
- **Form vs mailto:** mailto. A form needs a submission endpoint (Workers / Formspree / Basin), adds a spam-attack surface, and PROJECT.md's scope rule favours static/edge-only. Revisit if inbound volume ever justifies it — unlikely at typical marketing-site traffic.
- **GitHub profile link:** skipped. Two links keeps the footer tight; `Report an issue` already advertises the GitHub presence.
- **`rel="noopener"` on the external Issues link:** yes. Standard security hygiene for any `<a>` that navigates away; no `target="_blank"` so `noreferrer` isn't needed (referrer leaks are only an issue for new-tab links).

## Verification

- `git diff` shows exactly 2 insertions in `Footer.astro`
- `npm run build` exits 0
- `dist/index.html`, `dist/releases/index.html`, `dist/posts/index.html` each contain:
  - `<a href="mailto:hello@covalence.app" …>Contact</a>`
  - `<a href="https://github.com/darronz/covalence-website/issues/new" rel="noopener" …>Report an issue</a>`
- Starlight `/docs/*` pages use Starlight's native footer, not this component — existing behaviour, no regression

## Follow-ups (out of scope here)

- `SECURITY.md` in the app repo pointing at `hello@covalence.app` for security reports — the site footer deliberately doesn't advertise a separate `security@` channel; the standard destination is a SECURITY.md in the source repo.
- Reconcile with the memory-150 marketing-copy rewrite when that phase runs. Both touch `Footer.astro`. The rewrite will also change the footer tagline (`Built on macOS, for macOS` → `Built for the machines you own`); the two links here should ride through that phase untouched.

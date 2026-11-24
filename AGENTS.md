# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static, client-side site** (Excelerator Design Sandbox) — plain HTML/CSS/vanilla JS. There is no backend, database, package manifest, lockfile, build step, lint config, or automated test suite. See `README.md` for the story structure.

### Running

- Serve the repo root over HTTP: `npx --yes serve .` (README default). Any static server works (e.g. `python3 -m http.server`). Pin a port with `serve . -l 3000`.
- Do not open the HTML files via `file://` — pages rely on relative URLs and clean-URL routing (e.g. `screen-2` → `screen-2.html`), which only resolve correctly when served over HTTP. `serve` returns `301` redirects for `*.html` → clean URLs; this is expected.
- Entry point is `index.html` (the features hub). Interactive flows to sanity-check changes: **Dealer Access Approval** (`stories/dealer-access-approval/email.html` → screens 2–4) and the notification-banner options story.

### Lint / test / build

- None exist. There is nothing to install, lint, build, or unit-test. "Testing" means serving the site and clicking through the flows in a browser.

### Gotchas

- Styling/fonts (Bootstrap 5.3.3, Font Awesome 6.5.1, Google Fonts "Rubik") load from public CDNs at runtime. With no outbound internet the pages still function but lose styling/fonts.

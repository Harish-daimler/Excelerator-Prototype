# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static** HTML/CSS/JS design sandbox ("Excelerator Design Sandbox"). There is no build step, no bundler, no automated tests, and no linter. Bootstrap, Font Awesome, and Google Fonts are loaded from CDNs at runtime, so a network connection is needed for the pages to render with full styling.

### Run it

Serve the repository root as static files and open `index.html` (the features hub):

```bash
npx --yes serve . -l 3000
```

Then browse `http://localhost:3000/`. Any static file server works (e.g. `python3 -m http.server 3000`) if `serve` is unavailable.

Notes:
- `serve` issues 301 redirects to clean URLs (drops the `.html`), so `curl` needs `-L` to follow them; browsers handle this transparently.
- There is nothing to install for the project itself — all dependencies are CDN-hosted. The startup update script only pre-caches the `serve` binary.

### Structure / core flows (see `README.md` for full details)
- `index.html` — features hub; stories are registered in `js/features.js`.
- `stories/<name>/` — individual design stories (e.g. `notification-banner`, `dealer-access-approval`).
- Preview pages: `global-homepage.html`, `parts.html`, `coverage.html`, `connectivity.html`.
- Auth switch: the header account control toggles between `ADXCustomer3` (logged in) and `Sign In` (logged out) via `js/auth-toggle.js`.

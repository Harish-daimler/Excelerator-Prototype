# Excelerator Design Sandbox

Local Bootstrap recreation of Excelerator pages for design exploration (e.g. system notification banner). Visuals match production; no intentional redesigns.

## Pages

- `index.html` — **Start here.** Options landing: pick a design direction for the current story. Content is driven by `js/options-story.js`.
- `global-homepage.html` — Solutions / product offerings homepage ([excelerator.com/en/](https://excelerator.com/en/))
- `parts.html` — Parts & PartsProX homepage ([excelerator.com/truck-parts/en](https://excelerator.com/truck-parts/en))
- `coverage.html` — Extended Coverage homepage ([excelerator.com/coverage/en/](https://excelerator.com/coverage/en/))
- `connectivity.html` — Connectivity Services homepage ([excelerator.com/connectivity/en/](https://excelerator.com/connectivity/en/))

Logged-in headers on Parts / Coverage / Connectivity use the Figma **Customer View** product header. Logged-out matches live screenshots. Coverage subnav follows live: Shop Coverage, Enter VIN.

## Options stories

For each feature review, edit `js/options-story.js`:

- `title` / `intro` — populate the hero
- `previewUrl` — where selection navigates (default: `global-homepage.html`)
- `options` — list of choices (`id`, `label`, `name`, `desc`; optional `image`)

The shared renderer is `js/options-page.js`. Cards work with text only; add `image` when you have assets.

## System notification prototype

1. Open `index.html` and choose a placement.
2. Preview applies on all four homepages for that session.
3. Use **Back to Options** (shared control, bottom-left) to return; the current choice stays highlighted until you pick a different option. Logo / Home links go to the Solutions homepage (`global-homepage.html`), not the options landing.
4. Modal (Option 5) shows once per session. Other placements can be dismissed for the session.

## Run locally

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

## Auth switch

Open the account control in the header:

- **ADXCustomer3** → **View logged out**
- **Sign In** → **View ADXCustomer3**

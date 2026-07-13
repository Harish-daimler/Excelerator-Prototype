# Excelerator Design Sandbox

Local Bootstrap recreation of Excelerator pages for design exploration (e.g. system notification banner). Visuals match production; no intentional redesigns.

## Pages

- `options.html` — **Start here.** Entry point to pick a system notification placement (6 options). Selection is stored in `sessionStorage` for the browser session.
- `index.html` — Solutions / product offerings homepage ([excelerator.com/en/](https://excelerator.com/en/))
- `parts.html` — Parts & PartsProX homepage ([excelerator.com/truck-parts/en](https://excelerator.com/truck-parts/en))
- `coverage.html` — Extended Coverage homepage ([excelerator.com/coverage/en/](https://excelerator.com/coverage/en/))
- `connectivity.html` — Connectivity Services homepage ([excelerator.com/connectivity/en/](https://excelerator.com/connectivity/en/))

Logged-in headers on Parts / Coverage / Connectivity use the Figma **Customer View** product header. Logged-out matches live screenshots. Coverage subnav follows live: Shop Coverage, Enter VIN.

## System notification prototype

1. Open `options.html` and choose a placement.
2. Preview applies on all four homepages for that session.
3. Use **Back to Options** (shared control, bottom-left) to return; the current choice stays highlighted until you pick a different option.
4. Modal (Option 5) shows once per session. Other placements can be dismissed for the session.

## Run locally

Open `options.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

## Auth switch

Open the account control in the header:

- **ADXCustomer3** → **View logged out**
- **Sign In** → **View ADXCustomer3**

# Excelerator Design Sandbox

Local Bootstrap recreation of Excelerator pages for design exploration. Visuals match production unless a story deliberately explores alternatives.

## Start here

Open [`index.html`](index.html) — the **features hub**. It lists every story under review. Add a new story by appending one entry in [`js/features.js`](js/features.js).

```bash
npx --yes serve .
```

## Stories

| Story | Options landing |
| --- | --- |
| System Notification Banner | [`stories/notification-banner/options.html`](stories/notification-banner/options.html) |
| Dealer Access Approval | [`stories/dealer-access-approval/options.html`](stories/dealer-access-approval/options.html) |

Story folders follow:

```
stories/<story-name>/options.html
stories/<story-name>/options-story.js
stories/<story-name>/<option-name>/screen-1.html
```

### Dealer Access Approval

Shared flow:

- `email.html` — Outlook-wrapped Screen 1
- `screen-2.html` — Approve Dealer Access (Confirm routes by stored option)
- `decline.html` — shared decline end state

Per Screen 3 layout (`option-a` / `option-b` / `option-c`):

- `screen-3-with-steps.html` / `screen-3-no-steps.html`
- `skip-end.html` / `screen-4.html`

Options page: 3 cards × With/Without step indicator. Each link starts at Email with `?option=&steps=` so Confirm lands on the matching Screen 3.

### Options story pattern

Edit each story’s `options-story.js`:

- `title` / `intro` — hero copy
- `hubUrl` — link back to the features hub
- `previewUrl` or per-option `previewUrl` — where a card navigates
- `options` — `id`, `label`, `name`, `desc`; optional `image`, `prioritized`

Shared renderer: [`js/options-page.js`](js/options-page.js).

## Preview pages (notification story)

- `global-homepage.html` — Solutions homepage
- `parts.html` — Parts & PartsProX
- `coverage.html` — Extended Coverage
- `connectivity.html` — Connectivity Services

**Back to Options** on those pages returns to the notification-banner options story. Logo / Home links go to `global-homepage.html`.

## Auth switch

Open the account control in the header:

- **ADXCustomer3** → **View logged out**
- **Sign In** → **View ADXCustomer3**

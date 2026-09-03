# Excelerator Design Sandbox

Local Bootstrap recreation of Excelerator pages for design exploration. Visuals match production unless a story deliberately explores alternatives.

## Start here

Open [`index.html`](index.html) — the **features hub**. It lists every story under review. Add a new story by appending one entry in [`js/features.js`](js/features.js).

```bash
npx --yes serve .
```

## Stories

| Story | Entry |
| --- | --- |
| System Notification Banner | [`stories/notification-banner/options.html`](stories/notification-banner/options.html) |
| Customer Consent — dealer access approval | [`stories/dealer-access-approval/options.html`](stories/dealer-access-approval/options.html) |
| Customer Consent — consent on Update Customer | [`stories/my-customers/options.html`](stories/my-customers/options.html) |
| Customer Consent — shop as customer | [`stories/shop-as-customer/options.html`](stories/shop-as-customer/options.html) |
| Dealers — Extended Coverages | [`stories/dealers/index.html`](stories/dealers/index.html) |

Dealer Access Approval, My Customers, and Shop as Customer share one **Customer Consent** card on the features hub, since they belong to the same epic.

`stories/shop-as-customer/index.html` is the Customer Login Selection page. Rows come from `js/shop-as-customer.js`, and `?treatment=dim|lock|action|reason` switches how customers without approved consent are shown as non-selectable.

Options-based stories follow:

```
stories/<story-name>/options.html
stories/<story-name>/options-story.js
stories/<story-name>/<option-name>/…
```

### Dealer Access Approval

Options landing: [`stories/dealer-access-approval/options.html`](stories/dealer-access-approval/options.html).

- **Option 1 (prioritized)** `confirm-success/`: Confirm on Approve Dealer Access goes to `success.html` (no password setup, no Reset). Decline is unchanged.
- **Option 2** (root files): existing flow with optional password setup and Reset.

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

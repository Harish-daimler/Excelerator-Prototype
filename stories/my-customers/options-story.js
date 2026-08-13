/**
 * My Customers — consent placement options on Update Customer.
 */
window.ExOptionsStory = {
  pageTitle: "My Customers — Consent Options | Excelerator Prototype",
  title: "Customer consent on Update Customer",
  intro:
    "Review how dealer consent status, customer email, and resend actions appear on the Update Customer account page. Each option opens directly on a pending-consent scenario — the customer list is omitted for this review.",
  hubUrl: "../../index.html",
  storageKey: "ex-my-customers-consent",
  options: [
    {
      id: "panel",
      label: "Option 1",
      name: "Dedicated Consent Details panel",
      desc:
        "Standalone accordion section above Company Identity with full consent fields, email helper text, and resend action.",
      previewUrl: "consent-panel/update-customer.html",
    },
    {
      id: "banner",
      label: "Option 2",
      name: "Top-of-page alert banner",
      desc:
        "High-visibility callout below the title bar when consent is pending — account sections stay unchanged.",
      previewUrl: "consent-banner/update-customer.html",
    },
    {
      id: "inline",
      label: "Option 3",
      name: "Inline within Company Identity",
      desc:
        "Consent block at the top of Company Identity & Contact Information so email editing stays in context.",
      previewUrl: "consent-inline/update-customer.html",
    },
    {
      id: "titlebar",
      label: "Option 4",
      name: "Title bar badge + expandable strip",
      desc:
        "Consent status badge beside account badges; details expand in a compact strip between the title bar and sections.",
      previewUrl: "consent-titlebar/update-customer.html",
    },
  ],
};

/**
 * My Customers — consent placement options on Update Customer.
 */
window.ExOptionsStory = {
  pageTitle: "My Customers — Consent Options | Excelerator Prototype",
  title: "Customer consent on Update Customer",
  intro:
    "Business selected Option 1 as the direction to move forward. Click the prioritized option below to preview the Customer Consent Details section on the Update Customer page. Other explored directions are listed afterward for reference.",
  hubUrl: "../../index.html",
  storageKey: "ex-my-customers-consent",
  prioritizedHeading: "Prioritized — click to preview",
  otherHeading: "Other options explored",
  options: [
    {
      id: "panel",
      label: "Option 1",
      name: "Dedicated Customer Consent Details panel",
      desc:
        "Standalone accordion above Company Identity with consent status, blocked Shop As Customer note, customer email, request date with expiry, and a Resend Consent Request action. Business priority.",
      previewUrl: "consent-panel/update-customer.html",
      prioritized: true,
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

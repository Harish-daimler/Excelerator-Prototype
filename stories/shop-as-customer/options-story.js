/**
 * Shop as Customer — how to signal that a customer cannot be selected.
 *
 * Every preview is the same Customer Login Selection page; the query param
 * switches which blocked-row treatment is applied.
 */
window.ExOptionsStory = {
  pageTitle: "Shop as Customer — Blocked Row Options | Excelerator Prototype",
  title: "Selecting a customer without approved consent",
  intro:
    "Only customers with Approved consent can be shopped for. Pending, Declined, and Expired customers stay in the list but cannot be selected, and Pending or Expired rows offer a Resend Request action. Below are four ways to make the blocked state obvious — review the alternatives before we settle on one.",
  hubUrl: "../../index.html",
  storageKey: "ex-shop-as-customer-blocked",
  options: [
    {
      id: "dim",
      label: "Option 1",
      name: "Dimmed row, disabled chevron",
      desc:
        "The whole row drops to 55% opacity while the Consent Status column stays at full contrast, and the select chevron greys out as a disabled button. Lightest-touch change; reads as inactive at a glance but the customer data is harder to scan.",
      previewUrl: "index.html?treatment=dim",
    },
    {
      id: "lock",
      label: "Option 2",
      name: "Full contrast row, lock icon",
      desc:
        "Row keeps normal contrast so all data stays readable, and the chevron is replaced by a lock chip with a hover tooltip naming the reason. Best for accessibility, but the block is only visible in the last column.",
      previewUrl: "index.html?treatment=lock",
    },
    {
      id: "action",
      label: "Option 3",
      name: "Action column states what is possible",
      desc:
        "The last column spells out the one available action per row: “Shop as customer” when approved, “Resend Request” when pending or expired, and “Unavailable” when declined. No disabled controls at all, so nothing looks broken.",
      previewUrl: "index.html?treatment=action",
    },
    {
      id: "reason",
      label: "Option 4",
      name: "Greyed row with inline reason",
      desc:
        "Row is greyed and a short reason line sits under the customer name — “Awaiting customer consent”, “Customer declined consent”, or “Consent request expired”. Most explicit, at the cost of taller rows.",
      previewUrl: "index.html?treatment=reason",
    },
  ],
};

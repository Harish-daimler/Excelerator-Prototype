/**
 * Dealers — Extended Coverages. Dealer chooses packages to show after VIN.
 * No pricing. Terms are presented differently in each option.
 */
window.ExOptionsStory = {
  pageTitle: "Dealers — Extended Coverages Options | Excelerator Prototype",
  title: "What the dealer shows after VIN",
  intro:
    "Business no longer wants a pricing or discount setup. Review these directions for how a dealer picks packages to show, how terms appear without a pricing table, and how we explain the 7-year / 750,000-mile cap. If a truck is not eligible for the dealer’s selected packages, every package is shown. None of these options is prioritized yet.",
  hubUrl: "../../index.html",
  storageKey: "ex-dealer-vin-packages",
  options: [
    {
      id: "toggle-cards",
      label: "Option 1",
      name: "Family cards with term chips",
      desc:
        "Available Coverages stays close to today’s dealer admin. OPTIMUM and NEXT each have Engine and Chassis families. Terms (Basic / Enhanced / Ultimate, En2–En4, ENTC2–ENTC4) are selectable chips — not a year/mile table.",
      previewUrl: "toggle-cards/index.html",
    },
    {
      id: "catalog-table",
      label: "Option 2",
      name: "Flat catalog of the 12 terms",
      desc:
        "One table row per term, with bulk Show/Hide. Reuses a product-list pattern. The term name is a column; there is no nested pricing grid.",
      previewUrl: "catalog-table/index.html",
    },
    {
      id: "live-preview",
      label: "Option 3",
      name: "Dealer checklist with truck scenarios",
      desc:
        "Left: toggle families. Right: the customer listing. Switch among an eligible truck, a truck that is not eligible for the dealer’s picks (all packages show), and a truck over 7 years / 750,000 miles (no coverages).",
      previewUrl: "live-preview/index.html",
    },
    {
      id: "vin-results",
      label: "Option 4",
      name: "Customer VIN lookup, terms as a dropdown",
      desc:
        "Starts from Shop Coverage. Sample VINs demonstrate eligibility, the all-packages fallback, and the age/mileage cap. Listing cards show the family name with a term dropdown instead of a table.",
      previewUrl: "vin-results/index.html",
    },
  ],
};

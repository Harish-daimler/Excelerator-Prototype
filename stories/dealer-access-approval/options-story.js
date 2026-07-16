/**
 * Dealer Access Approval — options story config.
 */
window.ExOptionsStory = {
  pageTitle: "Dealer Access Approval Options | Excelerator Prototype",
  title: "Dealer Access Approval",
  intro:
    "Compare three layout directions. Start at Screen 1 for the full flow, or jump to either Screen 3 variant (optional password setup after approval). Skip-end and Screen 4 are reachable by continuing from Screen 3.",
  hubUrl: "../../index.html",
  storageKey: "ex-dealer-access-layout",
  options: [
    {
      id: "option-a",
      label: "Option A",
      name: "Dealership hero stack",
      desc: "Large dealership name as the card title, with that dealership’s address and phone directly underneath. Dealer family sits separately below so it isn’t read as the contact owner.",
      links: [
        { label: "Start at Screen 1", href: "option-a/screen-1.html" },
        {
          label: "Screen 3 · with steps",
          href: "option-a/screen-3-with-steps.html",
        },
        {
          label: "Screen 3 · no steps",
          href: "option-a/screen-3-no-steps.html",
        },
      ],
    },
    {
      id: "option-b",
      label: "Option B",
      name: "Dealership vs. family columns",
      desc: "Left column is the dealership block (name + address + phone). Right column holds dealer family as affiliation — contact details stay with Fort Mill Freightliner.",
      links: [
        { label: "Start at Screen 1", href: "option-b/screen-1.html" },
        {
          label: "Screen 3 · with steps",
          href: "option-b/screen-3-with-steps.html",
        },
        {
          label: "Screen 3 · no steps",
          href: "option-b/screen-3-no-steps.html",
        },
      ],
    },
    {
      id: "option-c",
      label: "Option C",
      name: "Featured name band",
      desc: "Dealership name in a full-width highlight band. Address and phone sit directly under it as dealership details; dealer family is separated below.",
      links: [
        { label: "Start at Screen 1", href: "option-c/screen-1.html" },
        {
          label: "Screen 3 · with steps",
          href: "option-c/screen-3-with-steps.html",
        },
        {
          label: "Screen 3 · no steps",
          href: "option-c/screen-3-no-steps.html",
        },
      ],
    },
  ],
};

/**
 * Dealer Access Approval — options story config.
 */
window.ExOptionsStory = {
  pageTitle: "Dealer Access Approval Options | Excelerator Prototype",
  title: "Dealer Access Approval",
  intro:
    "Screen 1 (email) and Screen 2 are shared. Choose a Screen 3 direction and whether to keep the step indicator — both links start at the shared email, and Confirm on Screen 2 routes to the matching Screen 3.",
  hubUrl: "../../index.html",
  storageKey: "ex-dealer-access-layout",
  options: [
    {
      id: "option-a",
      label: "Option A",
      name: "Dealership hero stack",
      desc: "Large dealership name as the focal title, with address and phone directly underneath. Dealer family sits separately below.",
      links: [
        {
          label: "With step indicator",
          href: "email.html?option=option-a&steps=with-steps",
        },
        {
          label: "Without step indicator",
          href: "email.html?option=option-a&steps=no-steps",
        },
      ],
    },
    {
      id: "option-b",
      label: "Option B",
      name: "Dealership vs. family columns",
      desc: "Left column is the dealership block (name + address + phone). Right column holds dealer family as affiliation.",
      links: [
        {
          label: "With step indicator",
          href: "email.html?option=option-b&steps=with-steps",
        },
        {
          label: "Without step indicator",
          href: "email.html?option=option-b&steps=no-steps",
        },
      ],
    },
    {
      id: "option-c",
      label: "Option C",
      name: "Featured name band",
      desc: "Dealership name in a full-width highlight band. Address and phone sit under it; dealer family is separated below.",
      links: [
        {
          label: "With step indicator",
          href: "email.html?option=option-c&steps=with-steps",
        },
        {
          label: "Without step indicator",
          href: "email.html?option=option-c&steps=no-steps",
        },
      ],
    },
  ],
};

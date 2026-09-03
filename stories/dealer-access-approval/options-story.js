/**
 * Dealer Access Approval — post-confirm destination options.
 */
window.ExOptionsStory = {
  pageTitle: "Dealer Access Approval Options | Excelerator Prototype",
  title: "Dealer Access Approval",
  intro:
    "Business selected Option 1 as the direction to move forward. Click the prioritized option below to preview the customer email flow. Other explored directions are listed afterward for reference.",
  hubUrl: "../../index.html",
  storageKey: "ex-dealer-access-approval",
  prioritizedHeading: "Prioritized — click to preview",
  otherHeading: "Other options explored",
  options: [
    {
      id: "confirm-success",
      label: "Option 1",
      name: "Confirm to success — no password setup",
      desc:
        "After Confirm on Approve Dealer Access, the customer lands on You’re all set. There is no password setup step and no Reset on the approval screen. Decline is unchanged.",
      previewUrl: "confirm-success/email.html",
      prioritized: true,
    },
    {
      id: "with-password",
      label: "Option 2",
      name: "Approve with optional password setup",
      desc:
        "Confirm opens optional password setup. The customer can create a password now or choose Set up later. Reset remains on the approval screen.",
      previewUrl: "email.html",
    },
  ],
};

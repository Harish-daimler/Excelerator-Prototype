/**
 * BOM selected-part treatment.
 * Dark bar is the prioritized direction. ADXCustomer6 and ADXCustomer Purchase
 * open that treatment from the module list. Other directions stay for reference.
 */
window.ExOptionsStory = {
  pageTitle: "BOM selected part options | Excelerator Prototype",
  title: "How a selected part stands out",
  intro:
    "Dark bar is the direction to move forward. ADXCustomer6 and ADXCustomer Purchase open it from the module list. ADXCustomer6 keeps Contact Dealer. ADXCustomer Purchase keeps price, quantity, and cart. Detail View and Image View use the same part card. Grid View uses the table. Other explored directions are listed afterward. None of these is a Toolbox selected-row pattern — UiTable does not include a selected state.",
  hubUrl: "../../index.html",
  prioritizedHeading: "Prioritized — click to preview",
  otherHeading: "Other options explored",
  options: [
    {
      id: "tint",
      label: "Option 1",
      name: "Color bar",
      desc: "The selected card and the selected grid row get a primary left bar and a light blue fill. Everything else stays as it is. Image View uses that same card. Closest reference is a selected table row, which Toolbox does not ship.",
      previewUrl: "../bom-part-highlight/coolant.html?highlight=tint",
    },
    {
      id: "navy",
      label: "Option 5",
      name: "Dark bar",
      desc: "The selected card stays white, with an #1F2244 bar on the left and the callout number in white on that bar. Back To Parts List on the card clears the selection. Grid View paints only the part row: the ref cell is #1F2244 with a white number, and the footnote stays gray. ADXCustomer6 keeps Contact Dealer. ADXCustomer Purchase shows price, quantity, and cart on purchasable parts. #1F2244 is not a Toolbox color, and UiTable has no selected state.",
      previewUrl: "../bom-part-highlight/coolant.html?highlight=navy",
      prioritized: true,
    },
    {
      id: "dim",
      label: "Option 2",
      name: "Fade the others",
      desc: "Unselected cards and rows fade back, so the selected part stays at full strength with a primary outline. Useful in a long list. Image View still shows only the matching card.",
      previewUrl: "../bom-part-highlight/coolant.html?highlight=dim",
    },
    {
      id: "walk",
      label: "Option 3",
      name: "Walk the numbers",
      desc: "The full list stays. Previous and Next step through the parts in list order, move the outline on the diagram, and scroll that part into view. Image View swaps to that part’s card. Toolbox has no previous/next control for a parts list. A similar step-through is the Adobe Express slideshow control.",
      previewUrl: "../bom-part-highlight/coolant.html?highlight=walk",
    },
    {
      id: "near",
      label: "Option 4",
      name: "Parts drawn next to it",
      desc: "The part you picked is grouped with the three numbers closest to it on the diagram. Those stay full cards. Every other part stays a full card under Rest of the system. Grid View uses the same two groups. Image View shows that cluster. This grouping is not a Toolbox table pattern.",
      previewUrl: "../bom-part-highlight/coolant.html?highlight=near",
    },
  ],
};

/**
 * System Notification Banner — options story config.
 * Edit this file to change titles, intro, and option cards for this story.
 */
window.ExOptionsStory = {
  pageTitle: "System Notification Placement Options | Excelerator Prototype",
  title: "System notification placement",
  intro:
    "Business selected Option 1 as the direction to move forward. Click the prioritized option below to preview the updated yellow banner. Other explored directions are listed afterward for reference.",
  hubUrl: "../../index.html",
  previewUrl: "../../global-homepage.html",
  storageKey: "ex-notice-placement",
  prioritizedHeading: "Prioritized — click to preview",
  otherHeading: "Other options explored",
  options: [
    {
      id: "1a",
      label: "Option 1",
      name: "Top strip, above the header",
      desc: "Full-width yellow notice above site chrome — highest visibility on every page. Business priority.",
      prioritized: true,
    },
    {
      id: "1b",
      label: "Option 2",
      name: "Banner below the nav bar",
      desc: "In-page banner under navigation; supports stacking multiple messages.",
    },
    {
      id: "1c",
      label: "Option 3",
      name: "Floating toast, corner-anchored",
      desc: "Non-blocking corner card that stays visible without shifting layout.",
    },
    {
      id: "1d",
      label: "Option 4",
      name: "Header alert icon + dropdown center",
      desc: "Persistent header bell with a panel of active notices and timestamps.",
    },
    {
      id: "1e",
      label: "Option 5",
      name: "Interstitial modal on entry",
      desc: "Blocking acknowledgment dialog shown once per session for critical updates.",
    },
    {
      id: "1f",
      label: "Option 6",
      name: "Bottom status ticker",
      desc: "Persistent footer ticker that expands for full detail without covering the hero.",
    },
  ],
};

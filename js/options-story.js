/**
 * Options story config — edit this file for each new feature review.
 *
 * Swap title, intro, options, and previewUrl; cards re-render from this list.
 * Optional `image` on an option shows a thumbnail; omit it for text-only cards.
 */
window.ExOptionsStory = {
  pageTitle: "System Notification Placement Options | Excelerator Prototype",
  title: "System notification placement",
  intro:
    "We're exploring design directions for the system notification banner. Review each option below and choose the one you'd like us to move forward with. Your selection is saved for this browser session and highlighted when you return here.",
  /** Where to send the user after they pick an option */
  previewUrl: "global-homepage.html",
  /**
   * sessionStorage key for the selected option id.
   * Keep in sync with js/notification-placement.js (STORAGE_KEY) for this story.
   */
  storageKey: "ex-notice-placement",
  options: [
    {
      id: "1a",
      label: "Option 1",
      name: "Top strip, above the header",
      desc: "Full-width notice above site chrome — highest visibility on every page.",
      // image: "assets/images/options/1a.png",
    },
    {
      id: "1b",
      label: "Option 2",
      name: "Banner below the nav bar",
      desc: "In-page banner under navigation; supports stacking multiple messages.",
      // image: "assets/images/options/1b.png",
    },
    {
      id: "1c",
      label: "Option 3",
      name: "Floating toast, corner-anchored",
      desc: "Non-blocking corner card that stays visible without shifting layout.",
      // image: "assets/images/options/1c.png",
    },
    {
      id: "1d",
      label: "Option 4",
      name: "Header alert icon + dropdown center",
      desc: "Persistent header bell with a panel of active notices and timestamps.",
      // image: "assets/images/options/1d.png",
    },
    {
      id: "1e",
      label: "Option 5",
      name: "Interstitial modal on entry",
      desc: "Blocking acknowledgment dialog shown once per session for critical updates.",
      // image: "assets/images/options/1e.png",
    },
    {
      id: "1f",
      label: "Option 6",
      name: "Bottom status ticker",
      desc: "Persistent footer ticker that expands for full detail without covering the hero.",
      // image: "assets/images/options/1f.png",
    },
  ],
};

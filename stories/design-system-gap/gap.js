(function () {
  var figma = "https://www.figma.com/design/j4tmSq4xaMwBgkyx5PQOU5/Excelerator-Global-Design-System?node-id=";
  var showcase = "https://qa1.excelerator.parts/en/showcase#";

  function figmaPanel(node, caption) {
    return {
      label: "Figma",
      flag: "Difference",
      src: null,
      caption: caption,
      href: figma + node,
      hrefLabel: "Open in Figma"
    };
  }

  var items = {
    links: {
      title: "Links",
      kind: "Missing in Figma",
      summary: "The showcase has link styles. The Figma file has no Links page.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Missing in Figma",
          src: "images/dev-links.png",
          caption: "Primary link, secondary link, and a link that looks like a button.",
          href: showcase + "links",
          hrefLabel: "Open in the showcase"
        }
      ]
    },
    "toggle-switch": {
      title: "Toggle and Switch",
      kind: "Discrepancy",
      summary: "Both systems have an on/off style control. They are not the same component.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Two-choice toggle",
          src: "images/dev-toggle.png",
          caption: "Start Coverage / Extend Coverage. One option is filled, the other is an outline.",
          href: showcase + "toggle",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Yes / No switch",
          src: "images/figma-switch.png",
          caption: "On, off, and disabled switch. This does not cover the coverage toggle.",
          href: figma + "9514-10795",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    navigation: {
      title: "Navigation menu and navbar",
      kind: "Discrepancy",
      summary: "The showcase menu and the Figma header are different components.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Flyout menu",
          src: "images/dev-nav.png",
          caption: "Click and hover flyouts, nested fly-outs, and start / center / end alignment. This pattern is not a Figma page.",
          href: showcase + "navigation-menu",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Site header",
          src: "images/figma-navbar.png",
          caption: "Sitewide navbar and header. This is product chrome, not the flyout menu.",
          href: figma + "7577-7517",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    "icon-button": {
      title: "Icon-only button",
      kind: "Discrepancy",
      summary: "Figma has a button that is only an icon. The showcase always keeps a text label with the icon.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Label stays with the icon",
          src: "images/dev-buttons.png",
          caption: "With Icon Large, Medium, and Small all include the words and the star.",
          href: showcase + "buttons",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Icon only",
          src: "images/figma-icon-button.png",
          caption: "Tertiary icon-only button on the Buttons page. No text label.",
          href: figma + "7608-776",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    spacing: {
      title: "Spacing",
      kind: "Discrepancy",
      summary: "Both sides document spacing. Figma’s page is marked to be removed, and the scales do not match.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Still shipped, and the scale goes past 32",
          src: "images/dev-spacing.png",
          caption: "Utilities run p-25 = 4px through p-275 = 44px and keep going.",
          href: showcase + "spacing",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Marked to be removed, scale stops at 32",
          src: "images/figma-spacing.png",
          caption: "Steps of 4 from 4 through 32. The page sits under To be removed.",
          href: figma + "7571-12329",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    progress: {
      title: "Progress bars",
      kind: "Discrepancy",
      summary: "The bars match. The discrepancy is that Figma has marked this page to be removed and the showcase still ships it.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Still shipped",
          src: "images/dev-progress.png",
          caption: "Examples, labels, height, and background colors are still on the showcase.",
          href: showcase + "progress",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Marked to be removed",
          src: "images/figma-progress.png",
          caption: "Same examples, labels, height, and background colors. The page sits under To be removed.",
          href: figma + "7579-17891",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    popovers: {
      title: "Popovers",
      kind: "Discrepancy",
      summary: "Figma shows the open popover. The showcase shows trigger buttons, including a red one, and the page is marked to be removed in Figma.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Trigger buttons, including a red one",
          src: "images/dev-popovers.png",
          caption: "A red Click to toggle popover button, plus top, right, bottom, and left triggers.",
          href: showcase + "popovers",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Open panel, marked to be removed",
          src: "images/figma-popovers.png",
          caption: "The open popover with a title and body, in four directions. No red trigger. Page sits under To be removed.",
          href: figma + "7579-17620",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    offcanvas: {
      title: "Offcanvas",
      kind: "Discrepancy",
      summary: "Figma shows the open drawer. The showcase shows only a trigger button, and Figma has marked the page to be removed.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Trigger only",
          src: "images/dev-offcanvas.png",
          caption: "A button labeled Button with data-bs-target. The drawer itself is not shown.",
          href: showcase + "offcanvas",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Open drawer, marked to be removed",
          src: "images/figma-offcanvas.png",
          caption: "The offcanvas panel is drawn open. The page sits under To be removed.",
          href: figma + "7571-12854",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    listgroup: {
      title: "List group",
      kind: "Discrepancy",
      summary: "The showcase ships live list patterns. Figma’s page is a spec frame and is marked to be removed.",
      panels: [
        {
          label: "Developer showcase",
          flag: "Still shipped",
          src: "images/dev-listgroup.png",
          caption: "Active row, numbered items, badges, checkboxes, radios, and a horizontal list.",
          href: showcase + "listgroup",
          hrefLabel: "Open in the showcase"
        },
        {
          label: "Figma",
          flag: "Spec frames, marked to be removed",
          src: "images/figma-listgroup.png",
          caption: "List item, badge, and stacked frames. The page sits under To be removed.",
          href: figma + "7577-5488",
          hrefLabel: "Open in Figma"
        }
      ]
    },
    divider: missingFigma("Divider", "images/figma-divider.png", "A horizontal rule. The showcase has no divider section.", "9619-106"),
    filters: missingFigma("Filters", "images/figma-filters.png", "Status filter and coverage filter, with Clear and Apply. The showcase has no filters section.", "8498-12225"),
    scrollbar: missingFigma("Scrollbar", "images/figma-scrollbar.png", "Scrollbar thumb. The showcase has no scrollbar section.", "9689-13077"),
    media: missingFigma("Media object", "images/figma-media.png", "Image-and-text rows, alignment, and a media list. The showcase has no media object section.", "7577-5847"),
    swap: missingFigma("Swap block", "images/figma-swap.png", "Swap block variants. The showcase has no swap block section.", "8476-28473"),
    garage: missingFigma("Parts — My Garage", "images/figma-garage.png", "My Garage components from the Figma file. Not on the showcase.", "9180-15934"),
    listing: missingFigma("Parts — Listing page", "images/figma-listing.png", "Listing page components from the Figma file. Not on the showcase.", "9204-2604"),
    quotes: missingFigma("Parts — Quotes", "images/figma-quotes.png", "Quotes components from the Figma file. Not on the showcase.", "8460-123"),
    cart: missingFigma("Services — Cart", "images/figma-cart.png", "Cart page components from the Figma file. Not on the showcase.", "8295-1314"),
    hero: missingFigma("Services — Hero", "images/figma-hero.png", "Hero sections from the Figma file. Not on the showcase.", "8497-31"),
    tabs: missingFigma("Services — Section with tabs", "images/figma-tabs.png", "Section with tabs from the Figma file. Not on the showcase.", "8498-636"),
    empty: missingFigma("Services — Empty state", "images/figma-empty.png", "Empty state from the Figma file. Not on the showcase.", "8165-516"),
    user: missingFigma("Sitewide — User dropdown", "images/figma-user.png", "User dropdown from the Figma file. Not on the showcase.", "8103-13564"),
    footer: missingFigma("Sitewide — Footer", "images/figma-footer.png", "Footer from the Figma file. Not on the showcase.", "8488-27920"),
    templates: missingFigma("Sitewide — Page templates", "images/figma-templates.png", "Page templates from the Figma file. Not on the showcase.", "8666-416")
  };

  function missingFigma(title, src, caption, node) {
    return {
      title: title,
      kind: "Missing in the developer showcase",
      summary: "This component is in the Figma file and is not a section on the QA showcase.",
      panels: [
        {
          label: "Figma",
          flag: "Missing in the developer showcase",
          src: src,
          caption: caption,
          href: figma + node,
          hrefLabel: "Open in Figma"
        }
      ]
    };
  }

  var root = document.getElementById("gap-detail");
  if (!root) return;
  var id = "";
  try {
    id = new URLSearchParams(window.location.search).get("id") || "";
  } catch (e) {}
  var item = items[id];
  if (!item) {
    root.innerHTML = "<p>That comparison is not on this page. <a href=\"index.html\">Back to the gap list</a>.</p>";
    return;
  }
  document.title = item.title + " | Design system gap";
  var pair = item.panels.length > 1 ? " gap-compare--pair" : "";
  var html = "<p class=\"gap-lead\">" + item.kind + ". " + item.summary + "</p><div class=\"gap-compare" + pair + "\">";
  item.panels.forEach(function (panel) {
    html +=
      "<figure class=\"gap-panel is-diff\">" +
      "<p class=\"gap-flag\">" + panel.flag + "</p>" +
      "<h2>" + panel.label + "</h2>" +
      "<img src=\"" + panel.src + "\" alt=\"" + panel.label + " — " + item.title + "\">" +
      "<figcaption>" + panel.caption + " <a href=\"" + panel.href + "\" target=\"_blank\" rel=\"noopener\">" + panel.hrefLabel + "</a></figcaption>" +
      "</figure>";
  });
  html += "</div>";
  root.innerHTML = html;
  var heading = document.getElementById("gap-title");
  if (heading) heading.textContent = item.title;
})();

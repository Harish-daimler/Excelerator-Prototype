(function () {
  var figma = "https://www.figma.com/design/j4tmSq4xaMwBgkyx5PQOU5/Excelerator-Global-Design-System?node-id=";
  var toolbox = "https://qa1.excelerator.parts/en/showcase/toolbox#";
  var oldImg = "../design-system-gap/images/";

  function panel(label, flag, src, caption, href, hrefLabel) {
    return {
      label: label,
      flag: flag,
      src: src,
      caption: caption,
      href: href,
      hrefLabel: hrefLabel
    };
  }

  function figmaOnly(title, src, caption, node, summary) {
    return {
      title: title,
      kind: "Missing in the toolbox",
      summary: summary || "This page is in the Figma file. The toolbox has no section for it.",
      panels: [
        panel("Figma", "Missing in the toolbox", src, caption, figma + node, "Open in Figma")
      ]
    };
  }

  function toolboxOnly(title, src, caption, hash) {
    return {
      title: title,
      kind: "Missing in Figma",
      summary: "The toolbox has this. The Figma file has no page for it.",
      panels: [
        panel("Toolbox", "Missing in Figma", src, caption, toolbox + hash, "Open in the toolbox")
      ]
    };
  }

  var removed = "This page is in the Figma file and is marked to be removed. The toolbox has no section for it.";

  var items = {
    datepicker: toolboxOnly(
      "Date picker",
      "images/toolbox-datepicker.png",
      "Calendar field with a placeholder, selected value, min and max, and typed dates.",
      "ui-datepicker"
    ),
    multiselect: toolboxOnly(
      "Multi-select",
      "images/toolbox-multiselect.png",
      "Multi-value field with a chip display and a max. This example caps the selection at 3.",
      "ui-multi-select"
    ),
    picker: toolboxOnly(
      "Picker dialog",
      "images/toolbox-picker.png",
      "Opens a dialog with a custom selection template.",
      "ui-picker-dialog"
    ),
    paper: toolboxOnly(
      "Paper",
      "images/toolbox-paper.png",
      "Surface with elevation 0–5, an outlined variant, and square corners.",
      "ui-paper"
    ),
    grid: toolboxOnly(
      "Grid",
      "images/toolbox-grid.png",
      "Responsive columns, a full-width span, and row span with order.",
      "ui-grid"
    ),
    upload: toolboxOnly(
      "Upload",
      "images/toolbox-upload.png",
      "Upload File button with MIME and size checks. The published library has a component named Upload File. The file has no Upload page.",
      "ui-upload-action"
    ),
    download: toolboxOnly(
      "Download",
      "images/toolbox-upload.png",
      "Download CSV button. Direct blob download and a scheduled notification. The Figma file has no Download page.",
      "ui-download-action"
    ),
    dialog: {
      title: "Dialog and modal",
      kind: "Discrepancy",
      summary: "Toolbox documents UiDialog as a trigger and markup. Figma shows the open modal.",
      panels: [
        panel(
          "Toolbox",
          "Trigger and markup",
          "images/toolbox-dialog.png",
          "Open Dialog and Open Confirm Dialog. The page does not show the dialog open.",
          toolbox + "ui-dialog",
          "Open in the toolbox"
        ),
        panel(
          "Figma",
          "Open modal",
          "images/figma-modal-crop.png",
          "Modal Title with a field, Cancel, and Save Changes, plus a smaller dialog.",
          figma + "7577-5896",
          "Open in Figma"
        )
      ]
    },
    messages: {
      title: "Global messages and toast",
      kind: "Discrepancy",
      summary: "Both are transient messages. Toolbox names them GlobalMessages and shows four triggers. Figma names the page Toasts and shows the banner.",
      panels: [
        panel(
          "Toolbox",
          "Four triggers",
          "images/toolbox-messages.png",
          "Show Confirmation, Show Info, Show Warning, and Show Error. Confirmation and info dismiss on a timer. Warning and error stay until dismissed.",
          toolbox + "global-messages",
          "Open in the toolbox"
        ),
        panel(
          "Figma",
          "Toast banner",
          "images/figma-toast-crop.png",
          "A solid toast and a light toast with a close control.",
          figma + "7579-17949",
          "Open in Figma"
        )
      ]
    },
    drawer: {
      title: "Drawer and offcanvas",
      kind: "Discrepancy",
      summary: "Toolbox UiDrawer is a Bootstrap offcanvas drawer. Figma draws the panel open and has marked the page to be removed.",
      panels: [
        panel(
          "Toolbox",
          "Open triggers",
          "images/toolbox-drawer.png",
          "Light, dark, and four edges: end, start, top, and bottom. The page shows the buttons that open the drawer.",
          toolbox + "ui-drawer",
          "Open in the toolbox"
        ),
        panel(
          "Figma",
          "Open panel, marked to be removed",
          oldImg + "figma-offcanvas.png",
          "The offcanvas panel is drawn open. The page sits under To be removed.",
          figma + "7571-12854",
          "Open in Figma"
        )
      ]
    },
    colors: figmaOnly(
      "Colors",
      "images/figma-colors.png",
      "Primary, secondary, tertiary, status, gray, text, icon, and background colors.",
      "7571-11613"
    ),
    icons: figmaOnly("Icons", "images/figma-icons.png", "Icon set.", "7599-14"),
    shadows: figmaOnly(
      "Shadows",
      "images/figma-shadows.png",
      "No shadow, small shadow, regular shadow, and larger shadow.",
      "7571-12414"
    ),
    radius: figmaOnly("Radius", "images/figma-radius.png", "Corner radius.", "7579-16978"),
    borders: figmaOnly(
      "Borders",
      "images/figma-borders.png",
      "Additive and subtractive borders, border-radius, and sizes.",
      "7571-12810"
    ),
    carousel: figmaOnly(
      "Carousel",
      "images/figma-carousel.png",
      "Slides with previous and next arrows and slide indicators.",
      "7571-12869"
    ),
    tooltips: figmaOnly(
      "Tooltips",
      "images/figma-tooltips-crop.png",
      "Tooltip on the right, left, top, and bottom.",
      "7579-17964"
    ),
    divider: figmaOnly("Divider", oldImg + "figma-divider.png", "A horizontal rule.", "9619-106"),
    filters: figmaOnly(
      "Filters",
      oldImg + "figma-filters.png",
      "Status filter and coverage filter, with Clear and Apply.",
      "8498-12225"
    ),
    scrollbar: figmaOnly("Scrollbar", oldImg + "figma-scrollbar.png", "Scrollbar thumb.", "9689-13077"),
    spacing: figmaOnly(
      "Spacing",
      oldImg + "figma-spacing.png",
      "The spacing page stops at 32 and sits under To be removed.",
      "7571-12329",
      removed
    ),
    progress: figmaOnly(
      "Progress bars",
      oldImg + "figma-progress.png",
      "Progress bars. The page sits under To be removed.",
      "7579-17891",
      removed
    ),
    popovers: figmaOnly(
      "Popovers",
      oldImg + "figma-popovers.png",
      "The popover is drawn open. The page sits under To be removed.",
      "7579-17620",
      removed
    ),
    listgroup: figmaOnly(
      "List group",
      oldImg + "figma-listgroup.png",
      "List item, badge, and stacked frames. The page sits under To be removed.",
      "7577-5488",
      removed
    ),
    media: figmaOnly(
      "Media object",
      oldImg + "figma-media.png",
      "Image-and-text rows, alignment, and a media list.",
      "7577-5847"
    ),
    swap: figmaOnly("Swap block", oldImg + "figma-swap.png", "Swap block variants.", "8476-28473"),
    navbar: figmaOnly(
      "Sitewide — navbar and header",
      oldImg + "figma-navbar.png",
      "Sitewide navbar and header.",
      "7577-7517"
    ),
    garage: figmaOnly("Parts — My Garage", oldImg + "figma-garage.png", "My Garage components.", "9180-15934"),
    listing: figmaOnly("Parts — listing page", oldImg + "figma-listing.png", "Listing page components.", "9204-2604"),
    quotes: figmaOnly("Parts — quotes", oldImg + "figma-quotes.png", "Quotes components.", "8460-123"),
    cart: figmaOnly("Services — cart", oldImg + "figma-cart.png", "Cart page components.", "8295-1314"),
    hero: figmaOnly("Services — hero", oldImg + "figma-hero.png", "Hero sections.", "8497-31"),
    tabs: figmaOnly(
      "Services — section with tabs",
      oldImg + "figma-tabs.png",
      "A tabbed page section. Toolbox UiTabs is the tab control, which lines up with the Tabs component page. This section is not in the toolbox.",
      "8498-636"
    ),
    empty: figmaOnly("Services — empty state", oldImg + "figma-empty.png", "Empty state.", "8165-516"),
    user: figmaOnly("Sitewide — user dropdown", oldImg + "figma-user.png", "User dropdown.", "8103-13564"),
    footer: figmaOnly("Sitewide — footer", oldImg + "figma-footer.png", "Footer.", "8488-27920"),
    templates: figmaOnly("Sitewide — page templates", oldImg + "figma-templates.png", "Page templates.", "8666-416"),
    "for-designers": figmaOnly(
      "Sitewide — for designers",
      "images/figma-for-designers.png",
      "A dashed placeholder frame. A note in the corner says Persistent questions, tbd.",
      "9585-7128"
    )
  };

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
  var layout = item.panels.length > 1 ? " gap-compare--pair" : "";
  var html = "<p class=\"gap-lead\">" + item.kind + ". " + item.summary + "</p><div class=\"gap-compare" + layout + "\">";
  item.panels.forEach(function (panel) {
    var img = panel.src
      ? "<img src=\"" + panel.src + "\" alt=\"" + panel.label + " — " + item.title + "\">"
      : "";
    html +=
      "<figure class=\"gap-panel is-diff\">" +
      "<p class=\"gap-flag\">" + panel.flag + "</p>" +
      "<h2>" + panel.label + "</h2>" +
      img +
      "<figcaption>" + panel.caption + " <a href=\"" + panel.href + "\" target=\"_blank\" rel=\"noopener\">" + panel.hrefLabel + "</a></figcaption>" +
      "</figure>";
  });
  html += "</div>";
  root.innerHTML = html;
  var heading = document.getElementById("gap-title");
  if (heading) heading.textContent = item.title;
})();

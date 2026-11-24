(function () {
  var v6 = "https://getbootstrap.com/docs/6.0/";
  var figma = "https://www.figma.com/design/j4tmSq4xaMwBgkyx5PQOU5/Excelerator-Global-Design-System?node-id=";
  var toolbox = "https://qa1.excelerator.parts/en/showcase/toolbox#";
  var cur = "../design-system-gap-current/images/";
  var old = "../design-system-gap/images/";

  function panel(label, flag, src, caption, href, hrefLabel) {
    return { label: label, flag: flag, src: src, caption: caption, href: href, hrefLabel: hrefLabel };
  }

  function figmaOnly(title, src, caption, node) {
    return {
      title: title,
      tab: "figma",
      kind: "Missing in Bootstrap 6",
      summary: "This page is in the Figma file. Bootstrap 6 has no matching component.",
      panels: [panel("Figma", "Missing in Bootstrap 6", src, caption, figma + node, "Open in Figma")]
    };
  }

  var items = {
    "tb-menu": {
      title: "Menu selected state",
      tab: "toolbox",
      kind: "Discrepancy",
      summary: "Both have a current item. Bootstrap 6 draws it as a rounded primary row inside the menu padding.",
      panels: [
        panel("Toolbox", "Active colour token", null, "UiDropdownMenu sets aria-current on the active item and uses an active colour token. The menu is still the toolbox dropdown, with icons, badges, and nested flyouts.", toolbox + "ui-dropdown-menu", "Open in the toolbox"),
        panel("Bootstrap 6", "Rounded primary row", "images/v6-menu-active.png", "Active link sits on the primary background with rounded corners, inset from the menu edge. Hover on the other rows is a light fill.", v6 + "components/menu/#active", "Open the Bootstrap 6 docs")
      ]
    },
    "tb-drawer": {
      title: "Drawer",
      tab: "toolbox",
      kind: "Discrepancy",
      summary: "The names match. The toolbox drawer is still a Bootstrap offcanvas. Bootstrap 6 rebuilt Drawer on the native dialog element.",
      panels: [
        panel("Toolbox", "Offcanvas drawer", cur + "toolbox-drawer.png", "Light and dark, and four edges. The page shows the buttons that open it. The copy says it is a Bootstrap offcanvas controlled by Angular.", toolbox + "ui-drawer", "Open in the toolbox"),
        panel("Bootstrap 6", "Native dialog", null, "Offcanvas was renamed Drawer. The element is a dialog, with swipe to dismiss and the same show and hide lifecycle as Dialog.", v6 + "components/drawer/", "Open the Bootstrap 6 docs")
      ]
    },
    "tb-buttons": {
      title: "Button classes",
      tab: "toolbox",
      kind: "Discrepancy",
      summary: "Both have solid, outline, and icon-only buttons. The class model is different.",
      panels: [
        panel("Toolbox", "Variant names", cur + "toolbox-button.png", "primary, secondary, tertiary, success, warning, danger, and link, plus outline, loading, disabled, and an Icon only column.", toolbox + "ui-button", "Open in the toolbox"),
        panel("Bootstrap 6", "Variant plus theme", null, "btn-solid, btn-outline, btn-subtle, and btn-text combine with theme-primary and the other theme classes. Icon-only is btn-icon. The old btn-primary class is gone.", v6 + "components/buttons/", "Open the Bootstrap 6 docs")
      ]
    },
    "tb-accordion": {
      title: "Accordion",
      tab: "toolbox",
      kind: "Discrepancy",
      summary: "Both open and close sections. Bootstrap 6 uses the native details element and does not need the collapse plugin.",
      panels: [
        panel("Toolbox", "Accordion component", null, "UiAccordionSection is an Angular accordion.", toolbox + "ui-accordion-section", "Open in the toolbox"),
        panel("Bootstrap 6", "Native details", null, "A details and summary pair. One-open groups use the name attribute. The accordion-button class is gone.", v6 + "components/accordion/", "Open the Bootstrap 6 docs")
      ]
    },
    "tb-messages": {
      title: "Global messages and toast",
      tab: "toolbox",
      kind: "Discrepancy",
      summary: "Both are transient messages. The toolbox names them Global Messages. Bootstrap 6 still calls them toasts, and the fade is CSS.",
      panels: [
        panel("Toolbox", "Four triggers", cur + "toolbox-messages.png", "Confirmation, info, warning, and error. Confirmation and info dismiss on a timer.", toolbox + "global-messages", "Open in the toolbox"),
        panel("Bootstrap 6", "Toast", null, "The toast fade uses a CSS starting style. There is no animation option. toast-instant skips the fade.", v6 + "components/toasts/", "Open the Bootstrap 6 docs")
      ]
    },
    "tb-paper": {
      title: "Paper",
      tab: "toolbox",
      kind: "Missing in Bootstrap 6",
      summary: "The toolbox has an elevated surface. Bootstrap 6 has cards and shadow utilities, and no Paper component.",
      panels: [panel("Toolbox", "Missing in Bootstrap 6", cur + "toolbox-paper.png", "Elevation 0–5, an outlined variant, and square corners.", toolbox + "ui-paper", "Open in the toolbox")]
    },
    "tb-picker": {
      title: "Picker dialog",
      tab: "toolbox",
      kind: "Missing in Bootstrap 6",
      summary: "The toolbox opens a dialog with a custom selection template. Bootstrap 6 has Dialog and Combobox, and no picker dialog.",
      panels: [panel("Toolbox", "Missing in Bootstrap 6", cur + "toolbox-picker.png", "Open Picker Dialog, with a custom template inside.", toolbox + "ui-picker-dialog", "Open in the toolbox")]
    },
    "tb-grid": {
      title: "Grid component",
      tab: "toolbox",
      kind: "Missing in Bootstrap 6",
      summary: "The toolbox ships a grid component with breakpoint maps. Bootstrap 6 has grid utilities, including grid-cols, and no matching component.",
      panels: [panel("Toolbox", "Missing in Bootstrap 6", cur + "toolbox-grid.png", "Responsive columns, span, and order.", toolbox + "ui-grid", "Open in the toolbox")]
    },
    "tb-upload": {
      title: "Upload",
      tab: "toolbox",
      kind: "Missing in Bootstrap 6",
      summary: "The toolbox has an upload directive. Bootstrap 6 has no upload component.",
      panels: [panel("Toolbox", "Missing in Bootstrap 6", cur + "toolbox-upload.png", "Upload File button with MIME and size checks.", toolbox + "ui-upload-action", "Open in the toolbox")]
    },
    "tb-download": {
      title: "Download",
      tab: "toolbox",
      kind: "Missing in Bootstrap 6",
      summary: "The toolbox has a download directive. Bootstrap 6 has no download component.",
      panels: [panel("Toolbox", "Missing in Bootstrap 6", cur + "toolbox-upload.png", "Download CSV, as a blob or a scheduled notice.", toolbox + "ui-download-action", "Open in the toolbox")]
    },
    "tb-carousel": {
      title: "Carousel",
      tab: "toolbox",
      kind: "Missing in the toolbox",
      summary: "Bootstrap 6 rebuilt the carousel. The toolbox has no carousel section.",
      panels: [panel("Bootstrap 6", "Missing in the toolbox", "images/v6-carousel.png", "Small previous and next buttons sit under the slide on the left. The dots sit on the right of that row. The active dot is a wider pill. Overlaying the controls on the slide is a separate option.", v6 + "components/carousel/#indicators", "Open the Bootstrap 6 docs")]
    },
    "tb-foundations": {
      title: "Foundations and overlays",
      tab: "toolbox",
      kind: "Missing in the toolbox",
      summary: "Bootstrap 6 still documents these. The toolbox has no section for them.",
      panels: [panel("Bootstrap 6", "Missing in the toolbox", null, "Colors and theme tokens, shadows, radius, tooltips, popovers, list group, progress, and the navbar. Progress, popovers, and list group are still in Bootstrap 6.", v6 + "components/progress/", "Open the Bootstrap 6 docs")]
    },
    "tb-new": {
      title: "New Bootstrap 6 components",
      tab: "toolbox",
      kind: "Missing in the toolbox",
      summary: "These are new in the Bootstrap 6 alpha. The toolbox does not document them.",
      panels: [panel("Bootstrap 6", "Missing in the toolbox", null, "Stepper, avatar, chip, OTP input, password strength, range, toggler, and prose. Combobox and Datepicker are the closest matches to UiSelect, UiMultiSelect, and UiDatePicker, so those are listed with what lines up.", v6 + "components/stepper/", "Open the Bootstrap 6 docs")]
    },
    "fg-menu": {
      title: "Menu selected state",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma documents the Bootstrap 5 dropdown. Bootstrap 6 renames it Menu and rounds the selected row.",
      panels: [
        panel("Figma", "Dropdown page", null, "The Dropdown page is the Bootstrap 5 menu. The active item is a full-width primary row.", figma + "7571-12926", "Open in Figma"),
        panel("Bootstrap 6", "Rounded primary row", "images/v6-menu-active.png", "The component is Menu. The active item is still primary, with rounded corners and space around the row. Classes change from dropdown-item to menu-item.", v6 + "components/menu/#active", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-carousel": {
      title: "Carousel arrows and dots",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma shows the Bootstrap 5 carousel. Bootstrap 6 moves the arrows and dots into a row under the slide.",
      panels: [
        panel("Figma", "Controls on the slide", cur + "figma-carousel.png", "Previous and next chevrons sit on the slide, and the indicators sit on the slide.", figma + "7571-12869", "Open in Figma"),
        panel("Bootstrap 6", "Controls under the slide", "images/v6-carousel.png", "Small arrow buttons on the left, pill dots on the right. The active dot is wider. Putting the controls back on the slide uses carousel-overlay.", v6 + "components/carousel/#indicators", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-dialog": {
      title: "Modal and dialog",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma has a Modal page. Bootstrap 6 replaces Modal with Dialog, built on the native dialog element.",
      panels: [
        panel("Figma", "Open modal", cur + "figma-modal-crop.png", "Modal Title, a field, Cancel, and Save Changes. The structure is modal, modal-dialog, and modal-content.", figma + "7577-5896", "Open in Figma"),
        panel("Bootstrap 6", "Native dialog", null, "One dialog element, with dialog-header, dialog-body, and dialog-footer. modal-dialog and modal-content are gone. data-bs-toggle is dialog.", v6 + "components/dialog/", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-drawer": {
      title: "Offcanvas and drawer",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma draws the offcanvas panel open and has marked the page to be removed. Bootstrap 6 ships that pattern as Drawer.",
      panels: [
        panel("Figma", "Open panel, marked to be removed", old + "figma-offcanvas.png", "The offcanvas panel is drawn open. The page sits under To be removed.", figma + "7571-12854", "Open in Figma"),
        panel("Bootstrap 6", "Drawer", null, "The component is Drawer, on a native dialog, with start, end, top, and bottom placement.", v6 + "components/drawer/", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-spacing": {
      title: "Spacing",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma’s spacing page stops at 32 and is marked to be removed. Bootstrap 6 remaps the spacer scale and extends it.",
      panels: [
        panel("Figma", "Stops at 32, marked to be removed", old + "figma-spacing.png", "The spacing page stops at 32 and sits under To be removed.", figma + "7571-12329", "Open in Figma"),
        panel("Bootstrap 6", "Remapped scale", null, "The spacer keys run 0 through 12. The old key 3 (1rem) is key 5. Key 5 (3rem) is key 12.", v6 + "utilities/spacing/", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-colors": {
      title: "Colors",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma documents the Bootstrap 5 color swatches. Bootstrap 6 builds the palette with oklch and applies it through theme classes.",
      panels: [
        panel("Figma", "Swatches", cur + "figma-colors.png", "Primary, secondary, tertiary, status, gray, text, icon, and background colors.", figma + "7571-11613", "Open in Figma"),
        panel("Bootstrap 6", "Theme tokens", null, "Colors are oklch values. Component colors such as btn-primary and alert-primary are replaced by theme-primary on the component.", v6 + "customize/color/", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-removed": {
      title: "Pages marked to be removed",
      tab: "figma",
      kind: "Discrepancy",
      summary: "Figma has marked progress, popovers, and list group to be removed. Bootstrap 6 still ships all three.",
      panels: [
        panel("Figma", "Marked to be removed", old + "figma-progress.png", "Progress sits under To be removed. Popovers and list group are on that list too.", figma + "7579-17891", "Open in Figma"),
        panel("Bootstrap 6", "Still shipped", null, "Progress, popover, and list group each have a v6 docs page.", v6 + "components/list-group/", "Open the Bootstrap 6 docs")
      ]
    },
    "fg-new": {
      title: "New Bootstrap 6 components",
      tab: "figma",
      kind: "Missing in Figma",
      summary: "The Figma file has no page for these Bootstrap 6 components.",
      panels: [panel("Bootstrap 6", "Missing in Figma", null, "Dialog and Drawer replace Modal and Offcanvas, which Figma still documents under the old names. Also new: Combobox, Datepicker, stepper, avatar, chip, OTP input, password strength, range, toggler, prose, and submenu.", v6 + "components/stepper/", "Open the Bootstrap 6 docs")]
    },
    garage: figmaOnly("Parts — My Garage", old + "figma-garage.png", "My Garage components.", "9180-15934"),
    listing: figmaOnly("Parts — listing page", old + "figma-listing.png", "Listing page components.", "9204-2604"),
    quotes: figmaOnly("Parts — quotes", old + "figma-quotes.png", "Quotes components.", "8460-123"),
    cart: figmaOnly("Services — cart", old + "figma-cart.png", "Cart page components.", "8295-1314"),
    hero: figmaOnly("Services — hero", old + "figma-hero.png", "Hero sections.", "8497-31"),
    tabs: figmaOnly("Services — section with tabs", old + "figma-tabs.png", "A tabbed page section. Bootstrap 6 has a Tabs component, which is a different thing.", "8498-636"),
    empty: figmaOnly("Services — empty state", old + "figma-empty.png", "Empty state.", "8165-516"),
    navbar: {
      title: "Sitewide — navbar and header",
      tab: "figma",
      kind: "Missing in Bootstrap 6",
      summary: "This is the Excelerator site header. Bootstrap 6 has a navbar component, and it does not include this header.",
      panels: [panel("Figma", "Excelerator header", old + "figma-navbar.png", "Sitewide navbar and header. Bootstrap 6 collapses its own navbar with a drawer.", figma + "7577-7517", "Open in Figma")]
    },
    user: figmaOnly("Sitewide — user dropdown", old + "figma-user.png", "User dropdown.", "8103-13564"),
    footer: figmaOnly("Sitewide — footer", old + "figma-footer.png", "Footer.", "8488-27920"),
    templates: figmaOnly("Sitewide — page templates", old + "figma-templates.png", "Page templates.", "8666-416"),
    designers: figmaOnly("Sitewide — for designers", cur + "figma-for-designers.png", "A placeholder frame. A note says Persistent questions, tbd.", "9585-7128"),
    filters: figmaOnly("Filters", old + "figma-filters.png", "Status filter and coverage filter.", "8498-12225"),
    scrollbar: figmaOnly("Scrollbar", old + "figma-scrollbar.png", "Scrollbar thumb.", "9689-13077"),
    media: figmaOnly("Media object", old + "figma-media.png", "Image-and-text rows.", "7577-5847"),
    swap: figmaOnly("Swap block", old + "figma-swap.png", "Swap block variants.", "8476-28473")
  };

  var root = document.getElementById("gap-detail");
  if (!root) return;
  var id = "";
  try { id = new URLSearchParams(window.location.search).get("id") || ""; } catch (e) {}
  var item = items[id];
  if (!item) {
    root.innerHTML = "<p>That comparison is not on this page. <a href=\"index.html\">Back to the gap list</a>.</p>";
    return;
  }
  document.title = item.title + " | Design system gap";
  var back = document.getElementById("gap-back");
  if (back) back.href = "index.html#" + (item.tab || "toolbox");
  var layout = item.panels.length > 1 ? " gap-compare--pair" : "";
  var html = "<p class=\"gap-lead\">" + item.kind + ". " + item.summary + "</p><div class=\"gap-compare" + layout + "\">";
  item.panels.forEach(function (p) {
    var img = p.src ? "<img src=\"" + p.src + "\" alt=\"" + p.label + " — " + item.title + "\">" : "";
    html += "<figure class=\"gap-panel is-diff\"><p class=\"gap-flag\">" + p.flag + "</p><h2>" + p.label + "</h2>" + img + "<figcaption>" + p.caption + " <a href=\"" + p.href + "\" target=\"_blank\" rel=\"noopener\">" + p.hrefLabel + "</a></figcaption></figure>";
  });
  html += "</div>";
  root.innerHTML = html;
  var heading = document.getElementById("gap-title");
  if (heading) heading.textContent = item.title;
})();

/**
 * BOM pages — design groups, module filter, profile switch, diagram accordions.
 * ADXCustomer6 and ADXCustomer Purchase open the coolant diagram.
 * A selected part uses the dark bar unless a highlight option is in the URL.
 * ADXCustomer Purchase shows price, quantity, and cart on purchasable parts.
 */
(function () {
  var PROFILE_KEY = "bom-profile";

  function readProfile() {
    try {
      return sessionStorage.getItem(PROFILE_KEY) || "ADXCustomer6";
    } catch (err) {
      return "ADXCustomer6";
    }
  }

  function storeProfile(name) {
    try {
      sessionStorage.setItem(PROFILE_KEY, name);
    } catch (err) {
      /* private mode */
    }
  }

  function applyProfileLinks(name) {
    document.querySelectorAll("[data-bom-profile-link]").forEach(function (link) {
      var allowed = (link.getAttribute("data-bom-profile-link") || "").split(",");
      var dest = link.getAttribute("data-bom-dest") || link.getAttribute("href");
      if (!link.getAttribute("data-bom-dest") && dest && dest !== "#") {
        link.setAttribute("data-bom-dest", dest);
      }
      var open = allowed.some(function (item) { return item.trim() === name; });
      link.setAttribute("href", open ? link.getAttribute("data-bom-dest") : "#");
    });
  }

  function setProfile(name) {
    var profileLabel = document.querySelector("[data-bom-profile-label]");
    if (profileLabel) profileLabel.textContent = name;
    document.querySelectorAll("[data-bom-profile]").forEach(function (item) {
      if (item.getAttribute("data-bom-profile") === name) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
    applyProfileLinks(name);
    storeProfile(name);
    document.body.classList.toggle("bom-can-purchase", name === "ADXCustomer Purchase");
  }

  function init() {
    var highlightStyles = {
      tint: "Color bar",
      navy: "Dark bar",
      dim: "Fade the others",
      walk: "Walk the numbers",
      near: "Parts drawn next to it"
    };
    var highlightParam = "";
    try {
      highlightParam = new URLSearchParams(window.location.search).get("highlight") || "";
    } catch (e) {}
    var highlightPreview = !!highlightStyles[highlightParam];
    var highlightStyle = highlightPreview ? highlightParam : "navy";
    document.body.classList.add("bom-select-" + highlightStyle);

    var collapse = document.querySelector("[data-bom-collapse]");
    var groups = document.querySelector("[data-bom-groups]");
    if (collapse && groups) {
      collapse.addEventListener("click", function () {
        var willOpen = groups.hidden;
        groups.hidden = !willOpen;
        collapse.textContent = willOpen ? "Collapse" : "Expand";
        collapse.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    }

    var filter = document.querySelector("[data-bom-filter]");
    if (filter) {
      filter.addEventListener("change", function () {
        var value = filter.value;
        document.querySelectorAll("[data-bom-module]").forEach(function (row) {
          row.hidden = value !== "all" && row.getAttribute("data-bom-module") !== value;
        });
      });
    }

    setProfile(readProfile());
    document.querySelectorAll("[data-bom-profile]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setProfile(btn.getAttribute("data-bom-profile"));
      });
    });

    var partsPanel = document.getElementById("bom-parts");
    if (partsPanel && !partsPanel.querySelector("[data-bom-generated]")) {
      var callouts = [
        ["12", "A23-11840-012", "WASHER", "1"],
        ["15", "A23-20415-015", "SPACER", "1"],
        ["20", "A23-33020-020", "O-RING", "1"],
        ["25", "A23-44125-025", "PULLEY", "1"],
        ["30", "A23-55030-030", "SCREW", "2"],
        ["40", "A23-66040-040", "COVER", "1"],
        ["45", "A23-77045-045", "HUB", "1"],
        ["50", "A23-88050-050", "BRACKET", "1"],
        ["55", "A23-99055-055", "CLAMP", "1"],
        ["60", "A23-10160-060", "GEAR", "1"],
        ["65", "A23-11165-065", "IDLER", "1"],
        ["70", "A23-12170-070", "NUT", "1"],
        ["80", "A23-13180-080", "BEARING", "1"],
        ["85", "A23-14185-085", "PULLEY, IDLER", "1"],
        ["90", "A23-15190-090", "BOLT", "2"],
        ["100", "A23-16100-100", "DAMPER", "1"],
        ["112", "A23-17112-112", "PULLEY, CRANK", "1"],
        ["113", "A23-18113-113", "SCREW", "3"],
        ["115", "A23-19115-115", "RETAINER", "1"],
        ["117", "A23-20117-117", "KEY", "1"]
      ];
      var purchaseCatalog = {
        "12": { price: "4.18", stock: 24, bulk: false },
        "15": { price: "6.66", stock: 69, bulk: true },
        "20": { price: "1.42", stock: 120, bulk: false },
        "25": { price: "0.90", stock: 272, bulk: true },
        "30": { price: "6.51", stock: 0, bulk: false },
        "45": { price: "12.40", stock: 8, bulk: false },
        "50": { price: "3.15", stock: 41, bulk: true },
        "55": { price: "8.75", stock: 16, bulk: false },
        "60": { price: "2.20", stock: 54, bulk: false },
        "65": { price: "15.00", stock: 3, bulk: true },
        "70": { price: "0.48", stock: 200, bulk: false },
        "80": { price: "9.10", stock: 11, bulk: false },
        "85": { price: "22.35", stock: 6, bulk: true },
        "90": { price: "1.05", stock: 88, bulk: false },
        "113": { price: "4.60", stock: 33, bulk: false },
        "115": { price: "7.25", stock: 14, bulk: true },
        "117": { price: "0.75", stock: 150, bulk: false }
      };
      var dealerPlace = "HOUSTON FREIGHTLINER & WESTERN STAR, HOUSTON";
      function purchaseBlock(offer, qty) {
        var out = offer.stock === 0;
        return (
          '<div class="bom-buy">' +
            '<div class="bom-buy__details">' +
              '<p class="bom-buy__price">$' + offer.price + " (each)</p>" +
              '<p class="bom-buy__stock' + (out ? " is-out" : "") + '">' +
                offer.stock + " Qty available at " + dealerPlace +
                (out ? ' <i class="fas fa-info-circle" aria-hidden="true"></i>' : "") +
              "</p>" +
              '<a class="bom-buy__more" href="#">View More Availability</a>' +
            "</div>" +
            '<div class="bom-buy__actions">' +
              '<div class="bom-buy__row">' +
                '<input class="bom-buy__qty" type="number" min="1" value="' + qty + '" aria-label="Quantity" />' +
                '<button type="button" class="bom-buy__cart"><i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart</button>' +
              "</div>" +
              (offer.bulk
                ? '<button type="button" class="bom-buy__bulk"><i class="fas fa-tag" aria-hidden="true"></i> Bulk Pricing</button>'
                : "") +
            "</div>" +
          "</div>"
        );
      }
      var partPhotos = {
        "12": "../../assets/images/bom-part-12.png",
        "15": "../../assets/images/bom-part-15.png"
      };
      callouts.forEach(function (item, index) {
        var callout = item[0];
        var part = item[1];
        var name = item[2];
        var qty = item[3];
        var photo = partPhotos[callout] || "../../assets/images/bom-part-missing.png";
        var photoClass = partPhotos[callout] ? "bom-part__photo bom-part__photo--fill" : "bom-part__photo";
        var replaced = part.replace(/-\d{3}$/, "-9" + callout.slice(-2).padStart(2, "0"));
        var showReplaced = callout === "30" || callout === "70" || callout === "112";
        var offer = purchaseCatalog[callout];
        var article = document.createElement("article");
        article.className = "bom-part";
        article.setAttribute("data-bom-generated", "true");
        if (offer) {
          article.setAttribute("data-purchasable", "true");
          article.setAttribute("data-price", offer.price);
          article.setAttribute("data-stock", String(offer.stock));
        }
        article.innerHTML =
          '<div class="bom-part__media">' +
            '<div class="' + photoClass + '">' +
              '<img src="' + photo + '" alt="" />' +
            "</div>" +
            '<div class="bom-compare-row">' +
              '<input type="checkbox" aria-label="Compare" />' +
              '<button type="button" class="bom-compare" disabled>Compare</button>' +
            "</div>" +
          "</div>" +
          '<span class="bom-callout">' + callout + "</span>" +
          '<div class="bom-part__body">' +
            '<div class="bom-part__id">' +
              '<a href="#">' + part + "</a>" +
              '<button type="button" class="bom-icon-btn" aria-label="Save part"><i class="far fa-star" aria-hidden="true"></i></button>' +
              '<button type="button" class="bom-icon-btn" aria-label="Part information"><i class="fas fa-info-circle" aria-hidden="true"></i></button>' +
            "</div>" +
            (showReplaced
              ? '<p class="bom-replaced">' +
                  '<span class="bom-replaced__badge"><i class="fas fa-arrow-right" aria-hidden="true"></i> Replaced by</span>' +
                  '<a class="bom-replaced__num" href="#">' + replaced + "</a>" +
                "</p>"
              : "") +
            '<p class="bom-part__name">' + name + "</p>" +
            (offer ? purchaseBlock(offer, qty) : "") +
            '<p class="bom-part__vmrs">VMRS:013-007-' + callout + "</p>" +
            '<p class="bom-part__qty">Quantity: ' + qty + "</p>" +
            '<button type="button" class="bom-fbt">Check Frequently Bought With</button>' +
            (index % 2 === 1
              ? '<button type="button" class="bom-fbt bom-alt">Alternative Products</button>'
              : "") +
            '<div class="bom-part__dealer">' +
              '<button type="button" class="bom-dealer-note">Please contact your dealer</button>' +
            "</div>" +
          "</div>" +
          '<div class="bom-part__subs">' +
            subSection("see-more-" + callout, "See More", false, seeMoreHtml()) +
            subSection("annotations-" + callout, "Annotations", false, "") +
            (index === 0
              ? subSection(
                  "footnotes-" + callout,
                  "Footnotes",
                  true,
                  "<p>ITEM " + part + " CONTAINS INTERNAL TOOTH WASHER AND JAM NUT.</p>"
                )
              : "") +
          "</div>";
        partsPanel.appendChild(article);
      });
    }

    function seeMoreHtml() {
      var hose =
        '<svg viewBox="0 0 80 48" aria-hidden="true"><path d="M6 34c14 0 16-22 34-22s18 16 34 6" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/></svg>';
      var tube =
        '<svg viewBox="0 0 80 48" aria-hidden="true"><path d="M12 38 L68 10" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/></svg>';
      var rows = [
        {
          photo: '<img src="../../assets/images/bom-part-missing.png" alt="" />',
          avail: true,
          part: "01-33978-000",
          name: "HOSE-DEF FILL.REMOTE.15G.MTNA",
          vmrs: "VMRS:044-001-007-PIPE - FUEL TANK FILLER"
        },
        {
          photo: hose,
          avail: false,
          part: "01-33996-000",
          name: "HOSE - DIESEL EXHAUST FLUID FILL. REMOTE, DS, 15 GALLON",
          vmrs: "VMRS:044-001-007-PIPE - FUEL TANK FILLER"
        },
        {
          photo: tube,
          avail: false,
          part: "12-26789-000",
          name: "TUBE - BRAKE. DEL. LEFT HAND. FRONT. LOW. POS1",
          vmrs: "VMRS:013-007-053-PIPING ASSEMBLY - HYDRAULIC ABS, CHASSIS"
        }
      ];
      var list = rows.map(function (row) {
        return (
          '<article class="bom-more__row">' +
            '<div class="bom-more__media">' +
              '<div class="bom-more__photo">' + row.photo + "</div>" +
              '<div class="bom-compare-row">' +
                '<input type="checkbox" aria-label="Compare" />' +
                '<button type="button" class="bom-compare" disabled>Compare</button>' +
              "</div>" +
            "</div>" +
            '<div class="bom-more__body">' +
              '<div class="bom-more__id">' +
                (row.avail ? '<span class="bom-more__avail">[CHECK AVAILABILITY]</span> ' : "") +
                '<a href="#">' + row.part + "</a>" +
                '<button type="button" class="bom-icon-btn" aria-label="Copy part number"><i class="far fa-copy" aria-hidden="true"></i></button>' +
                '<button type="button" class="bom-icon-btn" aria-label="Save part"><i class="far fa-star" aria-hidden="true"></i></button>' +
              "</div>" +
              '<p class="bom-more__name">' + row.name + "</p>" +
              "<p>" + row.vmrs + "</p>" +
              "<p><strong>Quantity:</strong> 1</p>" +
            "</div>" +
            '<div class="bom-more__dealer">' +
              '<button type="button" class="bom-dealer-note">Please contact your dealer</button>' +
            "</div>" +
          "</article>"
        );
      }).join("");
      return (
        '<div class="bom-more">' +
          '<div class="bom-more__tabs" role="tablist">' +
            '<button type="button" class="bom-more__tab" role="tab" data-bom-tab="replacement" aria-selected="false">Replacement</button>' +
            '<button type="button" class="bom-more__tab" role="tab" data-bom-tab="features" aria-selected="false">Features</button>' +
            '<button type="button" class="bom-more__tab" role="tab" data-bom-tab="alternatives" aria-selected="false">Alternatives</button>' +
            '<button type="button" class="bom-more__tab is-active" role="tab" data-bom-tab="fbt" aria-selected="true">Frequently Bought With</button>' +
          "</div>" +
          '<div class="bom-more__panel" data-bom-tab-panel="replacement" hidden></div>' +
          '<div class="bom-more__panel" data-bom-tab-panel="features" hidden></div>' +
          '<div class="bom-more__panel" data-bom-tab-panel="alternatives" hidden></div>' +
          '<div class="bom-more__panel" data-bom-tab-panel="fbt">' + list + "</div>" +
        "</div>"
      );
    }

    function subSection(id, label, open, body) {
      var more = label === "See More" ? " bom-sub__panel--more" : "";
      var labelHtml = label === "See More"
        ? "<span class=\"bom-sub__label\">" + label + "</span>"
        : " " + label;
      return (
        "<section data-bom-acc>" +
          "<h4><button type=\"button\" class=\"bom-sub__toggle\" data-bom-acc-toggle aria-expanded=\"" +
          (open ? "true" : "false") +
          "\" aria-controls=\"" + id + "\" aria-label=\"" + label + "\">" +
          "<span class=\"bom-acc__mark\" data-bom-acc-mark>" + (open ? "−" : "+") + "</span>" +
          labelHtml +
          "</button></h4>" +
          "<div id=\"" + id + "\" class=\"bom-sub__panel" + more + "\" data-bom-acc-panel" +
          (open ? "" : " hidden") + ">" + body + "</div>" +
        "</section>"
      );
    }

    function subAssemblyHtml(prefix) {
      var children = [
        ["21", "SCREW"],
        ["22", "WASHER"],
        ["23", "O-RING"],
        ["24", "NUT"],
        ["26", "SLEEVE"],
        ["27", "INSERT"],
        ["28", "FERRULE"],
        ["29", "BAND"],
        ["31", "GASKET"],
        ["32", "CLIP"]
      ].map(function (row) {
        return {
          num: row[0],
          part: "A23-210" + row[0] + "-0" + row[0],
          name: row[1],
          vmrs: "VMRS:013-007-" + row[0] + "-" + row[1]
        };
      });
      return subAssemblyList([
        {
          num: "11",
          part: "A23-21011-011",
          name: "CLAMP",
          vmrs: "VMRS:013-007-011-CLAMP - HOSE",
          dark: true,
          children: children
        }
      ], prefix);
    }

    function partAccordions(item, prefix, extra) {
      return (
        '<div class="bom-subasm__accs">' +
          subSection(prefix + "-see-" + item.num, "See More", false, seeMoreHtml()) +
          subSection(prefix + "-ann-" + item.num, "Annotations", false, "") +
          subSection(
            prefix + "-note-" + item.num,
            "Footnotes",
            true,
            "<p>ITEM " + item.part + " CONTAINS INTERNAL TOOTH WASHER AND JAM NUT.</p>"
          ) +
          (extra || "") +
        "</div>"
      );
    }

    function subAssemblyList(items, prefix) {
      return items.map(function (item) {
        var nest = "";
        if (item.children && item.children.length) {
          nest =
            '<div class="bom-subasm__nest">' +
              subSection(
                prefix + "-subasm-" + item.num,
                "Sub Assembly Parts",
                true,
                subAssemblyList(item.children, prefix)
              ) +
            "</div>";
        }
        var accordions = partAccordions(item, prefix, nest);
        return (
          '<article class="bom-more__row bom-subasm__row' + (item.dark ? " is-dark" : "") + '" data-bom-level="' + (item.children && item.children.length ? "1" : "2") + '">' +
            '<div class="bom-more__media">' +
              '<div class="bom-more__photo">' +
                '<img src="../../assets/images/bom-part-missing.png" alt="" />' +
              "</div>" +
              '<div class="bom-compare-row">' +
                '<input type="checkbox" aria-label="Compare" />' +
                '<button type="button" class="bom-compare" disabled>Compare</button>' +
              "</div>" +
            "</div>" +
            '<span class="bom-callout">' + item.num + "</span>" +
            '<div class="bom-more__body">' +
              '<div class="bom-more__id">' +
                '<a href="#">' + item.part + "</a>" +
                '<button type="button" class="bom-icon-btn" aria-label="Copy part number"><i class="far fa-copy" aria-hidden="true"></i></button>' +
                '<button type="button" class="bom-icon-btn" aria-label="Save part"><i class="far fa-star" aria-hidden="true"></i></button>' +
              "</div>" +
              '<p class="bom-more__name">' + item.name + "</p>" +
              "<p>" + item.vmrs + "</p>" +
              "<p><strong>Quantity:</strong> 1</p>" +
            "</div>" +
            '<div class="bom-more__dealer">' +
              '<button type="button" class="bom-dealer-note">Please contact your dealer</button>' +
            "</div>" +
            accordions +
          "</article>"
        );
      }).join("");
    }

    var seeMorePanel = document.getElementById("bom-see-more");
    if (seeMorePanel && !seeMorePanel.innerHTML.trim()) {
      seeMorePanel.innerHTML = seeMoreHtml();
    }

    var subAssemblyPanel = document.getElementById("bom-sub-assembly");
    if (subAssemblyPanel && !subAssemblyPanel.innerHTML.trim()) {
      subAssemblyPanel.innerHTML = subAssemblyHtml("part10");
    }

    buildGrid();
    var cardOrder = Array.from(document.querySelectorAll("#bom-parts > .bom-part"));
    var groupOrder = Array.from(document.querySelectorAll(".bom-grid__group"));

    function buildGrid() {
      var panel = document.getElementById("bom-parts");
      if (!panel || panel.querySelector(".bom-grid")) return;
      var headers = ["Ref", "Part ID", "VMRS", "Alternatives", "Qty", "UOM", "Price and Availability", "Cart"];
      var table = document.createElement("table");
      table.className = "bom-grid";
      table.hidden = true;
      table.innerHTML =
        "<thead><tr>" +
        headers.map(function (label) {
          return "<th scope=\"col\">" + label + "</th>";
        }).join("") +
        "</tr></thead>";
      panel.querySelectorAll(":scope > .bom-part").forEach(function (card) {
        var callout = text(card, ".bom-callout");
        var part = text(card, ".bom-part__id a");
        var name = text(card, ".bom-part__name");
        var vmrs = text(card, ".bom-part__vmrs").replace(/^VMRS:/, "");
        var qty = text(card, ".bom-part__qty").replace(/^Quantity:\s*/, "");
        var replaced = text(card, ".bom-replaced__num");
        var note = footnoteText(card);
        var hasSubAssembly = !!card.querySelector("[data-bom-subassembly]");
        var alt = card.querySelector(".bom-alt");
        var purchasable = card.hasAttribute("data-purchasable");
        var price = card.getAttribute("data-price") || "";
        var stock = card.getAttribute("data-stock") || "";
        var out = stock === "0";
        var group = document.createElement("tbody");
        group.className = "bom-grid__group" + (purchasable ? " is-purchasable" : "");
        group.innerHTML =
          "<tr>" +
            "<td class=\"bom-grid__ref\">" + callout + "</td>" +
            "<td class=\"bom-grid__id\">" +
              "<div class=\"bom-grid__partline\">" +
                "<a href=\"#\">" + part + "</a>" +
                "<button type=\"button\" class=\"bom-icon-btn\" aria-label=\"Save part\"><i class=\"far fa-star\" aria-hidden=\"true\"></i></button>" +
                "<button type=\"button\" class=\"bom-icon-btn\" aria-label=\"Part information\"><i class=\"fas fa-info-circle\" aria-hidden=\"true\"></i></button>" +
              "</div>" +
              "<p class=\"bom-grid__name\">" + name + "</p>" +
              (replaced
                ? "<p class=\"bom-replaced\">" +
                    "<span class=\"bom-replaced__badge\"><i class=\"fas fa-arrow-right\" aria-hidden=\"true\"></i> Replaced by</span>" +
                    "<a class=\"bom-replaced__num\" href=\"#\">" + replaced + "</a>" +
                  "</p>"
                : "") +
            "</td>" +
            "<td class=\"bom-grid__vmrs\">" + vmrs + "</td>" +
            "<td class=\"bom-grid__alt\">" + (alt ? "<a class=\"bom-grid__view\" href=\"#\">View</a>" : "") + "</td>" +
            "<td class=\"bom-grid__qty\">" +
              "<span class=\"bom-grid__qtytext\">" + qty + "</span>" +
              (purchasable
                ? "<input class=\"bom-grid__qtybox\" type=\"number\" min=\"1\" value=\"" + qty + "\" aria-label=\"Quantity\" />"
                : "") +
            "</td>" +
            "<td class=\"bom-grid__uom\">EA</td>" +
            "<td class=\"bom-grid__price\">" +
              (purchasable
                ? "<div class=\"bom-grid__buy\">" +
                    "<p class=\"bom-grid__price-line\">Price: $" + price + "</p>" +
                    "<p class=\"bom-grid__stock" + (out ? " is-out" : "") + "\">" + stock + " Qty Available" +
                      (out ? " <i class=\"fas fa-info-circle\" aria-hidden=\"true\"></i>" : "") +
                    "</p>" +
                    "<a class=\"bom-grid__more\" href=\"#\">View More Availability</a>" +
                  "</div>"
                : "") +
              "<button type=\"button\" class=\"bom-grid__contact\">Contact Dealer</button>" +
            "</td>" +
            "<td class=\"bom-grid__cart\">" +
              (purchasable
                ? "<button type=\"button\" class=\"bom-grid__cartbtn\"><i class=\"fas fa-shopping-cart\" aria-hidden=\"true\"></i> Add to Cart</button>"
                : "") +
              "<button type=\"button\" class=\"bom-grid__add\">Add Note</button>" +
            "</td>" +
          "</tr>" +
          (note || hasSubAssembly
            ? "<tr class=\"bom-grid__foot\">" +
                "<td colspan=\"8\">" +
                  "<div class=\"bom-grid__foot-shift\">" +
                    (note
                      ? "<section data-bom-acc>" +
                          "<h4><button type=\"button\" class=\"bom-sub__toggle\" data-bom-acc-toggle aria-expanded=\"true\" aria-controls=\"grid-note-" + callout + "\">" +
                            "<span class=\"bom-acc__mark\" data-bom-acc-mark>−</span> Footnotes" +
                          "</button></h4>" +
                          "<div id=\"grid-note-" + callout + "\" class=\"bom-sub__panel\" data-bom-acc-panel><p>" + note + "</p></div>" +
                        "</section>"
                      : "") +
                  "</div>" +
                "</td>" +
              "</tr>" +
              (hasSubAssembly ? gridSubAssembly(callout) : "")
            : "") ;
        table.appendChild(group);
      });
      panel.appendChild(table);
    }

    function text(root, selector) {
      var node = root.querySelector(selector);
      return node ? node.textContent.trim() : "";
    }

    function subAssemblyItems() {
      var children = [
        ["21", "SCREW"],
        ["22", "WASHER"],
        ["23", "O-RING"],
        ["24", "NUT"],
        ["26", "SLEEVE"],
        ["27", "INSERT"],
        ["28", "FERRULE"],
        ["29", "BAND"],
        ["31", "GASKET"],
        ["32", "CLIP"]
      ].map(function (row) {
        return {
          num: row[0],
          part: "A23-210" + row[0] + "-0" + row[0],
          name: row[1],
          vmrs: "013-007-" + row[0] + " " + row[1]
        };
      });
      return [
        {
          num: "11",
          part: "A23-21011-011",
          name: "CLAMP",
          vmrs: "013-007-011 CLAMP - HOSE",
          children: children
        }
      ];
    }

    function gridSubAssembly(callout) {
      var rootId = "grid-subasm-" + callout;
      return (
        gridAccRow(rootId, [], false) +
        gridSubRows(subAssemblyItems(), callout, [rootId])
      );
    }

    function gridAccRow(id, ancestors, open) {
      return (
        '<tr class="bom-grid__foot bom-grid__accrow"' + gridAncestorAttrs(ancestors) + ">" +
          '<td colspan="8">' +
            "<section data-bom-acc>" +
              "<h4><button type=\"button\" class=\"bom-sub__toggle\" data-bom-acc-toggle aria-expanded=\"" +
              (open ? "true" : "false") +
              "\" aria-controls=\"" + id + "\">" +
                "<span class=\"bom-acc__mark\" data-bom-acc-mark>" + (open ? "−" : "+") + "</span> Sub Assembly Parts" +
              "</button></h4>" +
              "<div id=\"" + id + "\" data-bom-acc-panel hidden></div>" +
            "</section>" +
          "</td>" +
        "</tr>"
      );
    }

    function gridSubRows(items, callout, ancestors) {
      return items.map(function (item) {
        var level = item.children && item.children.length ? "1" : "2";
        var ownId = "grid-" + callout + "-subasm-" + item.num;
        var noteId = "grid-" + callout + "-note-" + item.num;
        var rows =
          '<tr class="bom-grid__sub" data-bom-level="' + level + '" data-bom-subnum="' + item.num + '"' + gridAncestorAttrs(ancestors) + ">" +
            '<td class="bom-grid__ref bom-grid__ref--sub">' +
              '<i class="fas fa-grip-vertical bom-grid__grip" aria-hidden="true"></i>' +
              '<span class="bom-grid__num">' + item.num + "</span>" +
            "</td>" +
            '<td class="bom-grid__id">' +
              '<div class="bom-grid__partline">' +
                '<a href="#">' + item.part + "</a>" +
                '<button type="button" class="bom-icon-btn" aria-label="Copy part number"><i class="far fa-copy" aria-hidden="true"></i></button>' +
                '<button type="button" class="bom-icon-btn" aria-label="Save part"><i class="far fa-star" aria-hidden="true"></i></button>' +
              "</div>" +
              '<p class="bom-grid__name">' + item.name + "</p>" +
            "</td>" +
            '<td class="bom-grid__vmrs">' + item.vmrs + "</td>" +
            '<td class="bom-grid__alt"></td>' +
            '<td class="bom-grid__qty"><span class="bom-grid__qtytext">1</span></td>' +
            '<td class="bom-grid__uom">EA</td>' +
            '<td class="bom-grid__price">' +
              (level === "2" ? '<a class="bom-grid__more" href="#">View More Availability</a>' : "") +
            "</td>" +
            '<td class="bom-grid__cart"><button type="button" class="bom-grid__add">Add Note</button></td>' +
          "</tr>" +
          '<tr class="bom-grid__foot"' + gridAncestorAttrs(ancestors) + ">" +
            '<td colspan="8">' +
              '<div class="bom-grid__foot-shift">' +
                "<section data-bom-acc>" +
                  "<h4><button type=\"button\" class=\"bom-sub__toggle\" data-bom-acc-toggle aria-expanded=\"true\" aria-controls=\"" + noteId + "\">" +
                    "<span class=\"bom-acc__mark\" data-bom-acc-mark>−</span> Footnotes" +
                  "</button></h4>" +
                  "<div id=\"" + noteId + "\" class=\"bom-sub__panel\" data-bom-acc-panel><p>ITEM " + item.part + " CONTAINS INTERNAL TOOTH WASHER AND JAM NUT.</p></div>" +
                "</section>" +
              "</div>" +
            "</td>" +
          "</tr>";
        if (item.children && item.children.length) {
          rows += gridAccRow(ownId, ancestors, true);
          rows += gridSubRows(item.children, callout, ancestors.concat(ownId));
        }
        return rows;
      }).join("");
    }

    function gridAncestorAttrs(ancestors) {
      if (!ancestors.length) return "";
      var closed = ancestors.some(function (id) {
        return id.indexOf("-subasm-") !== -1 && id.indexOf("grid-subasm-") === 0;
      });
      return ' data-bom-ancestors="' + ancestors.join(" ") + '"' + (closed ? " hidden" : "");
    }

    function syncGridSubs() {
      document.querySelectorAll("tr[data-bom-ancestors]").forEach(function (row) {
        var ids = row.getAttribute("data-bom-ancestors").split(/\s+/);
        row.hidden = ids.some(function (id) {
          var trigger = document.querySelector('[aria-controls="' + id + '"]');
          return !trigger || trigger.getAttribute("aria-expanded") !== "true";
        });
      });
    }

    function footnoteText(card) {
      var note = "";
      card.querySelectorAll(".bom-part__subs > section > h4 .bom-sub__toggle").forEach(function (btn) {
        if (btn.textContent.indexOf("Footnotes") === -1) return;
        var panel = card.querySelector("#" + btn.getAttribute("aria-controls"));
        var copy = panel && panel.querySelector("p");
        if (copy) note = copy.textContent.trim();
      });
      return note;
    }

    var currentView = "detail";
    var selectedCallout = null;
    var hotspots = [
      ["113", 14.4, 59.6],
      ["112", 29.4, 38.3],
      ["10", 37.8, 79.8],
      ["100", 41.5, 61.4],
      ["115", 47.6, 36.8],
      ["117", 40.6, 42.5],
      ["50", 39.9, 29.5],
      ["25", 62.3, 77.7],
      ["85", 64.8, 22.3],
      ["65", 61.6, 33.9],
      ["45", 67.1, 56],
      ["12", 75.5, 74.6],
      ["80", 72.5, 25.4],
      ["60", 70.1, 39.1],
      ["40", 60.6, 57.5],
      ["15", 88.1, 69.7],
      ["90", 74.4, 25.4],
      ["70", 75.7, 47.9],
      ["55", 81.3, 59.3],
      ["20", 84.5, 63],
      ["30", 91.1, 72]
    ];

    var stage = document.querySelector(".bom-stage");
    if (stage) {
      hotspots.forEach(function (spot) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "bom-hotspot";
        button.setAttribute("data-callout", spot[0]);
        button.setAttribute("aria-label", "Part " + spot[0]);
        button.style.left = spot[1] + "%";
        button.style.top = spot[2] + "%";
        button.addEventListener("click", function () {
          selectCallout(spot[0]);
        });
        stage.appendChild(button);
      });
    }

    function matchingCards(callout) {
      var matches = [];
      document.querySelectorAll("#bom-parts > .bom-part").forEach(function (card) {
        var mark = card.querySelector(".bom-callout");
        if (mark && mark.textContent.trim() === callout) matches.push(card);
      });
      return matches;
    }

    function matchingGroups(callout) {
      var matches = [];
      document.querySelectorAll(".bom-grid__group").forEach(function (group) {
        var ref = group.querySelector(".bom-grid__ref");
        if (ref && ref.textContent.trim() === callout) matches.push(group);
      });
      return matches;
    }

    function openParts() {
      var toggle = document.querySelector('[aria-controls="bom-parts"]');
      if (toggle && toggle.getAttribute("aria-expanded") !== "true") toggle.click();
    }

    function openAccordion(id) {
      var trigger = document.querySelector('[aria-controls="' + id + '"]');
      if (!trigger) return;
      var panel = document.getElementById(id);
      trigger.setAttribute("aria-expanded", "true");
      if (panel) panel.hidden = false;
      var mark = trigger.querySelector("[data-bom-acc-mark]");
      if (mark) mark.textContent = "−";
      syncGridSubs();
    }

    function selectCallout(callout) {
      selectedCallout = callout;
      document.querySelectorAll(".bom-hotspot").forEach(function (button) {
        button.classList.toggle("is-selected", button.getAttribute("data-callout") === callout);
      });
      document.querySelectorAll("#bom-parts > .bom-part, .bom-grid__group").forEach(function (node) {
        node.classList.remove("is-hit");
      });
      var cards = matchingCards(callout);
      var groups = matchingGroups(callout);
      cards.forEach(function (card) {
        card.classList.add("is-hit");
      });
      var bringGroupsForward = !highlightStyle;
      if (bringGroupsForward && groups.length) {
        var table = groups[0].parentNode;
        var anchor = table.querySelector("tbody");
        for (var i = groups.length - 1; i >= 0; i--) {
          groups[i].classList.add("is-hit");
          table.insertBefore(groups[i], anchor);
          anchor = groups[i];
        }
      } else {
        groups.forEach(function (group) {
          group.classList.add("is-hit");
        });
      }
      if (highlightStyle) document.body.classList.add("bom-has-selection");
      if (highlightStyle === "near" && selectedCallout) layoutNear(nearCallouts(selectedCallout));
      placeBackLink(cards, groups);
      updateWalkBar(cards);
      applyPartsVisibility();
      openParts();
      if (callout === "10") {
        ["bom-sub-assembly", "part10-subasm-11", "grid-subasm-10", "grid-10-subasm-11"].forEach(openAccordion);
        document.querySelectorAll('.bom-subasm__row[data-bom-level="2"], tr.bom-grid__sub.is-dark').forEach(function (row) {
          row.classList.remove("is-dark");
        });
        document.querySelectorAll('.bom-subasm__row[data-bom-level="1"]').forEach(function (row) {
          row.classList.add("is-dark");
        });
        return;
      }
      if (highlightStyle === "near") {
        var nearLabel = currentView === "grid"
          ? document.querySelector(".bom-near-grid")
          : document.querySelector(".bom-near-label");
        if (nearLabel) scrollInParts(nearLabel, "center");
        else if (cards[0]) scrollInParts(cards[0], "start");
      } else if (currentView === "detail" && cards[0]) scrollInParts(cards[0], "center");
      else if (currentView === "grid" && groups[0]) scrollInParts(groups[0].querySelector("tr") || groups[0], "start");
      else if (currentView === "image" && cards[0]) scrollInParts(cards[0], "start");
    }

    function calloutIds() {
      return cardOrder.map(function (card) {
        return card.querySelector(".bom-callout").textContent.trim();
      });
    }

    function nearCallouts(callout) {
      var origin = document.querySelector('.bom-hotspot[data-callout="' + callout + '"]');
      if (!origin) return [callout];
      var ox = parseFloat(origin.style.left);
      var oy = parseFloat(origin.style.top);
      var others = [];
      document.querySelectorAll(".bom-hotspot").forEach(function (button) {
        var id = button.getAttribute("data-callout");
        if (id === callout) return;
        var dx = parseFloat(button.style.left) - ox;
        var dy = parseFloat(button.style.top) - oy;
        others.push({ id: id, d: dx * dx + dy * dy });
      });
      others.sort(function (a, b) { return a.d - b.d; });
      return [callout].concat(others.slice(0, 3).map(function (item) { return item.id; }));
    }

    function layoutNear(ids) {
      document.querySelectorAll(".bom-near-label, .bom-near-grid").forEach(function (node) {
        node.remove();
      });
      var panel = document.getElementById("bom-parts");
      var table = panel.querySelector(".bom-grid");
      if (!panel || !table) return;
      var set = {};
      ids.forEach(function (id) { set[id] = true; });
      var near = [];
      var rest = [];
      cardOrder.forEach(function (card) {
        var id = card.querySelector(".bom-callout").textContent.trim();
        (set[id] ? near : rest).push(card);
      });
      near.sort(function (a, b) {
        return ids.indexOf(a.querySelector(".bom-callout").textContent.trim()) -
          ids.indexOf(b.querySelector(".bom-callout").textContent.trim());
      });
      function heading(text, restful) {
        var head = document.createElement("h3");
        head.className = "bom-near-label" + (restful ? " bom-near-label--rest" : "");
        head.textContent = text;
        panel.insertBefore(head, table);
      }
      heading("Next to " + selectedCallout + " on the diagram", false);
      near.forEach(function (card) { panel.insertBefore(card, table); });
      heading("Rest of the system", true);
      rest.forEach(function (card) { panel.insertBefore(card, table); });

      var nearGroups = [];
      var restGroups = [];
      groupOrder.forEach(function (group) {
        var ref = group.querySelector(".bom-grid__ref").textContent.trim();
        (set[ref] ? nearGroups : restGroups).push(group);
      });
      nearGroups.sort(function (a, b) {
        return ids.indexOf(a.querySelector(".bom-grid__ref").textContent.trim()) -
          ids.indexOf(b.querySelector(".bom-grid__ref").textContent.trim());
      });
      function gridHeading(text) {
        var body = document.createElement("tbody");
        body.className = "bom-near-grid";
        body.innerHTML = '<tr><td colspan="8">' + text + "</td></tr>";
        return body;
      }
      table.appendChild(gridHeading("Next to " + selectedCallout + " on the diagram"));
      nearGroups.forEach(function (group) { table.appendChild(group); });
      table.appendChild(gridHeading("Rest of the system"));
      restGroups.forEach(function (group) { table.appendChild(group); });
    }

    function applyPartsVisibility() {
      var grid = currentView === "grid";
      var image = currentView === "image";
      var nearIds = highlightStyle === "near" && selectedCallout ? nearCallouts(selectedCallout) : [];
      document.querySelectorAll("#bom-parts > .bom-part").forEach(function (card) {
        var mark = card.querySelector(".bom-callout");
        var id = mark ? mark.textContent.trim() : "";
        var same = selectedCallout && id === selectedCallout;
        if (grid) card.hidden = true;
        else if (image && !selectedCallout) card.hidden = true;
        else if (image && highlightStyle === "near") card.hidden = nearIds.indexOf(id) === -1;
        else if (image) card.hidden = !same;
        else card.hidden = false;
      });
      document.querySelectorAll(".bom-grid__group").forEach(function (group) {
        group.hidden = false;
      });
      document.querySelectorAll(".bom-near-label").forEach(function (node) {
        var rest = node.classList.contains("bom-near-label--rest");
        node.hidden = grid || (image && rest);
      });
      var table = document.querySelector("#bom-parts .bom-grid");
      if (table) table.hidden = !grid;
    }

    function scrollInParts(node, align) {
      if (!node) return;
      if (align === "start") {
        var header = document.querySelector(".product-header");
        var offset = header ? header.getBoundingClientRect().height + 12 : 12;
        var top = node.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        return;
      }
      node.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
    }

    function showView(mode) {
      currentView = mode;
      document.querySelectorAll("[data-bom-view]").forEach(function (button) {
        var on = button.getAttribute("data-bom-view") === mode;
        button.classList.toggle("is-active", on);
        button.setAttribute("aria-pressed", on ? "true" : "false");
      });
      applyPartsVisibility();
      if (selectedCallout) selectCallout(selectedCallout);
    }

    document.querySelectorAll("[data-bom-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showView(btn.getAttribute("data-bom-view"));
      });
    });

    document.addEventListener("click", function (event) {
      var tab = event.target.closest("[data-bom-tab]");
      if (!tab) return;
      var wrap = tab.closest(".bom-more");
      if (!wrap) return;
      var name = tab.getAttribute("data-bom-tab");
      wrap.querySelectorAll("[data-bom-tab]").forEach(function (btn) {
        var on = btn === tab;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
      wrap.querySelectorAll("[data-bom-tab-panel]").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-bom-tab-panel") !== name;
      });
    });

    document.querySelectorAll("[data-bom-acc]").forEach(function (section) {
      var trigger = section.querySelector("[data-bom-acc-toggle]");
      var panel = section.querySelector("[data-bom-acc-panel]");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        var open = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        if (panel) panel.hidden = !open;
        var mark = trigger.querySelector("[data-bom-acc-mark]");
        if (mark) mark.textContent = open ? "−" : "+";
        syncGridSubs();
      });
    });

    var walkBar = null;
    if (highlightStyle === "walk") {
      walkBar = document.createElement("div");
      walkBar.className = "bom-walk";
      walkBar.hidden = true;
      walkBar.innerHTML =
        '<button type="button" class="bom-walk__step" data-walk="-1">Previous number</button>' +
        '<p class="bom-walk__text"></p>' +
        '<button type="button" class="bom-walk__step" data-walk="1">Next number</button>';
      var walkHost = document.getElementById("bom-parts");
      if (walkHost) walkHost.insertBefore(walkBar, walkHost.firstChild);
      walkBar.addEventListener("click", function (event) {
        var button = event.target.closest("[data-walk]");
        if (!button || button.disabled) return;
        var ids = calloutIds();
        var index = ids.indexOf(selectedCallout);
        var next = ids[index + Number(button.getAttribute("data-walk"))];
        if (next) selectCallout(next);
      });
    }

    function backLink() {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "bom-back";
      button.innerHTML = '<i class="fas fa-reply" aria-hidden="true"></i> Back To Parts List';
      button.addEventListener("click", function () {
        clearSelection();
      });
      return button;
    }

    function restoreGridRefs() {
      document.querySelectorAll(".bom-grid__ref .bom-callout").forEach(function (badge) {
        badge.parentNode.textContent = badge.textContent;
      });
    }

    function placeBackLink(cards, groups) {
      document.querySelectorAll(".bom-back, .bom-back-row").forEach(function (node) {
        node.remove();
      });
      restoreGridRefs();
      if (highlightStyle !== "navy") return;
      groups.forEach(function (group) {
        var ref = group.querySelector(".bom-grid__ref");
        if (!ref) return;
        var badge = document.createElement("span");
        badge.className = "bom-callout";
        badge.textContent = ref.textContent.trim();
        ref.textContent = "";
        ref.appendChild(badge);
      });
      cards.forEach(function (card) {
        card.appendChild(backLink());
      });
    }

    function clearSelection() {
      selectedCallout = null;
      document.body.classList.remove("bom-has-selection");
      document.querySelectorAll(".bom-part.is-hit, .bom-grid__group.is-hit").forEach(function (node) {
        node.classList.remove("is-hit");
      });
      document.querySelectorAll(".bom-hotspot.is-selected").forEach(function (button) {
        button.classList.remove("is-selected");
      });
      document.querySelectorAll(".bom-back, .bom-back-row").forEach(function (node) {
        node.remove();
      });
      restoreGridRefs();
      applyPartsVisibility();
    }

    function updateWalkBar(cards) {
      if (!walkBar) return;
      if (!selectedCallout || !cards.length) {
        walkBar.hidden = true;
        return;
      }
      var ids = calloutIds();
      var index = ids.indexOf(selectedCallout);
      var name = cards[0].querySelector(".bom-part__name");
      walkBar.querySelector(".bom-walk__text").textContent =
        selectedCallout + " · " + (name ? name.textContent.trim() : "") + " · " + (index + 1) + " of " + ids.length;
      var steps = walkBar.querySelectorAll("[data-walk]");
      steps[0].disabled = index <= 0;
      steps[1].disabled = index >= ids.length - 1;
      walkBar.hidden = false;
    }

    if (highlightPreview) {
      var note = document.createElement("p");
      note.className = "bom-option-note";
      note.innerHTML =
        "Selection option: <strong>" +
        highlightStyles[highlightStyle] +
        "</strong>. Click a diagram number or a part on the right. " +
        '<a href="../bom-selected-part/options.html">All options</a>';
      var main = document.querySelector(".bom-main");
      if (main) main.insertBefore(note, main.firstChild);
    }

    function selectSubRow(num) {
      document.querySelectorAll("#bom-parts > .bom-part.is-hit, .bom-grid__group.is-hit").forEach(function (node) {
        node.classList.remove("is-hit");
      });
      document.querySelectorAll(".bom-hotspot.is-selected").forEach(function (button) {
        button.classList.remove("is-selected");
      });
      document.querySelectorAll(".bom-back, .bom-back-row").forEach(function (node) {
        node.remove();
      });
      restoreGridRefs();
      document.body.classList.remove("bom-has-selection");
      selectedCallout = null;
      document.querySelectorAll('.bom-subasm__row[data-bom-level="1"]').forEach(function (row) {
        row.classList.remove("is-dark");
      });
      document.querySelectorAll('.bom-subasm__row[data-bom-level="2"]').forEach(function (row) {
        var mark = row.querySelector(":scope > .bom-callout");
        row.classList.toggle("is-dark", !!(mark && mark.textContent.trim() === num));
      });
      document.querySelectorAll("tr.bom-grid__sub").forEach(function (row) {
        row.classList.toggle("is-dark", row.getAttribute("data-bom-subnum") === num && row.getAttribute("data-bom-level") === "2");
      });
    }

    var partsHost = document.getElementById("bom-parts");
    if (partsHost) {
      partsHost.addEventListener("click", function (event) {
        var row = event.target.closest(".bom-subasm__row, tr.bom-grid__sub");
        if (!row || row.getAttribute("data-bom-level") !== "2") return;
        if (event.target.closest("a, button, input, select, textarea, label")) return;
        var mark = row.querySelector(":scope > .bom-callout, :scope > .bom-grid__ref .bom-grid__num");
        if (mark) selectSubRow(mark.textContent.trim());
      });
    }

    if (highlightStyle) {
      var partsRoot = document.getElementById("bom-parts");
      if (partsRoot) {
        partsRoot.addEventListener("click", function (event) {
          if (event.target.closest("a, button, input, select, textarea, label, .bom-more, .bom-part [data-bom-acc], .bom-grid__group [data-bom-acc], .bom-grid__sub, .bom-grid__accrow")) return;
          var card = event.target.closest("#bom-parts > .bom-part");
          var group = event.target.closest(".bom-grid__group");
          var callout = "";
          if (card) {
            var mark = card.querySelector(".bom-callout");
            callout = mark ? mark.textContent.trim() : "";
          } else if (group) {
            var ref = group.querySelector(".bom-grid__ref");
            callout = ref ? ref.textContent.trim() : "";
          }
          if (callout) selectCallout(callout);
        });
      }
    }

    document.querySelectorAll("[data-bom-scroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.getAttribute("data-bom-scroll");
        var delta = dir === "up" ? -360 : 360;
        window.scrollBy({ top: delta, behavior: "smooth" });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

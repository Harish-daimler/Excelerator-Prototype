/**
 * Available Coverages admin — which packages appear after VIN, plus pricing.
 *
 * Bundle composition is authored on a separate page, so bundle contents are
 * read-only here. The bundle is priced as a single unit — its MSRP/Dnet is the
 * sum of the packages it includes, and one discount or markup applies to that.
 *
 * Show after VIN replaces pre-select. Hidden packages stay in this admin for
 * pricing, but they do not appear on the customer coverage listing.
 */
(function () {
  var root = document.querySelector("[data-ac-root]");
  if (!root) return;

  var TERMS = [
    { id: "6m", label: "6 month / 60,000 mi" },
    { id: "1y", label: "1 year / 125,000 mi" },
    { id: "2y", label: "2 years / 250,000 mi" },
    { id: "3y", label: "3 years / 375,000 mi" },
  ];

  function termBases(msrp, dnet) {
    return TERMS.map(function (term, index) {
      return {
        id: term.id,
        label: term.label,
        msrp: msrp[index],
        dnet: dnet[index],
      };
    });
  }

  function multiPkg(id, name, category, msrp, dnet, extras) {
    return Object.assign(
      {
        id: id,
        name: name,
        category: category,
        coverageType: "category",
        terms: termBases(msrp, dnet),
        mode: "msrp",
        percent: 10,
        shown: false,
      },
      extras || {}
    );
  }

  var OFFERINGS = {
    next: {
      id: "next",
      label: "Extended NEXT",
      packages: [
        multiPkg("en2", "EN2", "Engine", [2800, 3200, 4000, 4800], [2100, 2400, 3000, 3600]),
        multiPkg("en3", "EN3", "Engine", [4200, 4800, 5600, 6500], [3200, 3600, 4200, 4900]),
        multiPkg(
          "en4",
          "EN4",
          "Engine",
          [5200, 6000, 7200, 8500],
          [3900, 4500, 5400, 6400],
          { popular: true, shown: true }
        ),
        multiPkg("entc2", "ENTC2", "Chassis", [2800, 3200, 4000, 4800], [2100, 2400, 3000, 3600]),
        multiPkg("entc4", "ENTC4", "Chassis", [4200, 4800, 5600, 6500], [3200, 3600, 4200, 4900], { shown: true }),
      ],
    },
    optimum: {
      id: "optimum",
      label: "Extended OPTIMUM",
      priority: "bundle",
      packages: [
        multiPkg(
          "opt-eng-basic",
          "Engine Basic",
          "Engine",
          [2200, 2600, 3200, 3800],
          [1600, 1900, 2400, 2800]
        ),
        multiPkg(
          "opt-eng-enh",
          "Engine Enhanced",
          "Engine",
          [3600, 4200, 5000, 5800],
          [2700, 3100, 3800, 4400]
        ),
        multiPkg(
          "opt-eng-ult",
          "Engine Ultimate",
          "Engine",
          [4800, 5600, 6800, 7800],
          [3600, 4200, 5100, 5900],
          { popular: true, shown: true }
        ),
        multiPkg(
          "opt-chs-basic",
          "Chassis Basic",
          "Chassis",
          [2000, 2400, 3000, 3600],
          [1500, 1800, 2200, 2700]
        ),
        multiPkg(
          "opt-towing",
          "Towing",
          "Towing",
          [2500, 3500, 4500, 6500],
          [1800, 2500, 3200, 4600],
          { coverageType: "standalone", shown: true }
        ),
        multiPkg(
          "opt-ats",
          "Chassis ATS/DEF",
          "Chassis ATS/DEF",
          [2500, 3500, 4500, 6500],
          [1800, 2500, 3200, 4600],
          { coverageType: "standalone" }
        ),
        multiPkg(
          "opt-trans",
          "DT 12 Trans + DT Axle",
          "DT 12 Trans + DT Axle",
          [2500, 3500, 4500, 6500],
          [1800, 2500, 3200, 4600],
          { coverageType: "standalone" }
        ),
      ],
      bundle: {
        name: "OPTIMUM Bundle",
        memberIds: ["opt-eng-basic", "opt-chs-basic"],
        mode: "msrp",
        percent: 20,
        terms: [],
        shown: false,
      },
    },
  };

  var state = null;
  var baseline = null;
  var updateBtns = document.querySelectorAll("[data-ac-update]");
  var resetBtns = document.querySelectorAll("[data-ac-reset]");
  var errorEl = document.querySelector("[data-ac-error]");

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function money(n) {
    return (
      "$" +
      Math.round(n).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
    );
  }

  function calcPrice(term, mode, percent) {
    var pct = Number(percent);
    if (isNaN(pct) || pct < 0) pct = 0;
    if (mode === "msrp") return term.msrp * (1 - pct / 100);
    return term.dnet * (1 + pct / 100);
  }

  function bundleMemberPackages(offering) {
    return offering.bundle.memberIds
      .map(function (id) {
        return offering.packages.find(function (pkg) {
          return pkg.id === id;
        });
      })
      .filter(Boolean);
  }

  /**
   * The bundle's base MSRP/Dnet is the sum of the packages it includes, so the
   * numbers stay authored once on the package definitions.
   */
  function buildBundleTerms(offering) {
    var members = bundleMemberPackages(offering);
    return TERMS.map(function (term, index) {
      var msrp = 0;
      var dnet = 0;
      members.forEach(function (pkg) {
        msrp += pkg.terms[index].msrp;
        dnet += pkg.terms[index].dnet;
      });
      return { id: term.id, label: term.label, msrp: msrp, dnet: dnet };
    });
  }

  function hasBundle(offering) {
    return !!offering.bundle;
  }

  function categoryPackages(offering) {
    return offering.packages.filter(function (pkg) {
      return pkg.coverageType === "category";
    });
  }

  function standalonePackages(offering) {
    return offering.packages.filter(function (pkg) {
      return pkg.coverageType === "standalone";
    });
  }

  function groupByCategory(packages) {
    var groups = [];
    var map = {};
    packages.forEach(function (pkg) {
      if (!map[pkg.category]) {
        map[pkg.category] = { name: pkg.category, packages: [] };
        groups.push(map[pkg.category]);
      }
      map[pkg.category].packages.push(pkg);
    });
    return groups;
  }

  function findPkg(offeringId, pkgId) {
    return state[offeringId].packages.find(function (pkg) {
      return pkg.id === pkgId;
    });
  }

  function shownPackages(offering) {
    return offering.packages.filter(function (pkg) {
      return pkg.shown;
    });
  }

  function setPackageShown(offeringId, pkgId, shown) {
    var pkg = findPkg(offeringId, pkgId);
    if (!pkg) return;
    pkg.shown = shown;
  }

  function setBundleShown(offeringId, shown) {
    var offering = state[offeringId];
    if (!hasBundle(offering)) return;
    offering.bundle.shown = shown;
  }

  function listingItems() {
    var items = [];
    ["next", "optimum"].forEach(function (id) {
      var offering = state[id];
      if (hasBundle(offering) && offering.bundle.shown) {
        var mid = offering.bundle.terms[1] || offering.bundle.terms[0];
        items.push({
          id: "bundle-" + id,
          name: offering.bundle.name,
          category: "Bundle",
          offeringId: id,
          offeringLabel: offering.label,
          popular: false,
          price: money(calcPrice(mid, offering.bundle.mode, offering.bundle.percent)),
          blurb: "Includes " + offering.bundle.memberIds.length + " coverages as one package.",
        });
      }
      offering.packages.forEach(function (pkg) {
        if (!pkg.shown) return;
        var term = pkg.terms[1] || pkg.terms[0];
        items.push({
          id: pkg.id,
          name: pkg.name,
          category: pkg.category,
          offeringId: id,
          offeringLabel: offering.label,
          popular: !!pkg.popular,
          price: money(calcPrice(term, pkg.mode, pkg.percent)),
          blurb: pkg.category + " coverage from " + offering.label + ".",
        });
      });
    });
    return items;
  }

  var CATALOG_KEY = "ex-dealer-coverage-catalog";

  function persistCatalog() {
    try {
      sessionStorage.setItem(
        CATALOG_KEY,
        JSON.stringify({ items: listingItems() })
      );
    } catch (e) {}
  }

  /**
   * config: entityKey, terms, mode, percent, msrpLabel, dnetLabel
   */
  function renderTermTable(config) {
    var rows = config.terms
      .map(function (term) {
        return (
          "<tr>" +
          "<td>" +
          term.label +
          "</td>" +
          '<td class="ac-num">' +
          money(term.msrp) +
          "</td>" +
          '<td class="ac-num">' +
          money(term.dnet) +
          "</td>" +
          '<td class="ac-num ac-price" data-ac-price="' +
          config.entityKey +
          ":" +
          term.id +
          '">' +
          money(calcPrice(term, config.mode, config.percent)) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="ac-table-wrap"><table class="ac-table">' +
      "<thead><tr>" +
      "<th>Term</th><th>" +
      (config.msrpLabel || "MSRP") +
      "</th><th>" +
      (config.dnetLabel || "Dnet") +
      "</th><th>Customer price</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table></div>"
    );
  }

  function renderModeControls(entityKey, mode, percent, name) {
    var pctId = entityKey + "-pct";
    return (
      '<div class="ac-mode">' +
      '<label class="ac-mode__option"><input type="radio" name="' +
      entityKey +
      '-mode" value="msrp" data-ac-mode="' +
      entityKey +
      '"' +
      (mode === "msrp" ? " checked" : "") +
      " /> MSRP % discount</label>" +
      '<label class="ac-mode__option"><input type="radio" name="' +
      entityKey +
      '-mode" value="dnet" data-ac-mode="' +
      entityKey +
      '"' +
      (mode === "dnet" ? " checked" : "") +
      " /> Dnet % markup</label>" +
      '<label class="ac-pct" for="' +
      pctId +
      '"><span>' +
      (mode === "msrp" ? "Discount %" : "Markup %") +
      '</span><input id="' +
      pctId +
      '" type="number" min="0" max="100" step="0.1" value="' +
      percent +
      '" data-ac-percent="' +
      entityKey +
      '" aria-label="' +
      name +
      ' percent" /></label>' +
      "</div>"
    );
  }

  function renderShowControl(offeringId, pkg) {
    return (
      '<label class="ac-show">' +
      '<input type="checkbox" data-ac-show="' +
      offeringId +
      ":" +
      pkg.id +
      '"' +
      (pkg.shown ? " checked" : "") +
      " /> Show after VIN</label>"
    );
  }

  function renderPackageCard(offeringId, pkg) {
    var key = "pkg:" + offeringId + ":" + pkg.id;

    return (
      '<article class="ac-card' +
      (pkg.shown ? " is-shown" : " is-hidden-from-customer") +
      '" data-ac-package="' +
      pkg.id +
      '">' +
      '<div class="ac-card__top">' +
      '<h5 class="ac-card__title">' +
      pkg.name +
      (pkg.popular ? ' <span class="ac-popular">Popular</span>' : "") +
      (pkg.shown
        ? ' <span class="ac-vis-tag ac-vis-tag--public">On listing</span>'
        : ' <span class="ac-vis-tag">Hidden from customer</span>') +
      "</h5>" +
      renderShowControl(offeringId, pkg) +
      "</div>" +
      renderModeControls(key, pkg.mode, pkg.percent, pkg.name) +
      renderTermTable({
        entityKey: key,
        terms: pkg.terms,
        mode: pkg.mode,
        percent: pkg.percent,
      }) +
      "</article>"
    );
  }

  function catalogHint(offering) {
    var names = shownPackages(offering).map(function (pkg) {
      return pkg.name;
    });
    if (hasBundle(offering) && offering.bundle.shown) {
      names.unshift(offering.bundle.name);
    }
    if (!names.length) {
      return {
        warning: true,
        text:
          "No " +
          offering.label +
          " packages are shown after VIN, so this offering will not appear on the customer coverage listing.",
      };
    }
    return {
      warning: false,
      text:
        "After VIN, customers will see " +
        names.join(", ") +
        " on the coverage listing.",
    };
  }

  function renderCatalogHint(offering) {
    var hint = catalogHint(offering);
    return (
      '<p class="ac-priority__hint' +
      (hint.warning ? " is-warning" : "") +
      '"><i class="fas ' +
      (hint.warning ? "fa-triangle-exclamation" : "fa-circle-info") +
      '" aria-hidden="true"></i> ' +
      hint.text +
      "</p>"
    );
  }

  function renderBundle(offeringId, offering) {
    var bundle = offering.bundle;
    var key = "bundle:" + offeringId;

    return (
      '<section class="ac-bundle">' +
      '<article class="ac-card ac-card--bundle' +
      (bundle.shown ? " is-shown" : " is-hidden-from-customer") +
      '">' +
      '<div class="ac-card__top">' +
      '<h4 class="ac-card__title">' +
      bundle.name +
      (bundle.shown
        ? ' <span class="ac-vis-tag ac-vis-tag--public">On listing</span>'
        : ' <span class="ac-vis-tag">Hidden from customer</span>') +
      "</h4>" +
      '<label class="ac-show">' +
      '<input type="checkbox" data-ac-bundle-show="' +
      offeringId +
      '"' +
      (bundle.shown ? " checked" : "") +
      " /> Show after VIN</label>" +
      "</div>" +
      '<p class="ac-bundle-help">Bundle contents are managed on the bundle composition page and cannot be changed here. Showing the bundle after VIN does not hide the individual packages — turn those off separately if you only want the bundle on the listing.</p>' +
      renderBundleContents(offering) +
      renderModeControls(key, bundle.mode, bundle.percent, bundle.name) +
      renderTermTable({
        entityKey: key,
        terms: bundle.terms,
        mode: bundle.mode,
        percent: bundle.percent,
        msrpLabel: "MSRP total",
        dnetLabel: "Dnet total",
      }) +
      "</article></section>"
    );
  }

  function renderOffering(offeringId) {
    var offering = state[offeringId];
    var panel = root.querySelector('[data-ac-offering-panel="' + offeringId + '"]');
    if (!panel) return;

    var categoryGroups = groupByCategory(categoryPackages(offering))
      .map(function (group) {
        return (
          '<section class="ac-category">' +
          '<div class="ac-category__head">' +
          '<h4 class="ac-category__title">' +
          group.name +
          "</h4></div>" +
          '<p class="ac-category__help">Choose which ' +
          group.name +
          " packages appear on the customer coverage listing after VIN lookup. Customers can compare every package you show.</p>" +
          '<div class="ac-category__packages">' +
          group.packages
            .map(function (pkg) {
              return renderPackageCard(offeringId, pkg);
            })
            .join("") +
          "</div></section>"
        );
      })
      .join("");

    var standalone = standalonePackages(offering);
    var standaloneSection = standalone.length
      ? '<section class="ac-standalone">' +
        '<h4 class="ac-category__title">Standalone coverages</h4>' +
        '<p class="ac-category__help">Show as many as you want. These appear as add-ons on the coverage listing after VIN.</p>' +
        '<div class="ac-category__packages">' +
        standalone
          .map(function (pkg) {
            return renderPackageCard(offeringId, pkg);
          })
          .join("") +
        "</div></section>"
      : "";

    panel.innerHTML =
      renderCatalogHint(offering) +
      (hasBundle(offering) ? renderBundle(offeringId, offering) : "") +
      categoryGroups +
      standaloneSection;
  }

  function renderBundleContents(offering) {
    var chips = bundleMemberPackages(offering)
      .map(function (pkg) {
        return (
          '<span class="ac-member-tag"><i class="fas fa-lock" aria-hidden="true"></i> ' +
          pkg.name +
          "</span>"
        );
      })
      .join("");

    return (
      '<div class="ac-bundle-contents">' +
      '<span class="ac-bundle-contents__label">Includes</span>' +
      '<div class="ac-bundle-members">' +
      chips +
      "</div>" +
      "</div>"
    );
  }

  function renderAll() {
    renderOffering("next");
    renderOffering("optimum");
    bindControls();
    syncDirty();
  }

  function parseEntityKey(key) {
    var parts = key.split(":");
    return { type: parts[0], offeringId: parts[1], id: parts[2] };
  }

  function getEntity(key) {
    var ref = parseEntityKey(key);
    if (ref.type === "pkg") return findPkg(ref.offeringId, ref.id);
    var offering = state[ref.offeringId];
    return offering && offering.bundle ? offering.bundle : null;
  }

  function refreshPrices(entityKey) {
    var entity = getEntity(entityKey);
    if (!entity || !entity.terms) return;
    entity.terms.forEach(function (term) {
      var cell = root.querySelector(
        '[data-ac-price="' + entityKey + ":" + term.id + '"]'
      );
      if (cell) cell.textContent = money(calcPrice(term, entity.mode, entity.percent));
    });

    var pctInput = root.querySelector('[data-ac-percent="' + entityKey + '"]');
    if (pctInput && pctInput.previousElementSibling) {
      pctInput.previousElementSibling.textContent =
        entity.mode === "msrp" ? "Discount %" : "Markup %";
    }
  }

  function bindControls() {
    root.querySelectorAll("[data-ac-show]").forEach(function (input) {
      input.addEventListener("change", function () {
        var parts = input.getAttribute("data-ac-show").split(":");
        setPackageShown(parts[0], parts[1], input.checked);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-bundle-show]").forEach(function (input) {
      input.addEventListener("change", function () {
        setBundleShown(input.getAttribute("data-ac-bundle-show"), input.checked);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-mode]").forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.checked) return;
        var key = input.getAttribute("data-ac-mode");
        var entity = getEntity(key);
        if (!entity) return;
        entity.mode = input.value;
        refreshPrices(key);
        syncDirty();
      });
    });

    root.querySelectorAll("[data-ac-percent]").forEach(function (input) {
      input.addEventListener("input", function () {
        var key = input.getAttribute("data-ac-percent");
        var entity = getEntity(key);
        if (!entity) return;
        entity.percent = input.value === "" ? 0 : Number(input.value);
        refreshPrices(key);
        syncDirty();
      });
    });
  }

  function isDirty() {
    return JSON.stringify(state) !== JSON.stringify(baseline);
  }

  function syncDirty() {
    var dirty = isDirty();
    updateBtns.forEach(function (btn) {
      btn.disabled = !dirty;
    });
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
      errorEl.classList.remove("is-success");
    }
  }

  function showError(message, success) {
    if (!errorEl) return;
    errorEl.hidden = false;
    errorEl.textContent = message;
    errorEl.classList.toggle("is-success", !!success);
  }

  root.querySelectorAll("[data-ac-offering-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-ac-offering-tab");
      root.querySelectorAll("[data-ac-offering-tab]").forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      root.querySelectorAll("[data-ac-offering-panel]").forEach(function (panel) {
        var active = panel.getAttribute("data-ac-offering-panel") === id;
        panel.classList.toggle("is-active", active);
        if (active) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });
    });
  });

  root.querySelectorAll('a[href="coverage-listing.html"]').forEach(function (link) {
    link.addEventListener("click", function () {
      persistCatalog();
    });
  });

  resetBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state = clone(baseline);
      renderAll();
    });
  });

  updateBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      baseline = clone(state);
      persistCatalog();
      syncDirty();
      var count = listingItems().length;
      showError(
        "Coverage listing updated. Customers will see " +
          count +
          " package" +
          (count === 1 ? "" : "s") +
          " after VIN lookup.",
        true
      );
      setTimeout(function () {
        if (errorEl) {
          errorEl.classList.remove("is-success");
          errorEl.hidden = true;
        }
      }, 2500);
    });
  });

  Object.keys(OFFERINGS).forEach(function (id) {
    if (hasBundle(OFFERINGS[id])) {
      OFFERINGS[id].bundle.terms = buildBundleTerms(OFFERINGS[id]);
    }
  });

  state = clone(OFFERINGS);
  baseline = clone(OFFERINGS);
  try {
    if (!sessionStorage.getItem(CATALOG_KEY)) persistCatalog();
  } catch (e) {}
  renderAll();
})();

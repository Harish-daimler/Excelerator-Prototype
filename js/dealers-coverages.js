/**
 * Available Coverages admin — packages + one bundle per offering type.
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
        terms: termBases(msrp, dnet),
        show: true,
        mode: "msrp",
        percent: 10,
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
          { popular: true }
        ),
        multiPkg("entc2", "ENTC2", "Chassis", [2800, 3200, 4000, 4800], [2100, 2400, 3000, 3600]),
        multiPkg("entc4", "ENTC4", "Chassis", [4200, 4800, 5600, 6500], [3200, 3600, 4200, 4900]),
      ],
      bundle: {
        name: "NEXT Bundle",
        show: false,
        mode: "msrp",
        percent: 12,
        packageIds: [],
        terms: termBases([7000, 8000, 9500, 11000], [5200, 6000, 7200, 8300]),
      },
    },
    optimum: {
      id: "optimum",
      label: "Extended OPTIMUM",
      packages: [
        multiPkg("opt-eng-basic", "Basic", "Engine", [2200, 2600, 3200, 3800], [1600, 1900, 2400, 2800]),
        multiPkg("opt-eng-enh", "Enhanced", "Engine", [3600, 4200, 5000, 5800], [2700, 3100, 3800, 4400]),
        multiPkg(
          "opt-eng-ult",
          "Ultimate",
          "Engine",
          [4800, 5600, 6800, 7800],
          [3600, 4200, 5100, 5900],
          { popular: true }
        ),
        multiPkg("opt-chs-basic", "Basic", "Chassis", [2000, 2400, 3000, 3600], [1500, 1800, 2200, 2700]),
        multiPkg(
          "opt-towing",
          "Towing",
          "Towing",
          [2500, 3500, 4500, 6500],
          [1800, 2500, 3200, 4600]
        ),
        multiPkg(
          "opt-ats",
          "Chassis ATS/DEF",
          "Chassis ATS/DEF",
          [2500, 3500, 4500, 6500],
          [1800, 2500, 3200, 4600]
        ),
        multiPkg(
          "opt-trans",
          "DT 12 Trans + DT Axle",
          "DT 12 Trans + DT Axle",
          [2500, 3500, 4500, 6500],
          [1800, 2500, 3200, 4600]
        ),
      ],
      bundle: {
        name: "OPTIMUM Bundle",
        show: false,
        mode: "dnet",
        percent: 15,
        packageIds: [],
        terms: termBases([6500, 7500, 9000, 10500], [4800, 5600, 6800, 7900]),
      },
    },
  };

  var state = null;
  var baseline = null;
  var updateBtn = document.querySelector("[data-ac-update]");
  var resetBtn = document.querySelector("[data-ac-reset]");
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

  function renderTermTable(entityKey, terms, mode, percent) {
    var rows = terms
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
          entityKey +
          ":" +
          term.id +
          '">' +
          money(calcPrice(term, mode, percent)) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="ac-table-wrap"><table class="ac-table">' +
      "<thead><tr>" +
      "<th>Term</th><th>MSRP</th><th>Dnet</th><th>Customer price</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table></div>"
    );
  }

  function renderModeControls(entityKey, mode, percent, name) {
    var msrpId = entityKey + "-msrp";
    var dnetId = entityKey + "-dnet";
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

  function renderPackageCard(offeringId, pkg) {
    var key = "pkg:" + offeringId + ":" + pkg.id;
    return (
      '<article class="ac-card" data-ac-package="' +
      pkg.id +
      '">' +
      '<div class="ac-card__top">' +
      '<h5 class="ac-card__title">' +
      pkg.name +
      (pkg.popular ? ' <span class="ac-popular">Popular</span>' : "") +
      "</h5>" +
      '<label class="ac-show"><input type="checkbox" data-ac-show="' +
      key +
      '"' +
      (pkg.show ? " checked" : "") +
      " /> Show to customers</label>" +
      "</div>" +
      renderModeControls(key, pkg.mode, pkg.percent, pkg.name) +
      renderTermTable(key, pkg.terms, pkg.mode, pkg.percent) +
      "</article>"
    );
  }

  function getBundleItems(offering) {
    return offering.packages.map(function (pkg) {
      return {
        id: pkg.id,
        label: pkg.name,
        packageIds: [pkg.id],
      };
    });
  }

  function countSelectedBundleItems(offeringId) {
    var bundle = state[offeringId].bundle;
    var items = getBundleItems(state[offeringId]);
    var selected = 0;

    items.forEach(function (item) {
      var allSelected = item.packageIds.every(function (id) {
        return bundle.packageIds.indexOf(id) !== -1;
      });
      if (allSelected && item.packageIds.length) selected += 1;
    });

    return selected;
  }

  function isBundleItemChecked(bundle, item) {
    return item.packageIds.every(function (id) {
      return bundle.packageIds.indexOf(id) !== -1;
    });
  }

  function renderBundle(offeringId, offering) {
    var bundle = offering.bundle;
    var key = "bundle:" + offeringId;
    var selectedCount = countSelectedBundleItems(offeringId);
    var options = getBundleItems(offering)
      .map(function (item) {
        var checked = isBundleItemChecked(bundle, item);
        return (
          '<label class="ac-bundle-pkg"><input type="checkbox" data-ac-bundle-item="' +
          offeringId +
          ":" +
          item.id +
          '" data-ac-bundle-pkgs="' +
          item.packageIds.join(",") +
          '"' +
          (checked ? " checked" : "") +
          " /> " +
          item.label +
          "</label>"
        );
      })
      .join("");

    return (
      '<section class="ac-bundle">' +
      '<article class="ac-card ac-card--bundle">' +
      '<div class="ac-card__top">' +
      '<h4 class="ac-card__title">' +
      bundle.name +
      "</h4>" +
      '<label class="ac-show"><input type="checkbox" data-ac-show="' +
      key +
      '"' +
      (bundle.show ? " checked" : "") +
      " /> Show bundle to customers</label>" +
      "</div>" +
      '<p class="ac-bundle-help">One bundle per offering. Select at least 2 packages. Bundle membership is independent of individual show/hide.</p>' +
      '<div class="ac-bundle-grid">' +
      options +
      "</div>" +
      '<p class="ac-bundle-count" data-ac-bundle-count="' +
      offeringId +
      '">' +
      selectedCount +
      " selected (minimum 2)</p>" +
      renderModeControls(key, bundle.mode, bundle.percent, bundle.name) +
      renderTermTable(key, bundle.terms, bundle.mode, bundle.percent) +
      "</article></section>"
    );
  }

  function renderOffering(offeringId) {
    var offering = state[offeringId];
    var panel = root.querySelector('[data-ac-offering-panel="' + offeringId + '"]');
    if (!panel) return;

    var groups = groupByCategory(offering.packages)
      .map(function (group) {
        return (
          '<section class="ac-category">' +
          "<h4 class=\"ac-category__title\">" +
          group.name +
          "</h4>" +
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

    panel.innerHTML = renderBundle(offeringId, offering) + groups;
  }

  function renderAll() {
    renderOffering("next");
    renderOffering("optimum");
    bindControls();
    syncDirty();
  }

  function parseEntityKey(key) {
    var parts = key.split(":");
    if (parts[0] === "pkg") {
      return { type: "pkg", offeringId: parts[1], id: parts[2] };
    }
    return { type: "bundle", offeringId: parts[1] };
  }

  function getEntity(key) {
    var ref = parseEntityKey(key);
    if (ref.type === "pkg") return findPkg(ref.offeringId, ref.id);
    return state[ref.offeringId].bundle;
  }

  function refreshPrices(entityKey) {
    var entity = getEntity(entityKey);
    if (!entity) return;
    entity.terms.forEach(function (term) {
      var cell = root.querySelector(
        '[data-ac-price="' + entityKey + ":" + term.id + '"]'
      );
      if (cell) cell.textContent = money(calcPrice(term, entity.mode, entity.percent));
    });
    var pctLabel = root.querySelector(
      '[data-ac-percent="' + entityKey + '"]'
    );
    if (pctLabel && pctLabel.previousElementSibling) {
      pctLabel.previousElementSibling.textContent =
        entity.mode === "msrp" ? "Discount %" : "Markup %";
    }
  }

  function updateBundleCount(offeringId) {
    var el = root.querySelector('[data-ac-bundle-count="' + offeringId + '"]');
    if (!el) return;
    var count = countSelectedBundleItems(offeringId);
    el.textContent = count + " selected (minimum 2)";
    el.classList.toggle("is-invalid", count > 0 && count < 2);
  }

  function bindControls() {
    root.querySelectorAll("[data-ac-show]").forEach(function (input) {
      input.addEventListener("change", function () {
        var entity = getEntity(input.getAttribute("data-ac-show"));
        if (entity) entity.show = input.checked;
        syncDirty();
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

    root.querySelectorAll("[data-ac-bundle-item]").forEach(function (input) {
      input.addEventListener("change", function () {
        var offeringId = input.getAttribute("data-ac-bundle-item").split(":")[0];
        var pkgIds = (input.getAttribute("data-ac-bundle-pkgs") || "").split(",");
        var ids = state[offeringId].bundle.packageIds;

        pkgIds.forEach(function (pkgId) {
          if (!pkgId) return;
          var idx = ids.indexOf(pkgId);
          if (input.checked && idx === -1) ids.push(pkgId);
          if (!input.checked && idx !== -1) ids.splice(idx, 1);
        });

        updateBundleCount(offeringId);
        syncDirty();
      });
    });
  }

  function isDirty() {
    return JSON.stringify(state) !== JSON.stringify(baseline);
  }

  function validateBundles() {
    var issues = [];
    ["next", "optimum"].forEach(function (id) {
      var bundle = state[id].bundle;
      var count = countSelectedBundleItems(id);
      if (count === 1 || (bundle.show && count < 2)) {
        issues.push(
          state[id].label +
            " bundle needs at least 2 packages" +
            (bundle.show ? " when shown to customers" : "") +
            "."
        );
      }
    });
    return issues;
  }

  function syncDirty() {
    if (updateBtn) updateBtn.disabled = !isDirty();
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.hidden = false;
    errorEl.textContent = message;
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

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state = clone(baseline);
      renderAll();
    });
  }

  if (updateBtn) {
    updateBtn.addEventListener("click", function () {
      var issues = validateBundles();
      if (issues.length) {
        showError(issues.join(" "));
        return;
      }
      baseline = clone(state);
      syncDirty();
      showError("Configuration updated for this dealership.");
      errorEl.classList.add("is-success");
      setTimeout(function () {
        if (errorEl) {
          errorEl.classList.remove("is-success");
          errorEl.hidden = true;
        }
      }, 2500);
    });
  }

  state = clone(OFFERINGS);
  baseline = clone(OFFERINGS);
  renderAll();
})();

/**
 * Available Coverages admin — customer defaults, pricing, and bundle composition.
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
        preselected: false,
        defaultTermId: null,
      },
      extras || {}
    );
  }

  var OFFERINGS = {
    next: {
      id: "next",
      label: "Extended NEXT",
      selectionMode: null,
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
    },
    optimum: {
      id: "optimum",
      label: "Extended OPTIMUM",
      selectionMode: null,
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
          { popular: true }
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
          { coverageType: "standalone", bundleEligible: true }
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
        mode: "dnet",
        percent: 15,
        packageIds: [],
        terms: termBases([6500, 7500, 9000, 10500], [4800, 5600, 6800, 7900]),
        preselected: false,
        defaultTermId: null,
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

  function syncSelectionMode(offeringId) {
    var offering = state[offeringId];
    if (hasBundle(offering) && offering.bundle.preselected) {
      offering.selectionMode = "bundle";
      return;
    }
    var hasCategoryDefault = categoryPackages(offering).some(function (pkg) {
      return pkg.preselected;
    });
    offering.selectionMode = hasCategoryDefault ? "categories" : null;
  }

  function clearCategoryDefaults(offeringId) {
    categoryPackages(state[offeringId]).forEach(function (pkg) {
      pkg.preselected = false;
      pkg.defaultTermId = null;
    });
  }

  function setCategoryDefault(offeringId, category, pkgId) {
    var offering = state[offeringId];
    if (hasBundle(offering)) {
      offering.bundle.preselected = false;
      offering.bundle.defaultTermId = null;
    }

    categoryPackages(offering).forEach(function (pkg) {
      if (pkg.category === category) {
        pkg.preselected = pkgId ? pkg.id === pkgId : false;
        if (!pkg.preselected) pkg.defaultTermId = null;
      }
    });

    syncSelectionMode(offeringId);
  }

  function setBundlePreselected(offeringId, preselected) {
    var offering = state[offeringId];
    if (!hasBundle(offering)) return;
    if (preselected) {
      clearCategoryDefaults(offeringId);
      offering.bundle.preselected = true;
      offering.selectionMode = "bundle";
      return;
    }

    offering.bundle.preselected = false;
    offering.bundle.defaultTermId = null;
    syncSelectionMode(offeringId);
  }

  function setStandalonePreselected(offeringId, pkgId, preselected) {
    var pkg = findPkg(offeringId, pkgId);
    if (!pkg) return;
    pkg.preselected = preselected;
    if (!preselected) pkg.defaultTermId = null;
  }

  function setDefaultTerm(entityKey, termId) {
    var entity = getEntity(entityKey);
    if (!entity || !entity.preselected) return;
    entity.defaultTermId = termId;
  }

  function renderTermTable(entityKey, terms, mode, percent, preselected, defaultTermId) {
    var rows = terms
      .map(function (term) {
        var termKey = entityKey + ":" + term.id;
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
          termKey +
          '">' +
          money(calcPrice(term, mode, percent)) +
          "</td>" +
          '<td class="ac-term-default">' +
          '<label class="ac-term-default__label">' +
          '<input type="radio" name="default-term-' +
          entityKey +
          '" value="' +
          term.id +
          '" data-ac-default-term="' +
          termKey +
          '"' +
          (preselected ? "" : " disabled") +
          (defaultTermId === term.id ? " checked" : "") +
          ' aria-label="Default term: ' +
          term.label +
          '" />' +
          '<span class="visually-hidden">Default</span>' +
          "</label>" +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="ac-table-wrap"><table class="ac-table">' +
      "<thead><tr>" +
      "<th>Term</th><th>MSRP</th><th>Dnet</th><th>Customer price</th><th>Default term</th>" +
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

  function renderCategoryDefaultControl(offeringId, pkg, offering) {
    var disabled = hasBundle(offering) && offering.selectionMode === "bundle";
    return (
      '<label class="ac-default' +
      (disabled ? " is-disabled" : "") +
      '">' +
      '<input type="radio" name="default-cat-' +
      offeringId +
      "-" +
      pkg.category +
      '" data-ac-category-default="' +
      offeringId +
      ":" +
      pkg.category +
      ":" +
      pkg.id +
      '"' +
      (pkg.preselected ? " checked" : "") +
      (disabled ? " disabled" : "") +
      " /> Customer default for " +
      pkg.category +
      "</label>"
    );
  }

  function renderStandaloneDefaultControl(offeringId, pkg) {
    return (
      '<label class="ac-default">' +
      '<input type="checkbox" data-ac-standalone-default="' +
      offeringId +
      ":" +
      pkg.id +
      '"' +
      (pkg.preselected ? " checked" : "") +
      " /> Pre-select for customers</label>"
    );
  }

  function renderPackageCard(offeringId, pkg, offering) {
    var key = "pkg:" + offeringId + ":" + pkg.id;
    var defaultControl =
      pkg.coverageType === "standalone"
        ? renderStandaloneDefaultControl(offeringId, pkg)
        : renderCategoryDefaultControl(offeringId, pkg, offering);

    return (
      '<article class="ac-card' +
      (pkg.preselected ? " is-preselected" : "") +
      '" data-ac-package="' +
      pkg.id +
      '">' +
      '<div class="ac-card__top">' +
      '<h5 class="ac-card__title">' +
      pkg.name +
      (pkg.popular ? ' <span class="ac-popular">Popular</span>' : "") +
      "</h5>" +
      defaultControl +
      "</div>" +
      renderModeControls(key, pkg.mode, pkg.percent, pkg.name) +
      renderTermTable(
        key,
        pkg.terms,
        pkg.mode,
        pkg.percent,
        pkg.preselected,
        pkg.defaultTermId
      ) +
      "</article>"
    );
  }

  function bundleEligiblePackages(offering) {
    return offering.packages.filter(function (pkg) {
      return pkg.coverageType === "category" || pkg.bundleEligible;
    });
  }

  function getBundleItems(offering) {
    return bundleEligiblePackages(offering).map(function (pkg) {
      return {
        id: pkg.id,
        label: pkg.name,
        packageIds: [pkg.id],
      };
    });
  }

  function countSelectedBundleItems(offeringId) {
    var offering = state[offeringId];
    if (!hasBundle(offering)) return 0;
    var bundle = offering.bundle;
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
    var categoryMode = offering.selectionMode === "categories";
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
      '<article class="ac-card ac-card--bundle' +
      (bundle.preselected ? " is-preselected" : "") +
      '">' +
      '<div class="ac-card__top">' +
      '<h4 class="ac-card__title">' +
      bundle.name +
      "</h4>" +
      '<div class="ac-card__defaults">' +
      '<label class="ac-default' +
      (categoryMode ? " is-disabled" : "") +
      '">' +
      '<input type="radio" name="default-offering-' +
      offeringId +
      '" data-ac-bundle-default="' +
      offeringId +
      '"' +
      (bundle.preselected ? " checked" : "") +
      (categoryMode ? " disabled" : "") +
      " /> Pre-select bundle when customers arrive</label>" +
      (bundle.preselected
        ? '<button type="button" class="ac-clear-default" data-ac-clear-bundle="' +
          offeringId +
          '">Clear bundle default</button>'
        : "") +
      "</div>" +
      "</div>" +
      '<p class="ac-bundle-help">Extended OPTIMUM only. Select at least 2 packages to compose the bundle (category packages and Towing). Bundle default and category defaults are mutually exclusive.</p>' +
      '<div class="ac-bundle-grid">' +
      options +
      "</div>" +
      '<p class="ac-bundle-count" data-ac-bundle-count="' +
      offeringId +
      '">' +
      selectedCount +
      " selected (minimum 2)</p>" +
      renderModeControls(key, bundle.mode, bundle.percent, bundle.name) +
      renderTermTable(
        key,
        bundle.terms,
        bundle.mode,
        bundle.percent,
        bundle.preselected,
        bundle.defaultTermId
      ) +
      "</article></section>"
    );
  }

  function renderCategoryClear(offeringId, category, offering) {
    var hasDefault = categoryPackages(offering).some(function (pkg) {
      return pkg.category === category && pkg.preselected;
    });
    if (!hasDefault) return "";
    return (
      '<button type="button" class="ac-clear-default" data-ac-clear-category="' +
      offeringId +
      ":" +
      category +
      '">Clear ' +
      category +
      " default</button>"
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
          "</h4>" +
          renderCategoryClear(offeringId, group.name, offering) +
          "</div>" +
          '<p class="ac-category__help">Choose one package to pre-select under ' +
          group.name +
          " when customers land on the shopping page.</p>" +
          '<div class="ac-category__packages">' +
          group.packages
            .map(function (pkg) {
              return renderPackageCard(offeringId, pkg, offering);
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
        '<p class="ac-category__help">Independent of bundle or category defaults. Pre-select as many as you want; customers can change any selection.</p>' +
        '<div class="ac-category__packages">' +
        standalone
          .map(function (pkg) {
            return renderPackageCard(offeringId, pkg, offering);
          })
          .join("") +
        "</div></section>"
      : "";

    panel.innerHTML =
      (hasBundle(offering) ? renderBundle(offeringId, offering) : "") +
      categoryGroups +
      standaloneSection;
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
    return state[ref.offeringId].bundle || null;
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
    var pctLabel = root.querySelector('[data-ac-percent="' + entityKey + '"]');
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
    root.querySelectorAll("[data-ac-category-default]").forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.checked) return;
        var parts = input.getAttribute("data-ac-category-default").split(":");
        setCategoryDefault(parts[0], parts[1], parts[2]);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-standalone-default]").forEach(function (input) {
      input.addEventListener("change", function () {
        var parts = input.getAttribute("data-ac-standalone-default").split(":");
        setStandalonePreselected(parts[0], parts[1], input.checked);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-bundle-default]").forEach(function (input) {
      input.addEventListener("change", function () {
        var offeringId = input.getAttribute("data-ac-bundle-default");
        setBundlePreselected(offeringId, input.checked);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-clear-bundle]").forEach(function (button) {
      button.addEventListener("click", function () {
        setBundlePreselected(button.getAttribute("data-ac-clear-bundle"), false);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-clear-category]").forEach(function (button) {
      button.addEventListener("click", function () {
        var parts = button.getAttribute("data-ac-clear-category").split(":");
        setCategoryDefault(parts[0], parts[1], null);
        renderAll();
      });
    });

    root.querySelectorAll("[data-ac-default-term]").forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.checked) return;
        var key = input.getAttribute("data-ac-default-term");
        var entityKey = key.split(":").slice(0, 3).join(":");
        var termId = key.split(":")[3];
        setDefaultTerm(entityKey, termId);
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
        var offering = state[offeringId];
        if (!hasBundle(offering)) return;
        var pkgIds = (input.getAttribute("data-ac-bundle-pkgs") || "").split(",");
        var ids = offering.bundle.packageIds;

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
    if (!hasBundle(state.optimum)) return issues;
    var bundle = state.optimum.bundle;
    var count = countSelectedBundleItems("optimum");
    if (count === 1 || (bundle.preselected && count < 2)) {
      issues.push(
        state.optimum.label +
          " bundle needs at least 2 packages" +
          (bundle.preselected ? " when pre-selected for customers" : "") +
          "."
      );
    }
    return issues;
  }

  function validateDefaults() {
    var issues = [];
    ["next", "optimum"].forEach(function (id) {
      var offering = state[id];
      if (hasBundle(offering) && offering.bundle.preselected && !offering.bundle.defaultTermId) {
        issues.push(
          state[id].label + " bundle needs a default term when pre-selected."
        );
      }
      offering.packages.forEach(function (pkg) {
        if (pkg.preselected && !pkg.defaultTermId) {
          issues.push(
            state[id].label +
              " — " +
              pkg.name +
              " needs a default term when pre-selected."
          );
        }
      });
    });
    return issues;
  }

  function syncDirty() {
    if (updateBtn) updateBtn.disabled = !isDirty();
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

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state = clone(baseline);
      renderAll();
    });
  }

  if (updateBtn) {
    updateBtn.addEventListener("click", function () {
      var issues = validateBundles().concat(validateDefaults());
      if (issues.length) {
        showError(issues.join(" "));
        return;
      }
      baseline = clone(state);
      syncDirty();
      showError("Customer defaults updated for this dealership.", true);
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

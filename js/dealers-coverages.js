/**
 * Available Coverages admin — customer pre-selection defaults and pricing.
 *
 * Bundle composition is authored on a separate page, so bundle contents are
 * read-only here. The bundle is priced as a single unit — its MSRP/Dnet is the
 * sum of the packages it includes, and one discount or markup applies to that.
 *
 * Bundle and individual pre-selections coexist: the priority toggle decides
 * which the shopping page shows first, and the other becomes the fallback when
 * a customer's truck is not eligible.
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
          { coverageType: "standalone" }
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
        preselected: false,
        defaultTermId: null,
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

  function hasPreselectedPackage(offering) {
    return offering.packages.some(function (pkg) {
      return pkg.preselected;
    });
  }

  function setCategoryDefault(offeringId, category, pkgId) {
    categoryPackages(state[offeringId]).forEach(function (pkg) {
      if (pkg.category !== category) return;
      pkg.preselected = pkgId ? pkg.id === pkgId : false;
      if (!pkg.preselected) pkg.defaultTermId = null;
    });
  }

  function setBundlePreselected(offeringId, preselected) {
    var offering = state[offeringId];
    if (!hasBundle(offering)) return;
    offering.bundle.preselected = preselected;
    if (!preselected) offering.bundle.defaultTermId = null;
  }

  function setStandalonePreselected(offeringId, pkgId, preselected) {
    var pkg = findPkg(offeringId, pkgId);
    if (!pkg) return;
    pkg.preselected = preselected;
    if (!preselected) pkg.defaultTermId = null;
  }

  function setPriority(offeringId, priority) {
    var offering = state[offeringId];
    if (!hasBundle(offering)) return;
    offering.priority = priority;
  }

  function setDefaultTerm(entityKey, termId) {
    var entity = getEntity(entityKey);
    if (!entity || !entity.preselected) return;
    entity.defaultTermId = termId;
  }

  function renderDefaultTermCell(entityKey, termId, enabled, defaultTermId) {
    return (
      '<td class="ac-term-default">' +
      '<label class="ac-term-default__label">' +
      '<input type="radio" name="default-term-' +
      entityKey +
      '" value="' +
      termId +
      '" data-ac-default-term="' +
      termId +
      '" data-ac-default-entity="' +
      entityKey +
      '"' +
      (enabled ? "" : " disabled") +
      (defaultTermId === termId ? " checked" : "") +
      ' aria-label="Default term" />' +
      '<span class="visually-hidden">Default</span>' +
      "</label>" +
      "</td>"
    );
  }

  /**
   * config: entityKey, terms, mode, percent, showDefault, defaultEnabled,
   * defaultTermId, msrpLabel, dnetLabel
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
          (config.showDefault
            ? renderDefaultTermCell(
                config.entityKey,
                term.id,
                config.defaultEnabled,
                config.defaultTermId
              )
            : "") +
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
      (config.showDefault ? "<th>Default term</th>" : "") +
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

  function renderCategoryDefaultControl(offeringId, pkg) {
    return (
      '<label class="ac-default">' +
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
      " /> Pre-select for " +
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

  function renderPackageCard(offeringId, pkg) {
    var key = "pkg:" + offeringId + ":" + pkg.id;
    var defaultControl =
      pkg.coverageType === "standalone"
        ? renderStandaloneDefaultControl(offeringId, pkg)
        : renderCategoryDefaultControl(offeringId, pkg);

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
      renderTermTable({
        entityKey: key,
        terms: pkg.terms,
        mode: pkg.mode,
        percent: pkg.percent,
        showDefault: true,
        defaultEnabled: pkg.preselected,
        defaultTermId: pkg.defaultTermId,
      }) +
      "</article>"
    );
  }

  function priorityHint(offering) {
    var bundleOn = offering.bundle.preselected;
    var packagesOn = hasPreselectedPackage(offering);
    var bundleFirst = offering.priority === "bundle";

    if (!bundleOn && !packagesOn) {
      return {
        warning: true,
        text:
          "Nothing is pre-selected yet, so customers will land on the shopping page with no coverages selected.",
      };
    }

    if (bundleOn && packagesOn) {
      return {
        warning: false,
        text: bundleFirst
          ? "Customers see the " +
            offering.bundle.name +
            " first. If their truck is not eligible for it, the pre-selected individual packages are shown instead."
          : "Customers see the pre-selected individual packages first. If their truck is not eligible for those, the " +
            offering.bundle.name +
            " is shown instead.",
      };
    }

    if (bundleOn) {
      return {
        warning: true,
        text:
          "Only the " +
          offering.bundle.name +
          " is pre-selected. No individual packages are pre-selected, so there is no fallback if the truck is not eligible for the bundle.",
      };
    }

    return {
      warning: true,
      text:
        "Only individual packages are pre-selected. The " +
        offering.bundle.name +
        " is not pre-selected, so there is no fallback if the truck is not eligible for those packages.",
    };
  }

  function renderPriority(offeringId, offering) {
    var hint = priorityHint(offering);
    var options = [
      {
        value: "bundle",
        label: "Show the bundle first, fall back to individual packages",
      },
      {
        value: "packages",
        label: "Show individual packages first, fall back to the bundle",
      },
    ]
      .map(function (option) {
        return (
          '<label class="ac-default">' +
          '<input type="radio" name="priority-' +
          offeringId +
          '" value="' +
          option.value +
          '" data-ac-priority="' +
          offeringId +
          '"' +
          (offering.priority === option.value ? " checked" : "") +
          " /> " +
          option.label +
          "</label>"
        );
      })
      .join("");

    return (
      '<section class="ac-priority">' +
      '<h4 class="ac-category__title">Pre-selection priority</h4>' +
      '<p class="ac-category__help">Pre-select the bundle and individual packages independently, then choose which the shopping page shows first. The other becomes the fallback when a customer\u2019s truck is not eligible.</p>' +
      '<div class="ac-priority__options">' +
      options +
      "</div>" +
      '<p class="ac-priority__hint' +
      (hint.warning ? " is-warning" : "") +
      '"><i class="fas ' +
      (hint.warning ? "fa-triangle-exclamation" : "fa-circle-info") +
      '" aria-hidden="true"></i> ' +
      hint.text +
      "</p>" +
      "</section>"
    );
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

  function renderBundle(offeringId, offering) {
    var bundle = offering.bundle;
    var key = "bundle:" + offeringId;

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
      '<label class="ac-default">' +
      '<input type="checkbox" data-ac-bundle-default="' +
      offeringId +
      '"' +
      (bundle.preselected ? " checked" : "") +
      " /> Pre-select bundle for customers</label>" +
      (bundle.preselected
        ? '<button type="button" class="ac-clear-default" data-ac-clear-bundle="' +
          offeringId +
          '">Clear bundle default</button>'
        : "") +
      "</div>" +
      "</div>" +
      '<p class="ac-bundle-help">Bundle contents are managed on the bundle composition page and cannot be changed here. MSRP and Dnet below are the combined totals of the included packages \u2014 set one discount or markup for the whole bundle.</p>' +
      renderBundleContents(offering) +
      renderModeControls(key, bundle.mode, bundle.percent, bundle.name) +
      renderTermTable({
        entityKey: key,
        terms: bundle.terms,
        mode: bundle.mode,
        percent: bundle.percent,
        showDefault: true,
        defaultEnabled: bundle.preselected,
        defaultTermId: bundle.defaultTermId,
        msrpLabel: "MSRP total",
        dnetLabel: "Dnet total",
      }) +
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
          ".</p>" +
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
        '<p class="ac-category__help">Pre-select as many as you want. These are added on top of whichever pre-selection the customer sees.</p>' +
        '<div class="ac-category__packages">' +
        standalone
          .map(function (pkg) {
            return renderPackageCard(offeringId, pkg);
          })
          .join("") +
        "</div></section>"
      : "";

    panel.innerHTML =
      (hasBundle(offering) ? renderPriority(offeringId, offering) : "") +
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
    root.querySelectorAll("[data-ac-priority]").forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.checked) return;
        setPriority(input.getAttribute("data-ac-priority"), input.value);
        renderAll();
      });
    });

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
        setBundlePreselected(
          input.getAttribute("data-ac-bundle-default"),
          input.checked
        );
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
        setDefaultTerm(
          input.getAttribute("data-ac-default-entity"),
          input.getAttribute("data-ac-default-term")
        );
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
  }

  function isDirty() {
    return JSON.stringify(state) !== JSON.stringify(baseline);
  }

  function validateDefaults() {
    var issues = [];
    ["next", "optimum"].forEach(function (id) {
      var offering = state[id];

      if (
        hasBundle(offering) &&
        offering.bundle.preselected &&
        !offering.bundle.defaultTermId
      ) {
        issues.push(offering.label + " bundle needs a default term when pre-selected.");
      }

      offering.packages.forEach(function (pkg) {
        if (pkg.preselected && !pkg.defaultTermId) {
          issues.push(
            offering.label +
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

  resetBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state = clone(baseline);
      renderAll();
    });
  });

  updateBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var issues = validateDefaults();
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
  });

  Object.keys(OFFERINGS).forEach(function (id) {
    if (hasBundle(OFFERINGS[id])) {
      OFFERINGS[id].bundle.terms = buildBundleTerms(OFFERINGS[id]);
    }
  });

  state = clone(OFFERINGS);
  baseline = clone(OFFERINGS);
  renderAll();
})();

/**
 * Dealers — Extended Coverages options.
 * Dealer picks packages to show after VIN. No pricing.
 * If none of those packages are eligible for the truck, all packages show.
 * Trucks over 7 years / 750,000 miles are not eligible for any coverage.
 */
(function () {
  var option = document.body.getAttribute("data-dvp");
  var app = document.getElementById("dvp-app");
  if (!option || !app) return;

  var ASSET = "../../../";
  var CAP_COPY =
    "A truck is not eligible for any extended coverages after 7 years or 750,000 miles.";

  var DEFAULT_PACKAGES = [
    familyPkg("opt-eng-basic", "optimum", "Extended OPTIMUM", "Engine Optimum", "Basic", false),
    familyPkg("opt-eng-enhanced", "optimum", "Extended OPTIMUM", "Engine Optimum", "Enhanced", true, ["fallback"]),
    familyPkg("opt-eng-ultimate", "optimum", "Extended OPTIMUM", "Engine Optimum", "Ultimate", false),
    familyPkg("opt-chs-basic", "optimum", "Extended OPTIMUM", "Chassis Optimum", "Basic", false),
    familyPkg("opt-chs-enhanced", "optimum", "Extended OPTIMUM", "Chassis Optimum", "Enhanced", false),
    familyPkg("opt-chs-ultimate", "optimum", "Extended OPTIMUM", "Chassis Optimum", "Ultimate", true, ["fallback"]),
    familyPkg("next-eng-en2", "next", "Extended NEXT", "Engine Next", "En2", false),
    familyPkg("next-eng-en3", "next", "Extended NEXT", "Engine Next", "En3", false),
    familyPkg("next-eng-en4", "next", "Extended NEXT", "Engine Next", "En4", true, ["fallback"]),
    familyPkg("next-chs-entc2", "next", "Extended NEXT", "Chassis Next", "ENTC2", true, ["fallback"]),
    familyPkg("next-chs-entc3", "next", "Extended NEXT", "Chassis Next", "ENTC3", false),
    familyPkg("next-chs-entc4", "next", "Extended NEXT", "Chassis Next", "ENTC4", false),
  ];

  var SCENARIOS = {
    ok: {
      id: "ok",
      label: "Eligible for dealer’s selection",
      vin: "1FUJGLDR8CLBP1234",
      truck: "2024 Freightliner Cascadia · 2 years · 82,000 mi",
    },
    fallback: {
      id: "fallback",
      label: "Not eligible for dealer’s selection",
      vin: "1FUJGBDV69LBP5678",
      truck: "2019 Freightliner Cascadia · 6 years · 410,000 mi",
    },
    cap: {
      id: "cap",
      label: "Over 7 years / 750,000 miles",
      vin: "1FUJGLDR5HLBP9012",
      truck: "2016 Freightliner Cascadia · 9 years · 810,000 mi",
      overCap: true,
    },
  };

  var DEFAULT_BUNDLE = {
    id: "opt-bundle",
    name: "OPTIMUM Bundle",
    shown: false,
    memberIds: ["opt-eng-ultimate", "opt-chs-basic"],
  };

  var state = {
    packages: clone(DEFAULT_PACKAGES),
    bundle: clone(DEFAULT_BUNDLE),
    offering: "next",
    filter: "all",
    selected: {},
    scenario: "ok",
    vinLookedUp: option === "live-preview",
    vinValue: SCENARIOS.ok.vin,
    vinError: "",
  };

  function familyPkg(id, offering, offeringLabel, family, term, shown, ineligibleOn) {
    return {
      id: id,
      offering: offering,
      offeringLabel: offeringLabel,
      family: family,
      term: term,
      name: family + " " + term,
      shown: !!shown,
      ineligibleOn: ineligibleOn || [],
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pkgById(id) {
    return state.packages.filter(function (pkg) {
      return pkg.id === id;
    })[0];
  }

  function packagesForOffering(offeringId) {
    return state.packages.filter(function (pkg) {
      return pkg.offering === offeringId;
    });
  }

  function familiesFor(list) {
    var order = [];
    var map = {};
    list.forEach(function (pkg) {
      if (!map[pkg.family]) {
        map[pkg.family] = [];
        order.push(pkg.family);
      }
      map[pkg.family].push(pkg);
    });
    return order.map(function (family) {
      return { family: family, packages: map[family] };
    });
  }

  function shownPackages() {
    return state.packages.filter(function (pkg) {
      return pkg.shown;
    });
  }

  function scenario() {
    return SCENARIOS[state.scenario] || SCENARIOS.ok;
  }

  function listing() {
    var scene = scenario();
    if (scene.overCap) {
      return { mode: "cap", items: [], scene: scene };
    }
    var curated = shownPackages().filter(function (pkg) {
      return pkg.ineligibleOn.indexOf(scene.id) === -1;
    });
    if (curated.length) {
      return { mode: "curated", items: curated, scene: scene };
    }
    return { mode: "fallback", items: state.packages.slice(), scene: scene };
  }

  function setShown(id, shown) {
    var pkg = pkgById(id);
    if (pkg) pkg.shown = shown;
  }

  function toast(message) {
    var el = app.querySelector("[data-dvp-toast]");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () {
      el.hidden = true;
    }, 2800);
  }

  function capBanner() {
    return (
      '<p class="dvp-cap">' +
      '<i class="fas fa-info-circle" aria-hidden="true"></i> ' +
      escapeHtml(CAP_COPY) +
      "</p>"
    );
  }

  function switchControl(id, checked, label, compact) {
    return (
      '<span class="dvp-vis">' +
      '<span class="' +
      (compact ? "visually-hidden" : "dvp-vis__label") +
      '" id="dvp-vis-' +
      escapeHtml(id) +
      '">' +
      escapeHtml(label) +
      "</span>" +
      '<button type="button" class="dl-switch__control" role="switch" aria-checked="' +
      (checked ? "true" : "false") +
      '" aria-labelledby="dvp-vis-' +
      escapeHtml(id) +
      '" data-dvp-show="' +
      escapeHtml(id) +
      '"><span class="dl-switch__thumb" aria-hidden="true"></span></button>' +
      "</span>"
    );
  }

  function dealerHeader() {
    return (
      '<header class="product-header">' +
      '<div class="ph-logged-in-top auth-logged-in">' +
      '<div class="ph-brand-col">' +
      '<a class="ex-header__logo" href="' +
      ASSET +
      'global-homepage.html" aria-label="Excelerator home">' +
      '<img src="' +
      ASSET +
      'assets/images/excelerator-logo.png" alt="Excelerator" />' +
      "</a>" +
      '<button type="button" class="ph-shop-vehicle">' +
      '<i class="fas fa-truck" aria-hidden="true"></i> Shop by Vehicle ' +
      '<i class="fas fa-plus" aria-hidden="true"></i></button>' +
      "</div>" +
      '<form class="ph-search" role="search" action="#" onsubmit="return false;">' +
      '<button type="button" class="ph-search__filter" aria-label="Search filters">' +
      '<i class="fas fa-caret-down" aria-hidden="true"></i></button>' +
      '<input class="ph-search__input" type="search" placeholder="Search by part name, number, VMRS, or cross reference" aria-label="Search" />' +
      '<button type="submit" class="ph-search__submit" aria-label="Search">' +
      '<i class="fas fa-search" aria-hidden="true"></i></button>' +
      "</form>" +
      '<div class="ph-user-col"><div class="ph-user-row">' +
      '<div class="ex-account-menu">' +
      '<button type="button" class="ph-user-btn ex-account-menu__toggle" aria-expanded="false" aria-haspopup="true" aria-controls="dvp-account">' +
      '<i class="fas fa-user" aria-hidden="true"></i><span>Max</span>' +
      '<i class="fas fa-chevron-down" aria-hidden="true"></i></button>' +
      '<ul id="dvp-account" class="ex-account-menu__dropdown" role="menu" hidden>' +
      '<li role="none"><button type="button" role="menuitem">Account settings</button></li>' +
      "</ul></div>" +
      '<button type="button" class="ph-user-btn" aria-label="Region and language">' +
      '<img class="ex-header__flag ex-header__flag--site" src="' +
      ASSET +
      'assets/images/site-selector-icon-dtna.png" alt="United States / Canada" />' +
      '<i class="fas fa-chevron-down" aria-hidden="true"></i></button>' +
      "</div></div></div>" +
      '<nav class="ph-nav" aria-label="Primary">' +
      '<div class="ph-nav__lob-wrap ex-account-menu">' +
      '<button type="button" class="ph-nav__lob ex-account-menu__toggle" aria-expanded="false" aria-haspopup="true" aria-controls="dvp-lob">' +
      '<i class="fas fa-cogs" aria-hidden="true"></i><span>Parts &amp; PartsProX</span>' +
      '<i class="fas fa-chevron-down" aria-hidden="true"></i></button>' +
      '<ul id="dvp-lob" class="ph-lob-dropdown ex-account-menu__dropdown" role="menu" hidden>' +
      '<li role="none"><a role="menuitem" href="' +
      ASSET +
      'coverage.html">Extended Coverage</a></li>' +
      "</ul></div>" +
      '<div class="ph-nav__divider" aria-hidden="true"></div>' +
      '<ul class="ph-nav__links auth-logged-in">' +
      "<li><a href=\"#\">Dashboard</a></li>" +
      "<li><a href=\"#\">Customers</a></li>" +
      '<li><a class="is-active" href="#" aria-current="page">Dealers</a></li>' +
      "<li><a href=\"#\">Orders/Quotes</a></li>" +
      "</ul></nav>" +
      '<div class="ph-subnav"><a href="#">Inner Circle Rewards<sup>TM</sup></a></div>' +
      "</header>"
    );
  }

  function customerHeader() {
    return (
      '<header class="product-header">' +
      '<div class="ph-logged-in-top auth-logged-in">' +
      '<div class="ph-brand-col">' +
      '<a class="ex-header__logo" href="' +
      ASSET +
      'global-homepage.html" aria-label="Excelerator home">' +
      '<img src="' +
      ASSET +
      'assets/images/excelerator-logo.png" alt="Excelerator" />' +
      "</a>" +
      '<button type="button" class="ph-shop-vehicle">' +
      '<i class="fas fa-truck" aria-hidden="true"></i> Shop by Vehicle ' +
      '<i class="fas fa-plus" aria-hidden="true"></i></button>' +
      "</div>" +
      '<form class="ph-search" role="search" action="#" onsubmit="return false;">' +
      '<button type="button" class="ph-search__filter" aria-label="Search filters">' +
      '<i class="fas fa-caret-down" aria-hidden="true"></i></button>' +
      '<input class="ph-search__input" type="search" placeholder="Search by part name, number, VMRS, or cross reference" aria-label="Search" />' +
      '<button type="submit" class="ph-search__submit" aria-label="Search">' +
      '<i class="fas fa-search" aria-hidden="true"></i></button>' +
      "</form>" +
      '<div class="ph-user-col"><div class="ph-user-row">' +
      '<div class="ex-account-menu">' +
      '<button type="button" class="ph-user-btn ex-account-menu__toggle" aria-expanded="false" aria-haspopup="true" aria-controls="dvp-cust-account">' +
      '<i class="fas fa-user" aria-hidden="true"></i><span>ADXCustomer3</span>' +
      '<i class="fas fa-chevron-down" aria-hidden="true"></i></button>' +
      '<ul id="dvp-cust-account" class="ex-account-menu__dropdown" role="menu" hidden>' +
      '<li role="none"><button type="button" role="menuitem">Account settings</button></li>' +
      "</ul></div></div>" +
      '<div class="ph-dealer"><i class="fas fa-map-marker-alt" aria-hidden="true"></i>' +
      "<div><div class=\"ph-dealer__name\">Houston Freightliner</div>" +
      "<div class=\"ph-dealer__meta\">FBCFD | $USD</div></div></div>" +
      "</div></div>" +
      '<nav class="ph-nav" aria-label="Primary">' +
      '<div class="ph-nav__lob-wrap">' +
      '<button type="button" class="ph-nav__lob">' +
      '<i class="fas fa-shield-alt" aria-hidden="true"></i>' +
      "<span>Extended Coverages</span></button></div>" +
      '<div class="ph-nav__divider" aria-hidden="true"></div>' +
      '<ul class="ph-nav__links auth-logged-in">' +
      '<li><a class="is-active" href="#" aria-current="page">Shop Coverage</a></li>' +
      "<li><a href=\"#\">Orders</a></li>" +
      "</ul></nav>" +
      '<div class="ph-subnav"><span class="ph-subnav__title">Extended Coverages</span>' +
      '<span class="ph-subnav__divider" aria-hidden="true"></span>' +
      "<a href=\"#enter-vin\">Enter VIN</a></div>" +
      "</header>"
    );
  }

  function locationsSidebar() {
    return (
      '<aside class="dl-sidebar" aria-label="My Locations">' +
      '<div class="dl-sidebar__head"><h2 class="dl-sidebar__title">My Locations</h2></div>' +
      '<ul class="dl-locations">' +
      '<li><button type="button" class="dl-location" data-name="Houston Freightliner - North"><p class="dl-location__name">Houston Freightliner - North</p><p class="dl-location__meta">Dealer Code: FBCFN</p></button></li>' +
      '<li><button type="button" class="dl-location is-active" data-name="Houston Freightliner Head Dealer" aria-current="true"><p class="dl-location__name">Houston Freightliner Head Dealer</p><p class="dl-location__meta">Dealer Code: FBCFD</p></button></li>' +
      '<li><button type="button" class="dl-location" data-name="Austin Freightliner"><p class="dl-location__name">Austin Freightliner</p><p class="dl-location__meta">Dealer Code: FAUFD</p></button></li>' +
      "</ul></aside>"
    );
  }

  function mount() {
    var toastEl = '<div class="dvp-toast" data-dvp-toast hidden></div>';

    app.innerHTML =
      dealerHeader() +
      '<div class="dl-shell">' +
      locationsSidebar() +
      '<main class="dl-main">' +
      '<div class="dl-main__top"><div>' +
      '<h1 class="dl-dealer-title">Houston Freightliner Head Dealer</h1>' +
      '<p class="dl-dealer-code">Dealer Code: FBCFD</p></div></div>' +
      '<div class="dl-content-card">' +
      '<div class="dl-tabs" role="tablist" aria-label="Dealer settings">' +
      '<button type="button" role="tab" aria-selected="false">Dealer</button>' +
      '<button type="button" role="tab" class="is-active" aria-selected="true">Extended Coverages</button>' +
      '<button type="button" role="tab" aria-selected="false">Connectivity Services</button>' +
      "</div>" +
      '<section class="dl-panel is-active" role="tabpanel">' +
      '<div data-dvp-main></div>' +
      "</section></div></main></div>" +
      toastEl;
  }

  function adminHeader(title, intro) {
    return (
      '<div class="ac-header"><div class="ac-header__copy">' +
      '<h3 class="ac-title">' +
      escapeHtml(title) +
      "</h3>" +
      '<p class="ac-intro">' +
      escapeHtml(intro) +
      "</p></div>" +
      '<div class="dl-actions dl-actions--top">' +
      '<button type="button" class="dl-btn-secondary" data-dvp-reset>Reset</button>' +
      '<button type="button" class="dl-btn-primary" data-dvp-update>Update</button>' +
      "</div></div>" +
      capBanner()
    );
  }

  function listingBanner(result) {
    if (result.mode === "cap") {
      return (
        '<div class="dvp-results-banner dvp-results-banner--cap">' +
        "<p><strong>No coverages available.</strong> " +
        escapeHtml(CAP_COPY) +
        "</p></div>"
      );
    }
    if (result.mode === "fallback") {
      return (
        '<div class="dvp-results-banner dvp-results-banner--fallback">' +
        "<p>This truck is not eligible for the packages Houston Freightliner selected to show, so <strong>all packages</strong> are listed.</p></div>"
      );
    }
    return (
      '<div class="dvp-results-banner">' +
      "<p>Houston Freightliner selected these coverages for your truck.</p></div>"
    );
  }

  function compareCards(result, termAsSelect) {
    if (result.mode === "cap") {
      return (
        '<div class="dvp-empty dvp-empty--cap">' +
        '<p class="dvp-empty__title">Not eligible for extended coverages</p>' +
        "<p>" +
        escapeHtml(CAP_COPY) +
        "</p></div>"
      );
    }
    if (!result.items.length) {
      return (
        '<div class="dvp-empty"><p>No packages to show for this VIN.</p></div>'
      );
    }

    var grouped = familiesFor(result.items);
    return (
      '<div class="dvp-compare">' +
      grouped
        .map(function (group) {
          var first = group.packages[0];
          var terms = group.packages;
          var selected = terms[0];
          var termControl;
          if (termAsSelect && terms.length > 1) {
            termControl =
              '<label class="dvp-term-select">Term' +
              "<select>" +
              terms
                .map(function (pkg) {
                  return (
                    "<option" +
                    (pkg.id === selected.id ? " selected" : "") +
                    ">" +
                    escapeHtml(pkg.term) +
                    "</option>"
                  );
                })
                .join("") +
              "</select></label>";
          } else {
            termControl =
              '<ul class="dvp-term-list">' +
              terms
                .map(function (pkg) {
                  return "<li>" + escapeHtml(pkg.term) + "</li>";
                })
                .join("") +
              "</ul>";
          }
          return (
            '<article class="dvp-plan">' +
            '<p class="dvp-plan__cat">' +
            escapeHtml(first.offeringLabel) +
            "</p>" +
            '<h4 class="dvp-plan__name">' +
            escapeHtml(group.family) +
            "</h4>" +
            termControl +
            '<button type="button" class="dl-btn-primary dvp-plan__cta">Select</button>' +
            "</article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function vehicleBlock(result) {
    return (
      '<div class="dvp-preview-vehicle">' +
      '<p class="dvp-vin-id">' +
      escapeHtml(result.scene.vin) +
      "</p>" +
      "<p>" +
      escapeHtml(result.scene.truck) +
      " · Houston Freightliner</p></div>"
    );
  }

  function scenarioPicker() {
    return (
      '<div class="dvp-scenarios" role="radiogroup" aria-label="Sample truck">' +
      Object.keys(SCENARIOS)
        .map(function (id) {
          var scene = SCENARIOS[id];
          return (
            '<label class="dvp-scenario' +
            (state.scenario === id ? " is-active" : "") +
            '">' +
            '<input type="radio" name="dvp-scenario" data-dvp-scenario="' +
            id +
            '"' +
            (state.scenario === id ? " checked" : "") +
            " />" +
            "<span><strong>" +
            escapeHtml(scene.label) +
            "</strong><small>" +
            escapeHtml(scene.truck) +
            "</small></span></label>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderBundleCard() {
    var members = state.bundle.memberIds
      .map(pkgById)
      .filter(Boolean)
      .map(function (pkg) {
        return "<li>" + escapeHtml(pkg.family) + " " + escapeHtml(pkg.term) + "</li>";
      })
      .join("");

    return (
      '<article class="dvp-family dvp-family--bundle">' +
      '<h5 class="dvp-family__title">OPTIMUM Bundle</h5>' +
      '<p class="dvp-family__help">Check this to offer Engine Ultimate and Chassis Basic together as one package.</p>' +
      '<div class="dvp-bundle-box' +
      (state.bundle.shown ? " is-on" : "") +
      '">' +
      '<label class="dvp-pill">' +
      '<input type="checkbox" data-dvp-bundle' +
      (state.bundle.shown ? " checked" : "") +
      " />" +
      "Show OPTIMUM Bundle</label>" +
      '<div class="dvp-bundle-includes">' +
      '<p class="dvp-bundle-list-label">Includes</p>' +
      '<ul class="dvp-bundle-list">' +
      members +
      "</ul></div></div></article>"
    );
  }

  function renderToggleCards() {
    var rows = packagesForOffering(state.offering);
    var cards = familiesFor(rows)
      .map(function (group) {
        var pills = group.packages
          .map(function (pkg) {
            return (
              '<label class="dvp-pill' +
              (pkg.shown ? " is-on" : "") +
              '">' +
              '<input type="checkbox" data-dvp-check="' +
              escapeHtml(pkg.id) +
              '"' +
              (pkg.shown ? " checked" : "") +
              " />" +
              escapeHtml(pkg.term) +
              "</label>"
            );
          })
          .join("");
        return (
          '<article class="dvp-family">' +
          '<h5 class="dvp-family__title">' +
          escapeHtml(group.family) +
          "</h5>" +
          '<p class="dvp-family__help">Select which packages to show after a customer enters a VIN.</p>' +
          '<div class="dvp-pills">' +
          pills +
          "</div></article>"
        );
      })
      .join("");

    return (
      '<div class="ac">' +
      adminHeader(
        "Available Coverages",
        "Choose which packages this location shows after a customer enters a VIN."
      ) +
      '<div class="dvp-select-panel">' +
      '<div class="ac-offering-tabs" role="tablist" aria-label="Offering type">' +
      '<button type="button" class="' +
      (state.offering === "next" ? "is-active" : "") +
      '" role="tab" data-dvp-offering="next">Extended NEXT</button>' +
      '<button type="button" class="' +
      (state.offering === "optimum" ? "is-active" : "") +
      '" role="tab" data-dvp-offering="optimum">Extended OPTIMUM</button>' +
      "</div>" +
      '<div class="dvp-family-grid">' +
      (state.offering === "optimum" ? renderBundleCard() : "") +
      cards +
      "</div></div></div>"
    );
  }

  function visibleTableRows() {
    return state.packages.filter(function (pkg) {
      if (state.filter === "shown") return pkg.shown;
      if (state.filter === "hidden") return !pkg.shown;
      return true;
    });
  }

  function renderCatalogTable() {
    var rows = visibleTableRows();
    var selectedCount = rows.filter(function (pkg) {
      return state.selected[pkg.id];
    }).length;
    var allChecked = rows.length && selectedCount === rows.length;

    var body = rows
      .map(function (pkg) {
        return (
          '<tr class="' +
          (pkg.shown ? "" : "is-hidden-from-customer") +
          '">' +
          '<td><input type="checkbox" data-dvp-select="' +
          escapeHtml(pkg.id) +
          '"' +
          (state.selected[pkg.id] ? " checked" : "") +
          ' aria-label="Select ' +
          escapeHtml(pkg.name) +
          '" /></td>' +
          "<td>" +
          escapeHtml(pkg.offeringLabel) +
          "</td>" +
          "<td>" +
          escapeHtml(pkg.family) +
          "</td>" +
          "<td><strong>" +
          escapeHtml(pkg.term) +
          "</strong></td>" +
          "<td>" +
          (pkg.shown
            ? '<span class="dvp-badge dvp-badge--public">Show</span>'
            : '<span class="dvp-badge dvp-badge--hidden">Hide</span>') +
          "</td>" +
          "<td>" +
          switchControl(pkg.id, pkg.shown, "Show " + pkg.term, true) +
          "</td></tr>"
        );
      })
      .join("");

    return (
      '<div class="ac">' +
      adminHeader(
        "Coverage catalog",
        "One row per term. No nested year/mile or discount columns — only what this location shows after VIN."
      ) +
      '<div class="dvp-toolbar">' +
      '<div class="dvp-filters" role="tablist" aria-label="Visibility filter">' +
      '<button type="button" class="' +
      (state.filter === "all" ? "is-active" : "") +
      '" data-dvp-filter="all">All</button>' +
      '<button type="button" class="' +
      (state.filter === "shown" ? "is-active" : "") +
      '" data-dvp-filter="shown">Shown</button>' +
      '<button type="button" class="' +
      (state.filter === "hidden" ? "is-active" : "") +
      '" data-dvp-filter="hidden">Hidden</button>' +
      "</div>" +
      '<div class="dvp-bulk">' +
      '<button type="button" class="dl-btn-secondary" data-dvp-bulk="show"' +
      (selectedCount ? "" : " disabled") +
      ">Show selected</button>" +
      '<button type="button" class="dl-btn-secondary" data-dvp-bulk="hide"' +
      (selectedCount ? "" : " disabled") +
      ">Hide selected</button>" +
      "</div></div>" +
      '<div class="dvp-table-wrap"><table class="dvp-table">' +
      "<thead><tr>" +
      '<th><input type="checkbox" data-dvp-select-all' +
      (allChecked ? " checked" : "") +
      ' aria-label="Select all visible terms" /></th>' +
      "<th>Offering</th><th>Family</th><th>Term</th><th>Status</th><th>Show</th>" +
      "</tr></thead><tbody>" +
      (body || '<tr><td colspan="6">No packages in this filter.</td></tr>') +
      "</tbody></table></div></div>"
    );
  }

  function checklistGroup(title, list) {
    return (
      '<div class="dvp-check-group"><h4>' +
      escapeHtml(title) +
      "</h4>" +
      list
        .map(function (pkg) {
          return (
            '<div class="dvp-check"><span>' +
            escapeHtml(pkg.term) +
            "</span>" +
            switchControl(pkg.id, pkg.shown, "Show " + pkg.name, true) +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderLivePreview() {
    var result = listing();
    var next = packagesForOffering("next");
    var optimum = packagesForOffering("optimum");
    return (
      adminHeader(
        "Customer catalog preview",
        "Toggle packages on the left. Switch the sample truck to see dealer selection, the all-packages fallback, or the 7-year / 750,000-mile cap."
      ) +
      '<div class="dvp-split">' +
      '<div class="dvp-split__dealer">' +
      "<h3>Offer at this location</h3>" +
      '<p class="dvp-split__help">On = try to show after VIN. If none of the on packages are eligible, the customer sees every package.</p>' +
      familiesFor(optimum)
        .map(function (group) {
          return checklistGroup(group.family, group.packages);
        })
        .join("") +
      familiesFor(next)
        .map(function (group) {
          return checklistGroup(group.family, group.packages);
        })
        .join("") +
      "</div>" +
      '<div class="dvp-split__customer">' +
      "<h3>Customer view after VIN</h3>" +
      scenarioPicker() +
      vehicleBlock(result) +
      listingBanner(result) +
      compareCards(result, false) +
      "</div></div>"
    );
  }

  function renderVinResults() {
    var result = listing();
    var results = "";
    if (state.vinLookedUp) {
      results = listingBanner(result) + compareCards(result, true);
    } else {
      results =
        '<div class="dvp-empty"><p>Enter a VIN to see coverages this dealer offers for your truck.</p></div>';
    }

    var dealerChecks = familiesFor(state.packages)
      .map(function (group) {
        return checklistGroup(group.family, group.packages);
      })
      .join("");

    return (
      '<div class="dvp-customer-grid">' +
      '<aside class="dvp-dealer-panel">' +
      "<h3>Dealer catalog</h3>" +
      '<p class="dvp-split__help">Houston Freightliner Head Dealer · FBCFD</p>' +
      dealerChecks +
      '<button type="button" class="dl-btn-secondary" data-dvp-reset>Reset catalog</button>' +
      "</aside>" +
      "<div>" +
      '<div class="dvp-hero-copy" id="enter-vin">' +
      "<h1>See coverages for your VIN</h1>" +
      "<p>" +
      escapeHtml(CAP_COPY) +
      "</p></div>" +
      '<form class="dvp-vin-form" data-dvp-vin-form>' +
      '<label>VIN<input type="text" name="vin" maxlength="17" spellcheck="false" value="' +
      escapeHtml(state.vinValue) +
      '" /></label>' +
      '<button type="submit" class="dl-btn-primary">See coverages</button>' +
      "</form>" +
      '<p class="dvp-vin-hints">Sample VINs: ' +
      '<button type="button" class="dvp-vin-hint" data-dvp-hint="ok">' +
      SCENARIOS.ok.vin +
      " (eligible)</button> · " +
      '<button type="button" class="dvp-vin-hint" data-dvp-hint="fallback">' +
      SCENARIOS.fallback.vin +
      " (show all)</button> · " +
      '<button type="button" class="dvp-vin-hint" data-dvp-hint="cap">' +
      SCENARIOS.cap.vin +
      " (over cap)</button></p>" +
      (state.vinError
        ? '<p class="ac-form-error">' + escapeHtml(state.vinError) + "</p>"
        : "") +
      (state.vinLookedUp ? vehicleBlock(result) : "") +
      results +
      "</div></div>"
    );
  }

  function render() {
    var main = app.querySelector("[data-dvp-main]");
    if (!main) return;
    if (option === "toggle-cards") main.innerHTML = renderToggleCards();
    else if (option === "catalog-table") main.innerHTML = renderCatalogTable();
    else if (option === "live-preview") main.innerHTML = renderLivePreview();
    else main.innerHTML = renderVinResults();
  }

  function applyScenario(id) {
    if (!SCENARIOS[id]) return;
    state.scenario = id;
    state.vinValue = SCENARIOS[id].vin;
    state.vinError = "";
    state.vinLookedUp = true;
  }

  function matchVinToScenario(value) {
    var found = Object.keys(SCENARIOS).filter(function (id) {
      return SCENARIOS[id].vin === value;
    })[0];
    state.scenario = found || "ok";
  }

  app.addEventListener("click", function (event) {
    var showBtn = event.target.closest("[data-dvp-show]");
    if (showBtn) {
      event.preventDefault();
      var showId = showBtn.getAttribute("data-dvp-show");
      var current = pkgById(showId);
      if (current) setShown(showId, !current.shown);
      render();
      return;
    }

    var hint = event.target.closest("[data-dvp-hint]");
    if (hint) {
      event.preventDefault();
      applyScenario(hint.getAttribute("data-dvp-hint"));
      render();
      return;
    }

    var offeringBtn = event.target.closest("[data-dvp-offering]");
    if (offeringBtn) {
      state.offering = offeringBtn.getAttribute("data-dvp-offering");
      render();
      return;
    }

    var filterBtn = event.target.closest("[data-dvp-filter]");
    if (filterBtn) {
      state.filter = filterBtn.getAttribute("data-dvp-filter");
      render();
      return;
    }

    var bulkBtn = event.target.closest("[data-dvp-bulk]");
    if (bulkBtn && !bulkBtn.disabled) {
      event.preventDefault();
      var makeShown = bulkBtn.getAttribute("data-dvp-bulk") === "show";
      visibleTableRows().forEach(function (pkg) {
        if (state.selected[pkg.id]) setShown(pkg.id, makeShown);
      });
      state.selected = {};
      render();
      toast(makeShown ? "Selected terms will show after VIN." : "Selected terms are hidden.");
      return;
    }

    var resetBtn = event.target.closest("[data-dvp-reset]");
    if (resetBtn) {
      state.packages = clone(DEFAULT_PACKAGES);
      state.bundle = clone(DEFAULT_BUNDLE);
      state.selected = {};
      state.filter = "all";
      state.offering = "next";
      state.scenario = "ok";
      state.vinValue = SCENARIOS.ok.vin;
      render();
      toast("Catalog reset to the sample dealer offer.");
      return;
    }

    var updateBtn = event.target.closest("[data-dvp-update]");
    if (updateBtn) {
      toast("Catalog saved.");
      return;
    }

    var locBtn = event.target.closest(".dl-location");
    if (locBtn) {
      app.querySelectorAll(".dl-location").forEach(function (btn) {
        btn.classList.remove("is-active");
        btn.removeAttribute("aria-current");
      });
      locBtn.classList.add("is-active");
      locBtn.setAttribute("aria-current", "true");
      var title = app.querySelector(".dl-dealer-title");
      if (title) title.textContent = locBtn.getAttribute("data-name") || "";
    }
  });

  app.addEventListener("change", function (event) {
    var check = event.target.closest("[data-dvp-check]");
    if (check) {
      setShown(check.getAttribute("data-dvp-check"), check.checked);
      render();
      return;
    }

    if (event.target.hasAttribute("data-dvp-bundle")) {
      state.bundle.shown = event.target.checked;
      render();
      return;
    }

    var scene = event.target.closest("[data-dvp-scenario]");
    if (scene) {
      applyScenario(scene.getAttribute("data-dvp-scenario"));
      render();
      return;
    }

    if (event.target.hasAttribute("data-dvp-select-all")) {
      var on = event.target.checked;
      visibleTableRows().forEach(function (pkg) {
        state.selected[pkg.id] = on;
      });
      render();
      return;
    }

    var select = event.target.closest("[data-dvp-select]");
    if (select) {
      state.selected[select.getAttribute("data-dvp-select")] = select.checked;
      render();
    }
  });

  app.addEventListener("submit", function (event) {
    var form = event.target.closest("[data-dvp-vin-form]");
    if (!form) return;
    event.preventDefault();
    var input = form.querySelector('input[name="vin"]');
    var value = (input && input.value ? input.value : "").replace(/\s/g, "").toUpperCase();
    state.vinValue = value;
    if (value.length !== 17) {
      state.vinError = "Enter a 17-character VIN to see dealer coverages.";
      state.vinLookedUp = false;
    } else {
      state.vinError = "";
      state.vinLookedUp = true;
      matchVinToScenario(value);
    }
    render();
  });

  app.addEventListener("input", function (event) {
    if (event.target && event.target.name === "vin") {
      state.vinValue = event.target.value;
    }
  });

  mount();
  render();
})();

/**
 * System notification placement prototype
 * sessionStorage keys:
 *   ex-notice-placement: '1a'|'1b'|'1c'|'1d'|'1e'|'1f'
 *   ex-notice-dismissed: '1' when user dismisses non-modal notices this session
 *   ex-notice-modal-seen: '1' after Option 5 modal acknowledged this session
 */
(function () {
  var STORAGE_KEY = "ex-notice-placement";
  var DISMISS_KEY = "ex-notice-dismissed";
  var MODAL_KEY = "ex-notice-modal-seen";

  var NOTICES = [
    {
      id: "sys-1",
      title: "System status update",
      short:
        "We're experiencing intermittent system issues that may delay order processing and some account features.",
      detail:
        "We're experiencing intermittent system issues that may delay order processing, quotes, and some account features. Our teams are working to restore full service as quickly as possible.",
      linkLabel: "Learn more",
      updated: "Updated just now",
    },
    {
      id: "sys-2",
      title: "Order activity",
      short: "Order status and confirmation updates may be delayed until systems are fully restored.",
      detail:
        "Order status and confirmation updates may be delayed until systems are fully restored. You can continue browsing; submitted orders will process once connectivity is stable.",
      linkLabel: "View details",
      updated: "Updated 1h ago",
    },
  ];

  function getPlacement() {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setPlacement(id) {
    try {
      sessionStorage.setItem(STORAGE_KEY, id);
      // Fresh preview whenever an option is clicked (including re-select)
      sessionStorage.removeItem(DISMISS_KEY);
      sessionStorage.removeItem(MODAL_KEY);
    } catch (e) {}
  }

  function isDismissed() {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setDismissed() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch (e) {}
  }

  function modalSeen() {
    try {
      return sessionStorage.getItem(MODAL_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setModalSeen() {
    try {
      sessionStorage.setItem(MODAL_KEY, "1");
    } catch (e) {}
  }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function noticeRow(notice, opts) {
    opts = opts || {};
    return (
      '<div class="ex-notice" data-notice-id="' +
      notice.id +
      '">' +
      '<span class="ex-notice__icon" aria-hidden="true"><i class="fas fa-exclamation-circle"></i></span>' +
      '<div class="ex-notice__body">' +
      (opts.showTitle ? '<p class="ex-notice__title">' + notice.title + "</p>" : "") +
      '<p class="ex-notice__text">' +
      (opts.useDetail ? notice.detail : notice.short) +
      (opts.showLink
        ? ' <a href="#" class="ex-notice__link">' + notice.linkLabel + "</a>"
        : "") +
      "</p>" +
      "</div>" +
      (opts.dismissible !== false
        ? '<button type="button" class="ex-notice__dismiss" aria-label="Dismiss" data-notice-dismiss>&times;</button>'
        : "") +
      "</div>"
    );
  }

  function bindDismiss(root) {
    root.querySelectorAll("[data-notice-dismiss]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setDismissed();
        document.querySelectorAll("[data-ex-notice-root]").forEach(function (n) {
          n.remove();
        });
        var bell = document.querySelector("[data-ex-notice-bell]");
        if (bell) bell.remove();
      });
    });
  }

  function findHeader() {
    return (
      document.querySelector(".product-header") ||
      document.querySelector(".ex-header") ||
      document.querySelector("header")
    );
  }

  function findUtilityRows() {
    var rows = [];
    var global = document.querySelector(".ex-header__utility");
    if (global) rows.push(global);
    document.querySelectorAll(".ph-user-row, .ph-logged-out-actions").forEach(function (row) {
      rows.push(row);
    });
    return rows;
  }

  function applyTopStrip() {
    var header = findHeader();
    if (!header) return;
    var root = el(
      '<div data-ex-notice-root class="ex-notice-slot--top">' +
        noticeRow(NOTICES[0], { showLink: true, useDetail: false }) +
        "</div>"
    );
    root.querySelector(".ex-notice").classList.add("ex-notice--top-strip");
    header.parentNode.insertBefore(root, header);
    bindDismiss(root);
  }

  function applyBelowNav() {
    var header = findHeader();
    if (!header) return;
    var root = el(
      '<div data-ex-notice-root class="ex-notice-slot--below-nav ex-notice-stack">' +
        noticeRow(NOTICES[0], { showLink: true }) +
        noticeRow(NOTICES[1], { showLink: true }) +
        "</div>"
    );
    if (header.nextSibling) {
      header.parentNode.insertBefore(root, header.nextSibling);
    } else {
      header.parentNode.appendChild(root);
    }
    bindDismiss(root);
  }

  function applyToast() {
    var root = el(
      '<aside data-ex-notice-root class="ex-notice-toast" role="status" aria-live="polite">' +
        '<div class="ex-notice-toast__header">' +
        '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>' +
        "<span>System status</span>" +
        '<span class="ex-notice-toast__badge">' +
        NOTICES.length +
        "</span>" +
        '<button type="button" class="ex-notice__dismiss" aria-label="Dismiss" data-notice-dismiss style="margin-left:0.35rem">&times;</button>' +
        "</div>" +
        '<div class="ex-notice-toast__body">' +
        NOTICES[0].short +
        ' <a href="#" class="ex-notice__link">View details</a>' +
        "</div>" +
        "</aside>"
    );
    document.body.appendChild(root);
    bindDismiss(root);
  }

  function buildBellMarkup() {
    return (
      '<div class="ex-notice-bell-wrap" data-ex-notice-bell>' +
      '<button type="button" class="ex-notice-bell" aria-expanded="false" aria-haspopup="true" aria-label="System alerts">' +
      '<span class="ex-notice-bell__label">Alert</span>' +
      '<span class="ex-notice-bell__badge">' +
      NOTICES.length +
      "</span>" +
      "</button>" +
      '<div class="ex-notice-panel" hidden>' +
      '<p class="ex-notice-panel__title">System notices</p>' +
      NOTICES.map(function (n) {
        return (
          '<div class="ex-notice-panel__item">' +
          '<span class="ex-notice-panel__item-icon"><i class="fas fa-exclamation-circle"></i></span>' +
          "<div><p>" +
          n.detail +
          '</p><span class="ex-notice-panel__meta">' +
          n.updated +
          "</span></div></div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function wireBell(wrap) {
    var btn = wrap.querySelector(".ex-notice-bell");
    var panel = wrap.querySelector(".ex-notice-panel");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = panel.hidden;
      document.querySelectorAll("[data-ex-notice-bell] .ex-notice-panel").forEach(function (p) {
        p.hidden = true;
      });
      document.querySelectorAll("[data-ex-notice-bell] .ex-notice-bell").forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    wrap.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  function applyBell() {
    var utilities = findUtilityRows();
    if (!utilities.length) return;

    utilities.forEach(function (utility) {
      var wrap = el(buildBellMarkup());
      utility.insertBefore(wrap, utility.firstChild);
      wireBell(wrap);
    });

    document.addEventListener("click", function () {
      document.querySelectorAll("[data-ex-notice-bell] .ex-notice-panel").forEach(function (p) {
        p.hidden = true;
      });
      document.querySelectorAll("[data-ex-notice-bell] .ex-notice-bell").forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
    });
  }

  function applyModal() {
    if (modalSeen()) return;
    var root = el(
      '<div data-ex-notice-root class="ex-notice-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ex-notice-modal-title">' +
        '<div class="ex-notice-modal">' +
        '<div class="ex-notice-modal__header">' +
        '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>' +
        '<h2 id="ex-notice-modal-title">Important system update</h2>' +
        "</div>" +
        '<div class="ex-notice-modal__body">' +
        "<p>" +
        NOTICES[0].detail +
        "</p>" +
        "<p>" +
        NOTICES[1].detail +
        "</p>" +
        "<p>You can continue using Excelerator. Some actions may take longer than usual until service is fully restored.</p>" +
        "</div>" +
        '<div class="ex-notice-modal__footer">' +
        '<button type="button" class="btn btn-primary" data-notice-modal-ack>I understand</button>' +
        "</div></div></div>"
    );
    document.body.appendChild(root);
    root.querySelector("[data-notice-modal-ack]").addEventListener("click", function () {
      setModalSeen();
      root.remove();
    });
  }

  function applyTicker() {
    var root = el(
      '<div data-ex-notice-root class="ex-notice-ticker" role="status">' +
        '<div class="ex-notice-ticker__bar" data-ticker-toggle>' +
        '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>' +
        "<span>1 active system notice — ordering and account features may be delayed</span>" +
        '<button type="button" class="ex-notice-ticker__expand">Expand</button>' +
        '<button type="button" class="ex-notice__dismiss" aria-label="Dismiss" data-notice-dismiss>&times;</button>' +
        "</div>" +
        '<div class="ex-notice-ticker__detail">' +
        NOTICES[0].detail +
        "</div></div>"
    );
    document.body.appendChild(root);
    var toggle = root.querySelector("[data-ticker-toggle]");
    var expandBtn = root.querySelector(".ex-notice-ticker__expand");
    toggle.addEventListener("click", function (e) {
      if (e.target.closest("[data-notice-dismiss]")) return;
      root.classList.toggle("is-open");
      expandBtn.textContent = root.classList.contains("is-open") ? "Collapse" : "Expand";
    });
    bindDismiss(root);
  }

  function applyPlacement(id) {
    document.body.setAttribute("data-notice-placement", id);
    if (isDismissed() && id !== "1d" && id !== "1e") return;

    switch (id) {
      case "1a":
        applyTopStrip();
        break;
      case "1b":
        applyBelowNav();
        break;
      case "1c":
        applyToast();
        break;
      case "1d":
        applyBell();
        break;
      case "1e":
        applyModal();
        break;
      case "1f":
        applyTicker();
        break;
    }
  }

  // Public API for options page
  window.ExNoticePlacement = {
    STORAGE_KEY: STORAGE_KEY,
    get: getPlacement,
    set: setPlacement,
    OPTIONS: [
      {
        id: "1a",
        label: "Option 1",
        name: "Top strip, above the header",
        desc: "Full-width notice above site chrome — highest visibility on every page.",
      },
      {
        id: "1b",
        label: "Option 2",
        name: "Banner below the nav bar",
        desc: "In-page banner under navigation; supports stacking multiple messages.",
      },
      {
        id: "1c",
        label: "Option 3",
        name: "Floating toast, corner-anchored",
        desc: "Non-blocking corner card that stays visible without shifting layout.",
      },
      {
        id: "1d",
        label: "Option 4",
        name: "Header alert icon + dropdown center",
        desc: "Persistent header bell with a panel of active notices and timestamps.",
      },
      {
        id: "1e",
        label: "Option 5",
        name: "Interstitial modal on entry",
        desc: "Blocking acknowledgment dialog shown once per session for critical updates.",
      },
      {
        id: "1f",
        label: "Option 6",
        name: "Bottom status ticker",
        desc: "Persistent footer ticker that expands for full detail without covering the hero.",
      },
    ],
  };

  // Auto-apply on homepage templates (not on options landing)
  if (!document.body.hasAttribute("data-options-landing")) {
    var placement = getPlacement();
    if (placement) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          applyPlacement(placement);
        });
      } else {
        applyPlacement(placement);
      }
    }
  }
})();

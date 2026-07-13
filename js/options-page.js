/**
 * Renders the options landing page from window.ExOptionsStory.
 * Keep story content in js/options-story.js — this file is the shared shell.
 */
(function () {
  var story = window.ExOptionsStory;
  if (!story) return;

  function getSelected() {
    if (window.ExNoticePlacement && typeof window.ExNoticePlacement.get === "function") {
      return window.ExNoticePlacement.get();
    }
    if (!story.storageKey) return null;
    try {
      return sessionStorage.getItem(story.storageKey);
    } catch (e) {
      return null;
    }
  }

  function setSelected(id) {
    if (window.ExNoticePlacement && typeof window.ExNoticePlacement.set === "function") {
      window.ExNoticePlacement.set(id);
      return;
    }
    if (!story.storageKey) return;
    try {
      sessionStorage.setItem(story.storageKey, id);
    } catch (e) {}
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }

  function renderHero() {
    var titleEl = document.getElementById("opts-title");
    var introEl = document.getElementById("opts-intro");
    if (titleEl) titleEl.textContent = story.title || "";
    if (introEl) introEl.textContent = story.intro || "";
    if (story.pageTitle) document.title = story.pageTitle;
  }

  function renderCards() {
    var grid = document.getElementById("opts-grid");
    if (!grid || !Array.isArray(story.options)) return;

    var selected = getSelected();
    grid.innerHTML = "";

    story.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opts-card" + (selected === opt.id ? " is-selected" : "");
      btn.setAttribute("role", "listitem");

      var imageHtml = "";
      if (opt.image) {
        imageHtml =
          '<span class="opts-card__media">' +
          '<img src="' +
          escapeHtml(opt.image) +
          '" alt="" loading="lazy" />' +
          "</span>";
      }

      btn.innerHTML =
        imageHtml +
        '<span class="opts-card__label">' +
        escapeHtml(opt.label) +
        "</span>" +
        '<h2 class="opts-card__title">' +
        escapeHtml(opt.name) +
        "</h2>" +
        '<p class="opts-card__desc">' +
        escapeHtml(opt.desc) +
        "</p>" +
        '<span class="opts-card__selected"><i class="fas fa-check-circle" aria-hidden="true"></i> Currently selected</span>';

      btn.addEventListener("click", function () {
        setSelected(opt.id);
        window.location.href = story.previewUrl || "global-homepage.html";
      });

      grid.appendChild(btn);
    });
  }

  function init() {
    renderHero();
    renderCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

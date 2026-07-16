/**
 * Renders the options landing page from window.ExOptionsStory.
 * Keep story content in each story's options-story.js — this file is the shared shell.
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
    var hubEl = document.getElementById("opts-hub-link");
    if (titleEl) titleEl.textContent = story.title || "";
    if (introEl) introEl.textContent = story.intro || "";
    if (story.pageTitle) document.title = story.pageTitle;
    if (hubEl) {
      if (story.hubUrl) {
        hubEl.href = story.hubUrl;
        hubEl.hidden = false;
      } else {
        hubEl.hidden = true;
      }
    }
  }

  function createCard(opt, selected) {
    var btn = document.createElement(opt.links && opt.links.length ? "div" : "button");
    if (!opt.links || !opt.links.length) {
      btn.type = "button";
    }
    btn.className =
      "opts-card" +
      (selected === opt.id ? " is-selected" : "") +
      (opt.prioritized ? " opts-card--prioritized" : "") +
      (opt.links && opt.links.length ? " opts-card--static" : "");
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

    var badgeHtml = opt.prioritized
      ? '<span class="opts-card__badge">Prioritized</span>'
      : "";

    btn.innerHTML =
      imageHtml +
      '<span class="opts-card__label">' +
      escapeHtml(opt.label) +
      "</span>" +
      badgeHtml +
      '<h2 class="opts-card__title">' +
      escapeHtml(opt.name) +
      "</h2>" +
      '<p class="opts-card__desc">' +
      escapeHtml(opt.desc) +
      "</p>" +
      '<span class="opts-card__selected"><i class="fas fa-check-circle" aria-hidden="true"></i> Currently selected</span>';

    if (opt.links && opt.links.length) {
      var links = document.createElement("div");
      links.className = "opts-card__links";
      opt.links.forEach(function (link) {
        var a = document.createElement("a");
        a.className = "opts-card__link";
        a.href = link.href;
        a.textContent = link.label;
        a.addEventListener("click", function () {
          setSelected(opt.id);
        });
        links.appendChild(a);
      });
      btn.appendChild(links);
    } else {
      btn.addEventListener("click", function () {
        setSelected(opt.id);
        window.location.href = opt.previewUrl || story.previewUrl || "#";
      });
    }

    return btn;
  }

  function appendSection(container, heading, options, selected) {
    if (!options.length) return;

    var section = document.createElement("section");
    section.className = "opts-section";

    if (heading) {
      var h = document.createElement("h2");
      h.className = "opts-section__heading";
      h.textContent = heading;
      section.appendChild(h);
    }

    var grid = document.createElement("div");
    grid.className =
      "opts-grid" + (options.length === 1 ? " opts-grid--single" : "");
    grid.setAttribute("role", "list");

    options.forEach(function (opt) {
      grid.appendChild(createCard(opt, selected));
    });

    section.appendChild(grid);
    container.appendChild(section);
  }

  function renderCards() {
    var wrap = document.getElementById("opts-sections");
    if (!wrap || !Array.isArray(story.options)) return;

    var selected = getSelected();
    var prioritized = [];
    var other = [];

    story.options.forEach(function (opt) {
      if (opt.prioritized) prioritized.push(opt);
      else other.push(opt);
    });

    wrap.innerHTML = "";

    if (prioritized.length) {
      appendSection(
        wrap,
        story.prioritizedHeading || "Prioritized",
        prioritized,
        selected
      );
      appendSection(
        wrap,
        story.otherHeading || "Other options",
        other,
        selected
      );
    } else {
      appendSection(wrap, story.optionsHeading || null, story.options, selected);
    }
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

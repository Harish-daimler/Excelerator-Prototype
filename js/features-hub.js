/**
 * Renders the features hub from window.ExFeatures.
 */
(function () {
  var hub = window.ExFeatures;
  if (!hub) return;

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }

  function init() {
    var titleEl = document.getElementById("hub-title");
    var introEl = document.getElementById("hub-intro");
    var listEl = document.getElementById("hub-stories");
    if (hub.pageTitle) document.title = hub.pageTitle;
    if (titleEl) titleEl.textContent = hub.title || "";
    if (introEl) introEl.textContent = hub.intro || "";
    if (!listEl || !Array.isArray(hub.stories)) return;

    listEl.innerHTML = "";
    hub.stories.forEach(function (story) {
      var hasLinks = Array.isArray(story.links) && story.links.length;
      var card = document.createElement(hasLinks ? "div" : "a");
      card.className =
        "opts-card hub-card" + (hasLinks ? " opts-card--static" : "");
      if (!hasLinks) card.href = story.href;
      card.setAttribute("role", "listitem");

      card.innerHTML =
        '<span class="opts-card__label">' +
        escapeHtml(story.label || "Feature") +
        "</span>" +
        '<h2 class="opts-card__title">' +
        escapeHtml(story.name) +
        "</h2>" +
        '<p class="opts-card__desc">' +
        escapeHtml(story.desc) +
        "</p>" +
        (hasLinks
          ? ""
          : '<span class="hub-card__cta">Review options <i class="fas fa-arrow-right" aria-hidden="true"></i></span>');

      if (hasLinks) {
        var links = document.createElement("div");
        links.className = "opts-card__links";
        story.links.forEach(function (link) {
          var a = document.createElement("a");
          a.className = "opts-card__link";
          a.href = link.href;
          a.textContent = link.label;
          links.appendChild(a);
        });
        card.appendChild(links);
      }

      listEl.appendChild(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

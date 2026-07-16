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
      var a = document.createElement("a");
      a.className = "opts-card hub-card";
      a.href = story.href;
      a.setAttribute("role", "listitem");
      a.innerHTML =
        '<span class="opts-card__label">' +
        escapeHtml(story.label || "Feature") +
        "</span>" +
        '<h2 class="opts-card__title">' +
        escapeHtml(story.name) +
        "</h2>" +
        '<p class="opts-card__desc">' +
        escapeHtml(story.desc) +
        "</p>" +
        '<span class="hub-card__cta">Review options <i class="fas fa-arrow-right" aria-hidden="true"></i></span>';
      listEl.appendChild(a);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

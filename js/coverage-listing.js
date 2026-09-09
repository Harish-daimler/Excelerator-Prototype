/**
 * Customer coverage listing after VIN — dealer selection, fallback, or cap.
 */
(function () {
  var root = document.querySelector("[data-listing-root]");
  if (!root) return;

  var CAP_COPY =
    "A truck is not eligible for any extended coverages after 7 years or 750,000 miles.";

  var items = [
    { family: "Engine Optimum", offeringLabel: "Extended OPTIMUM", terms: ["Enhanced"] },
    { family: "Chassis Optimum", offeringLabel: "Extended OPTIMUM", terms: ["Ultimate"] },
    { family: "Engine Next", offeringLabel: "Extended NEXT", terms: ["En4"] },
    { family: "Chassis Next", offeringLabel: "Extended NEXT", terms: ["ENTC2"] },
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  root.innerHTML =
    '<p class="dvp-cap"><i class="fas fa-info-circle" aria-hidden="true"></i> ' +
    escapeHtml(CAP_COPY) +
    "</p>" +
    '<div class="dvp-preview-vehicle">' +
    '<p class="dvp-vin-id">1FUJGLDR8CLBP1234</p>' +
    "<p>2024 Freightliner Cascadia · 2 years · 82,000 mi · Houston Freightliner</p>" +
    "</div>" +
    '<div class="dvp-results-banner">' +
    "<p>Houston Freightliner selected these coverages for your truck.</p>" +
    "</div>" +
    '<div class="dvp-compare">' +
    items
      .map(function (pkg) {
        return (
          '<article class="dvp-plan">' +
          '<p class="dvp-plan__cat">' +
          escapeHtml(pkg.offeringLabel) +
          "</p>" +
          '<h3 class="dvp-plan__name">' +
          escapeHtml(pkg.family) +
          "</h3>" +
          '<ul class="dvp-term-list">' +
          pkg.terms
            .map(function (term) {
              return "<li>" + escapeHtml(term) + "</li>";
            })
            .join("") +
          "</ul>" +
          '<button type="button" class="dl-btn-primary dvp-plan__cta">Select</button>' +
          "</article>"
        );
      })
      .join("") +
    "</div>";
})();

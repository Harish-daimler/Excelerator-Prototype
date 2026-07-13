/**
 * Shared "Back to Options" control — injected on homepage templates only.
 */
(function () {
  if (document.body.hasAttribute("data-options-landing")) return;

  function mount() {
    if (document.querySelector(".ex-back-to-options")) return;
    var link = document.createElement("a");
    link.href = "index.html";
    link.className = "ex-back-to-options";
    link.innerHTML =
      '<i class="fas fa-th-large" aria-hidden="true"></i><span>Back to Options</span>';
    document.body.appendChild(link);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

/**
 * Dealers page shell: locations, settings tabs, inventory switch.
 */
(function () {
  var locations = document.querySelectorAll("[data-dl-locations] .dl-location");
  var dealerName = document.querySelector("[data-dl-dealer-name]");
  var dealerCode = document.querySelector("[data-dl-dealer-code]");
  var tabs = document.querySelectorAll("[data-dl-tab]");
  var panels = document.querySelectorAll("[data-dl-panel]");
  var inventorySwitch = document.querySelector("[data-dl-inventory-switch]");

  function selectLocation(btn) {
    locations.forEach(function (item) {
      item.classList.remove("is-active");
      item.removeAttribute("aria-current");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-current", "true");
    if (dealerName) dealerName.textContent = btn.getAttribute("data-name") || "";
    if (dealerCode) dealerCode.textContent = btn.getAttribute("data-code") || "";
  }

  locations.forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectLocation(btn);
    });
  });

  function showTab(id) {
    tabs.forEach(function (tab) {
      var active = tab.getAttribute("data-dl-tab") === id;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach(function (panel) {
      var active = panel.getAttribute("data-dl-panel") === id;
      panel.classList.toggle("is-active", active);
      if (active) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      showTab(tab.getAttribute("data-dl-tab"));
    });
  });

  if (inventorySwitch) {
    inventorySwitch.addEventListener("click", function () {
      var blocked = inventorySwitch.getAttribute("aria-checked") === "true";
      inventorySwitch.setAttribute("aria-checked", blocked ? "false" : "true");
    });
  }
})();

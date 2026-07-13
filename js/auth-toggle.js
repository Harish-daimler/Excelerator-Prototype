(function () {
  var body = document.body;
  var menus = document.querySelectorAll(".ex-account-menu");
  var AUTH_KEY = "ex-auth-state";

  function closeAllMenus() {
    menus.forEach(function (menu) {
      var toggle = menu.querySelector(".ex-account-menu__toggle");
      var dropdown = menu.querySelector(".ex-account-menu__dropdown");
      if (!toggle || !dropdown) return;
      toggle.setAttribute("aria-expanded", "false");
      dropdown.hidden = true;
      menu.classList.remove("is-open");
    });
  }

  function setAuth(state, persist) {
    if (state !== "logged-in" && state !== "logged-out") return;
    body.setAttribute("data-auth", state);
    if (persist !== false) {
      try {
        sessionStorage.setItem(AUTH_KEY, state);
      } catch (e) {}
    }
    closeAllMenus();
  }

  try {
    var saved = sessionStorage.getItem(AUTH_KEY);
    if (saved === "logged-in" || saved === "logged-out") {
      setAuth(saved, false);
    }
  } catch (e) {}

  menus.forEach(function (menu) {
    var toggle = menu.querySelector(".ex-account-menu__toggle");
    var dropdown = menu.querySelector(".ex-account-menu__dropdown");
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var willOpen = dropdown.hidden;
      closeAllMenus();
      if (willOpen) {
        dropdown.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        menu.classList.add("is-open");
      }
    });
  });

  document.querySelectorAll("[data-set-auth]").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setAuth(btn.getAttribute("data-set-auth"));
    });
  });

  document.addEventListener("click", function () {
    closeAllMenus();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAllMenus();
  });
})();

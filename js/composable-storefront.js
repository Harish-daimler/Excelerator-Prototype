/**
 * Interactive demos for the composable storefront reference guide.
 */
(function () {
  var root = document.querySelector("[data-csf]");
  if (!root) return;

  var PARTS = [
    { name: "Alliance oil filter", kind: "A04-16825-000" },
    { name: "Fuel filter kit", kind: "Suggested" },
    { name: "Detroit Reman turbo", kind: "R23538873" },
    { name: "Landing gear", kind: "Product" },
    { name: "Alliance battery", kind: "Product" },
  ];
  var COVERAGES = [
    { name: "EN4", kind: "Would need new code" },
    { name: "ENTC4", kind: "Would need new code" },
    { name: "Engine Ultimate", kind: "Would need new code" },
    { name: "Towing", kind: "Would need new code" },
  ];

  /* Carousel — each [data-csf-carousel] is independent */
  root.querySelectorAll("[data-csf-carousel]").forEach(function (carousel) {
    var slides = carousel.querySelector("[data-csf-slides]");
    if (!slides) return;
    var items = slides.children;
    var index = 0;
    var host = carousel.parentElement || carousel;
    var dots = host.querySelectorAll("[data-csf-dot]");
    function paint() {
      slides.style.transform = "translateX(-" + index * 100 + "%)";
      var prev = carousel.querySelector("[data-csf-prev]");
      var next = carousel.querySelector("[data-csf-next]");
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= items.length - 1;
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    var prevBtn = carousel.querySelector("[data-csf-prev]");
    var nextBtn = carousel.querySelector("[data-csf-next]");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (index > 0) index -= 1;
        paint();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (index < items.length - 1) index += 1;
        paint();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        index = Number(dot.getAttribute("data-csf-dot")) || 0;
        paint();
      });
    });
    paint();
  });

  /* Pagination */
  root.querySelectorAll("[data-csf-pager]").forEach(function (pager) {
    pager.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      event.preventDefault();
      pager.querySelectorAll("a").forEach(function (a) {
        a.classList.toggle("is-current", a === link);
      });
    });
  });

  /* Password visibility */
  root.querySelectorAll("[data-csf-password]").forEach(function (pw) {
    var wrap = pw.closest(".csf-password");
    var pwBtn = wrap && wrap.querySelector("[data-csf-password-toggle]");
    if (!pwBtn) return;
    pwBtn.addEventListener("click", function () {
      var hidden = pw.getAttribute("type") === "password";
      pw.setAttribute("type", hidden ? "text" : "password");
      pwBtn.setAttribute(
        "aria-label",
        hidden ? "Hide password" : "Show password"
      );
      pwBtn.innerHTML = hidden
        ? '<i class="fas fa-eye-slash" aria-hidden="true"></i>'
        : '<i class="fas fa-eye" aria-hidden="true"></i>';
    });
  });

  /* Popover */
  root.querySelectorAll("[data-csf-pop-wrap]").forEach(function (wrap) {
    var popBtn = wrap.querySelector("[data-csf-pop-btn]");
    var pop = wrap.querySelector("[data-csf-pop]");
    if (!popBtn || !pop) return;
    popBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      var willOpen = pop.hidden;
      pop.hidden = !willOpen;
      popBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  /* Searchbox */
  function catalogFor(input) {
    return input.getAttribute("data-csf-catalog") === "coverage"
      ? COVERAGES
      : PARTS;
  }
  function renderSuggest(input, suggest, q) {
    var hits = catalogFor(input).filter(function (row) {
      return row.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    if (!q || !hits.length) {
      suggest.hidden = true;
      suggest.innerHTML = "";
      return;
    }
    suggest.innerHTML = hits
      .map(function (row) {
        return (
          "<li><strong>" +
          row.name +
          "</strong><br /><small>" +
          row.kind +
          "</small></li>"
        );
      })
      .join("");
    suggest.hidden = false;
  }
  root.querySelectorAll("[data-csf-search]").forEach(function (search) {
    var wrap = search.closest(".csf-search");
    var suggest = wrap && wrap.querySelector("[data-csf-suggest]");
    if (!suggest) return;
    if (search.value.trim()) {
      renderSuggest(search, suggest, search.value.trim());
    }
    search.addEventListener("input", function () {
      renderSuggest(search, suggest, search.value.trim());
    });
    search.addEventListener("blur", function () {
      setTimeout(function () {
        suggest.hidden = true;
      }, 180);
    });
    search.addEventListener("focus", function () {
      if (search.value.trim()) {
        renderSuggest(search, suggest, search.value.trim());
      }
    });
  });

  /* Split view */
  root.querySelectorAll("[data-csf-split]").forEach(function (split) {
    var pane2 = split.querySelector("[data-csf-pane-2]");
    var openBtn = split.querySelector("[data-csf-open-pane]");
    var closeBtn = split.querySelector("[data-csf-close-pane]");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        if (pane2) pane2.hidden = false;
        split.classList.remove("is-single");
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        if (pane2) pane2.hidden = true;
        split.classList.add("is-single");
      });
    }
  });

  /* Media format chips */
  root.querySelectorAll("[data-csf-media], .csf-media").forEach(function (group) {
    group.querySelectorAll("[data-csf-format]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll("[data-csf-format]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
      });
    });
  });

  /* PDP gallery thumbs */
  root.querySelectorAll("[data-csf-gallery]").forEach(function (gal) {
    var main = gal.querySelector("[data-csf-gallery-main]");
    gal.querySelectorAll("[data-csf-thumb]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        gal.querySelectorAll("[data-csf-thumb]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        if (main) main.src = btn.getAttribute("data-csf-thumb");
      });
    });
  });

  /* TOC active section */
  var tocLinks = root.querySelectorAll(".csf-toc a");
  var sections = [];
  tocLinks.forEach(function (a) {
    var id = a.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var el = document.getElementById(id.slice(1));
      if (el) sections.push({ el: el, a: a });
    }
  });
  function syncToc() {
    var current = sections[0];
    sections.forEach(function (item) {
      if (item.el.getBoundingClientRect().top <= 80) current = item;
    });
    tocLinks.forEach(function (a) {
      a.classList.remove("is-active");
    });
    if (current) current.a.classList.add("is-active");
  }
  window.addEventListener("scroll", syncToc, { passive: true });
  syncToc();
})();

/**
 * Shared Excelerator site header for dealer-access screens (post-email).
 * Mounts into [data-da-site-header]. Set data-da-root on <body> for asset paths
 * (e.g. "../.." from story root, "../../.." from option-* folders).
 */
(function () {
  var mount = document.querySelector("[data-da-site-header]");
  if (!mount) return;

  var root = (document.body.getAttribute("data-da-root") || "../..").replace(
    /\/$/,
    ""
  );
  var logo = root + "/assets/images/excelerator-logo.png";
  var flag = root + "/assets/images/site-selector-icon-dtna.png";

  mount.outerHTML =
    '<header class="product-header da-site-header" role="banner">' +
    '<div class="da-site-header__top">' +
    '<a class="ex-header__logo" href="' +
    root +
    '/global-homepage.html" aria-label="Excelerator home">' +
    '<img src="' +
    logo +
    '" alt="Excelerator" />' +
    "</a>" +
    '<div class="da-site-header__top-right">' +
    '<a class="da-site-header__signin" href="#">Sign In or Register</a>' +
    '<button type="button" class="ex-header__util-btn" aria-label="Region and language">' +
    '<img class="ex-header__flag ex-header__flag--site" src="' +
    flag +
    '" alt="United States / Canada" />' +
    '<i class="fas fa-chevron-down" aria-hidden="true"></i>' +
    "</button>" +
    "</div>" +
    "</div>" +
    '<div class="da-site-header__search-row">' +
    '<button type="button" class="ph-shop-vehicle">' +
    '<i class="fas fa-truck" aria-hidden="true"></i>' +
    "Shop by Vehicle" +
    '<i class="fas fa-plus" aria-hidden="true"></i>' +
    "</button>" +
    '<form class="ph-search" role="search" action="#" onsubmit="return false;">' +
    '<button type="button" class="ph-search__filter" aria-label="Search filters">' +
    '<i class="fas fa-caret-down" aria-hidden="true"></i>' +
    "</button>" +
    '<input class="ph-search__input" type="search" placeholder="Search by part name, number, VMRS, or cross reference" aria-label="Search" />' +
    '<button type="submit" class="ph-search__submit" aria-label="Search">' +
    '<i class="fas fa-search" aria-hidden="true"></i>' +
    "</button>" +
    "</form>" +
    '<a class="parts-dealer" href="#">' +
    '<i class="fas fa-map-marker-alt" aria-hidden="true"></i>' +
    "<span>Find My Dealer</span>" +
    "</a>" +
    "</div>" +
    '<nav class="da-site-header__nav" aria-label="Primary">' +
    '<ul class="da-site-header__links">' +
    '<li><a href="#">Product Categories</a></li>' +
    '<li><a href="#">Dashboard</a></li>' +
    '<li><a href="#">More Resources</a></li>' +
    '<li><a href="#">Messages &amp; Library</a></li>' +
    '<li><a href="#">Inner Circle Rewards</a></li>' +
    '<li><a href="#">Quotes/Orders</a></li>' +
    '<li><a href="#">My Garage</a></li>' +
    "</ul>" +
    '<div class="da-site-header__utils">' +
    '<button type="button" aria-label="Quick actions"><i class="fas fa-bolt"></i></button>' +
    '<button type="button" aria-label="Favorites"><i class="far fa-star"></i></button>' +
    '<span class="ph-nav__cart"><i class="fas fa-shopping-cart"></i> (0 Items) $0.00</span>' +
    "</div>" +
    "</nav>" +
    "</header>";
})();

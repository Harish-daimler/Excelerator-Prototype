/**
 * Shared Excelerator site header for dealer-access screens (post-email).
 * Mounts into [data-da-site-header]. Set data-da-root on <body> for asset paths
 * (e.g. "../.." from story root).
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
    '<header class="da-site-header" role="banner">' +
    '<div class="da-site-header__inner">' +
    '<a class="ex-header__logo" href="' +
    root +
    '/global-homepage.html" aria-label="Excelerator home">' +
    '<img src="' +
    logo +
    '" alt="Excelerator" />' +
    "</a>" +
    '<div class="da-site-header__actions">' +
    '<a class="da-site-header__signin" href="#">Sign In</a>' +
    '<button type="button" class="da-site-header__locale" aria-label="Region and language">' +
    '<img class="ex-header__flag ex-header__flag--site" src="' +
    flag +
    '" alt="United States / Canada" />' +
    '<i class="fas fa-chevron-down" aria-hidden="true"></i>' +
    "</button>" +
    "</div>" +
    "</div>" +
    "</header>";
})();

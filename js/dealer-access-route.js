/**
 * Dealer-access approval routing.
 * Stores which Screen 3 variant to use after shared Email → Screen 2.
 * sessionStorage key: ex-dealer-access-route
 * value JSON: { option: "option-a"|"option-b"|"option-c", steps: "with-steps"|"no-steps" }
 */
(function (global) {
  var KEY = "ex-dealer-access-route";

  function parseQuery() {
    var params = new URLSearchParams(window.location.search);
    var option = params.get("option");
    var steps = params.get("steps");
    if (
      option &&
      steps &&
      /^option-[abc]$/.test(option) &&
      (steps === "with-steps" || steps === "no-steps")
    ) {
      return { option: option, steps: steps };
    }
    return null;
  }

  function save(route) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(route));
    } catch (e) {}
  }

  function load() {
    var fromQuery = parseQuery();
    if (fromQuery) {
      save(fromQuery);
      return fromQuery;
    }
    try {
      var raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.option &&
        parsed.steps &&
        /^option-[abc]$/.test(parsed.option) &&
        (parsed.steps === "with-steps" || parsed.steps === "no-steps")
      ) {
        return parsed;
      }
    } catch (e) {}
    return null;
  }

  function screen3Path(route) {
    if (!route) return null;
    return (
      route.option +
      "/screen-3-" +
      route.steps +
      ".html"
    );
  }

  global.ExDealerAccessRoute = {
    KEY: KEY,
    load: load,
    save: save,
    screen3Path: screen3Path,
  };

  // Capture route whenever this script loads on an entry page with query params
  load();
})(window);

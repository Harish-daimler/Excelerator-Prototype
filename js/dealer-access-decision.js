/**
 * Screen 2 — Confirm / Reset / radio gating for dealer-access approval.
 */
(function () {
  var form = document.querySelector("[data-da-decision]");
  if (!form) return;

  var radios = form.querySelectorAll('input[name="decision"]');
  var resetBtn = form.querySelector("[data-da-reset]");
  var confirmBtn = form.querySelector("[data-da-confirm]");
  var declineUrl = form.getAttribute("data-decline-url") || "decline.html";
  var approveUrl = form.getAttribute("data-approve-url") || "screen-3.html";

  function selectedValue() {
    var checked = form.querySelector('input[name="decision"]:checked');
    return checked ? checked.value : null;
  }

  function syncConfirm() {
    if (!confirmBtn) return;
    confirmBtn.disabled = !selectedValue();
  }

  function onReset() {
    radios.forEach(function (radio) {
      radio.checked = false;
    });
    syncConfirm();
  }

  function onConfirm() {
    var value = selectedValue();
    if (!value) return;

    if (value === "decline") {
      window.location.href = declineUrl;
      return;
    }

    window.location.href = approveUrl;
  }

  radios.forEach(function (radio) {
    radio.addEventListener("change", syncConfirm);
  });
  if (resetBtn) resetBtn.addEventListener("click", onReset);
  if (confirmBtn) confirmBtn.addEventListener("click", onConfirm);

  onReset();
})();

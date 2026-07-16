/**
 * Optional password setup on dealer-access Screen 3.
 * Terms are only required when the user is actively setting a password.
 */
(function () {
  var form = document.querySelector("[data-da-password-form]");
  if (!form) return;

  var password = form.querySelector("#da-password");
  var confirm = form.querySelector("#da-confirm");
  var terms = form.querySelector("#da-terms");
  var termsLabel = form.querySelector("[data-da-terms]");
  var errorEl = form.querySelector("[data-da-error]");
  var skipBtn = form.querySelector("[data-da-skip]");
  var skipUrl = form.getAttribute("data-skip-url") || "skip-end.html";
  var successUrl = form.getAttribute("data-success-url") || "screen-4.html";

  function isSettingPassword() {
    return (
      (password && password.value.trim().length > 0) ||
      (confirm && confirm.value.trim().length > 0)
    );
  }

  function syncTermsState() {
    var active = isSettingPassword();
    if (!terms || !termsLabel) return;
    terms.disabled = !active;
    terms.required = active;
    if (!active) terms.checked = false;
    termsLabel.classList.toggle("is-muted", !active);
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add("is-visible");
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.remove("is-visible");
  }

  function onSubmit(event) {
    event.preventDefault();
    clearError();

    if (!isSettingPassword()) {
      showError("Enter a password to continue, or choose Skip for now.");
      return;
    }

    if (password.value !== confirm.value) {
      showError("Passwords do not match.");
      return;
    }

    if (!terms.checked) {
      showError("Please accept the Terms & Conditions to create a password.");
      return;
    }

    window.location.href = successUrl;
  }

  if (password) password.addEventListener("input", syncTermsState);
  if (confirm) confirm.addEventListener("input", syncTermsState);
  form.addEventListener("submit", onSubmit);

  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      window.location.href = skipUrl;
    });
  }

  syncTermsState();
})();

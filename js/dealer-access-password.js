/**
 * Optional password setup on dealer-access Screen 3.
 * Terms are only required when the user is actively setting a password.
 * Requirement / match checks run on Create password submit.
 */
(function () {
  var form = document.querySelector("[data-da-password-form]");
  if (!form) return;

  var password = form.querySelector("#da-password");
  var confirm = form.querySelector("#da-confirm");
  var terms = form.querySelector("#da-terms");
  var termsLabel = form.querySelector("[data-da-terms]");
  var errorEl = form.querySelector("[data-da-error]");
  var reqsEl = form.querySelector("[data-da-password-reqs]");
  var passwordErrorEl = form.querySelector("[data-da-password-error]");
  var matchErrorEl = form.querySelector("[data-da-match-error]");
  var skipBtn = form.querySelector("[data-da-skip]");
  var skipUrl = form.getAttribute("data-skip-url") || "skip-end.html";
  var successUrl = form.getAttribute("data-success-url") || "screen-4.html";

  function isSettingPassword() {
    return (
      (password && password.value.trim().length > 0) ||
      (confirm && confirm.value.trim().length > 0)
    );
  }

  function hasFourConsecutiveSame(value) {
    return /(.)\1{3,}/.test(value);
  }

  function meetsPasswordRequirements(value) {
    if (!value || value.length < 8) return false;
    if (!/[A-Z]/.test(value)) return false;
    if (!/[a-z]/.test(value)) return false;
    if (!/[0-9]/.test(value)) return false;
    if (hasFourConsecutiveSame(value)) return false;
    return true;
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

  function setReqsInvalid(invalid) {
    if (!reqsEl) return;
    reqsEl.classList.toggle("is-invalid", invalid);
  }

  function setFieldError(el, visible) {
    if (!el) return;
    if (visible) {
      el.removeAttribute("hidden");
    } else {
      el.setAttribute("hidden", "");
    }
  }

  function clearFieldErrors() {
    setReqsInvalid(false);
    setFieldError(passwordErrorEl, false);
    setFieldError(matchErrorEl, false);
  }

  function onSubmit(event) {
    event.preventDefault();
    clearError();
    clearFieldErrors();

    if (!isSettingPassword()) {
      setFieldError(passwordErrorEl, true);
      return;
    }

    var passwordOk = meetsPasswordRequirements(password.value);
    var passwordsMatch = password.value === confirm.value;
    var valid = true;

    if (!passwordOk) {
      setReqsInvalid(true);
      valid = false;
    }

    if (!passwordsMatch) {
      setFieldError(matchErrorEl, true);
      valid = false;
    }

    if (!terms.checked) {
      showError(
        "Please accept Excelerator Terms & Conditions and DTNA Privacy Policy to create a password."
      );
      valid = false;
    }

    if (!valid) return;

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

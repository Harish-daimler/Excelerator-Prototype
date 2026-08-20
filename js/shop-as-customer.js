/**
 * Customer Login Selection table.
 *
 * Only customers with approved consent can be selected. The four treatments
 * below are competing ways to make blocked rows obvious — switch with
 * ?treatment=dim|lock|action|reason (defaults to dim).
 */
(function () {
  var tbody = document.querySelector("[data-sac-rows]");
  if (!tbody) return;

  var CONSENT = {
    approved: { label: "Approved", selectable: true, resend: false },
    pending: { label: "Pending", selectable: false, resend: true },
    declined: { label: "Declined", selectable: false, resend: false },
    expired: { label: "Expired", selectable: false, resend: true },
  };

  var BLOCKED_REASON = {
    pending: "Awaiting customer consent",
    declined: "Customer declined consent",
    expired: "Consent request expired",
  };

  var TREATMENTS = {
    dim: {
      note: "Treatment A — blocked rows are dimmed and their select control is disabled.",
    },
    lock: {
      note: "Treatment B — blocked rows keep full contrast; a lock replaces the select control.",
    },
    action: {
      note: "Treatment C — the last column states the only action available for each row.",
    },
    reason: {
      note: "Treatment D — blocked rows are greyed and show the reason under the customer name.",
    },
  };

  var CUSTOMERS = [
    {
      name: "NEW CASCADIA",
      email: "newcascadiatrucksales@fvdafreightliner.com.testaccount",
      consent: "pending",
      icr: "eligible",
      oms: "",
      dealer: "",
      guest: true,
    },
    {
      name: "CESAR SOLARES",
      email: "cesarsolarez59@yahoo.com.testaccount",
      consent: "approved",
      icr: "enrolled",
      oms: "",
      dealer: "",
      guest: true,
    },
    {
      name: "C SAUNDERS",
      email: "casaunders@gmail.com.testaccount",
      consent: "approved",
      icr: "enrolled",
      oms: "",
      dealer: "",
      guest: true,
    },
    {
      name: "HIDALIA GARCIA",
      email: "castransportaionllc@hotmail.com.testaccount",
      consent: "expired",
      icr: "enrolled",
      oms: "",
      dealer: "",
      guest: true,
    },
    {
      name: "JOHN",
      email: "johnjoso3784@yahoo.com.testaccount",
      consent: "declined",
      icr: "enrolled",
      oms: "",
      dealer: "",
      guest: true,
    },
    {
      name: "Dorcas",
      email: "martinabrown@mailinator.com",
      consent: "pending",
      icr: "eligible",
      oms: "3421929105",
      dealer: "FBCFD",
    },
    {
      name: "MARIO CASTANEDA",
      email: "office.a1prioritytruck@gmail.com.testaccount",
      consent: "approved",
      icr: "enrolled",
      oms: "267101",
      dealer: "FIEXD",
    },
    {
      name: "Melissa Castaneda",
      email: "mcastaneda@4hornind.com.testaccount",
      consent: "approved",
      icr: "enrolled",
      oms: "339118",
      dealer: "FWNFD",
    },
    {
      name: "Casey Stengel",
      email: "casey.stengel@mailinator.com",
      consent: "expired",
      icr: "enrolled",
      oms: "173545",
      dealer: "FBCFD",
    },
    {
      name: "Dorcas",
      email: "anjali_bogisich@yahoo.com",
      consent: "declined",
      icr: "eligible",
      oms: "0677387210",
      dealer: "FBCFD",
    },
  ];

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }

  function getTreatment() {
    var match = /[?&]treatment=([^&]+)/.exec(window.location.search);
    var id = match ? decodeURIComponent(match[1]) : "";
    return TREATMENTS[id] ? id : "dim";
  }

  function icrCell(icr) {
    if (icr === "enrolled") {
      return (
        '<span class="sac-icr-enrolled">' +
        '<span class="sac-icr-badge" aria-hidden="true">ICR</span>' +
        "Enrolled</span>"
      );
    }
    return (
      '<span class="sac-icr-eligible">Eligible</span>' +
      '<span class="sac-icr-sep" aria-hidden="true">&mdash;</span>' +
      '<a class="sac-icr-enroll" href="#">Enroll Now</a>'
    );
  }

  function consentCell(customer) {
    return (
      '<span class="sac-consent sac-consent--' +
      customer.consent +
      '">' +
      escapeHtml(CONSENT[customer.consent].label) +
      "</span>"
    );
  }

  function nameCell(customer, treatment) {
    var html = escapeHtml(customer.name);

    if (customer.guest) {
      html +=
        ' <i class="fas fa-person-walking sac-guest-icon" aria-label="Guest shopper" title="Guest shopper"></i>';
    }

    var reason = BLOCKED_REASON[customer.consent];
    if (treatment === "reason" && reason) {
      html +=
        '<span class="sac-blocked-reason"><i class="fas fa-circle-exclamation" aria-hidden="true"></i>' +
        escapeHtml(reason) +
        "</span>";
    }

    return html;
  }

  function resendButton(customer) {
    return (
      '<button type="button" class="sac-resend" aria-label="Resend consent request to ' +
      escapeHtml(customer.name) +
      '">Resend Request<i class="fas fa-envelope" aria-hidden="true"></i></button>'
    );
  }

  function actionCell(customer, treatment) {
    var state = CONSENT[customer.consent];
    var reason = BLOCKED_REASON[customer.consent] || "Consent required";

    if (state.selectable) {
      var selectLabel =
        treatment === "action"
          ? '<span class="sac-select-text">Shop as customer</span>'
          : "";
      return (
        '<button type="button" class="sac-row-go" aria-label="Shop as ' +
        escapeHtml(customer.name) +
        '">' +
        selectLabel +
        '<i class="fas fa-chevron-right" aria-hidden="true"></i></button>'
      );
    }

    if (treatment === "lock") {
      return (
        '<span class="sac-row-locked" title="' +
        escapeHtml(reason) +
        '"><i class="fas fa-lock" aria-hidden="true"></i>' +
        '<span class="visually-hidden">' +
        escapeHtml(reason) +
        "</span></span>"
      );
    }

    if (treatment === "action") {
      return state.resend
        ? resendButton(customer)
        : '<span class="sac-action-unavailable">Unavailable</span>';
    }

    return (
      '<button type="button" class="sac-row-go" disabled aria-label="' +
      escapeHtml(reason) +
      '"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>'
    );
  }

  function consentActionCell(customer, treatment) {
    if (treatment === "action") return "";
    return CONSENT[customer.consent].resend ? resendButton(customer) : "";
  }

  function renderRow(customer, treatment) {
    var state = CONSENT[customer.consent];
    var tr = document.createElement("tr");

    if (!state.selectable) {
      tr.className = "is-blocked is-blocked--" + treatment;
    }

    var consentHtml = consentCell(customer);
    var resendHtml = consentActionCell(customer, treatment);
    if (resendHtml) {
      consentHtml =
        '<div class="sac-consent-cell">' + consentHtml + resendHtml + "</div>";
    }

    tr.innerHTML =
      '<td class="sac-table__name">' +
      nameCell(customer, treatment) +
      "</td>" +
      '<td class="sac-table__email">' +
      escapeHtml(customer.email) +
      "</td>" +
      "<td>" +
      consentHtml +
      "</td>" +
      "<td>" +
      icrCell(customer.icr) +
      "</td>" +
      "<td>" +
      escapeHtml(customer.oms) +
      "</td>" +
      "<td>" +
      escapeHtml(customer.dealer) +
      "</td>" +
      '<td class="sac-table__action">' +
      actionCell(customer, treatment) +
      "</td>";

    return tr;
  }

  function init() {
    var treatment = getTreatment();
    var table = document.querySelector("[data-sac-table]");
    if (table) table.setAttribute("data-treatment", treatment);

    var note = document.querySelector("[data-sac-treatment-note]");
    if (note) {
      note.textContent = TREATMENTS[treatment].note;
      note.hidden = false;
    }

    tbody.innerHTML = "";
    CUSTOMERS.forEach(function (customer) {
      tbody.appendChild(renderRow(customer, treatment));
    });
  }

  init();
})();

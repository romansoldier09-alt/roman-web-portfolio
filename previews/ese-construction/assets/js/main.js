/* ESE Construction — V1
   Minimal progressive enhancement. The page works without this file. */
(function () {
  "use strict";

  /* ---------- mobile navigation ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- quote form ---------- */
  var form = document.getElementById("quoteForm");
  var status = document.getElementById("formStatus");
  if (!form) return;

  var PLACEHOLDER_KEY = "ACCESS_KEY_PLACEHOLDER";

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form-status is-shown is-" + kind;
  }

  function clearError(field) {
    field.removeAttribute("aria-invalid");
    var note = field.parentNode.querySelector(".field-error");
    if (note) note.remove();
  }

  function showError(field, msg) {
    field.setAttribute("aria-invalid", "true");
    var note = field.parentNode.querySelector(".field-error");
    if (!note) {
      note = document.createElement("span");
      note.className = "field-error";
      field.parentNode.appendChild(note);
    }
    note.textContent = msg;
  }

  // Required: name, phone, city. Email and everything else are optional,
  // but a value that IS supplied still has to look valid.
  var MESSAGES = {
    name: "Add your name so we know who we're replying to.",
    phone: "Add a phone number we can reach you on.",
    city: "Tell us which city the job is in."
  };

  function validate() {
    var firstBad = null;

    function check(field, bad, msg) {
      clearError(field);
      if (!bad) return;
      showError(field, msg);
      if (!firstBad) firstBad = field;
    }

    Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (field) {
      var value = (field.value || "").trim();
      if (value === "") {
        check(field, true, MESSAGES[field.name] || "This field is required.");
      } else if (field.type === "tel" && value.replace(/\D/g, "").length < 10) {
        check(field, true, "That phone number looks too short.");
      } else {
        clearError(field);
      }
    });

    var email = form.querySelector("#email");
    if (email) {
      var ev = (email.value || "").trim();
      check(email, ev !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev),
            "That email address doesn't look complete.");
    }

    return firstBad;
  }

  form.addEventListener("submit", function (e) {
    var bad = validate();

    if (bad) {
      e.preventDefault();
      setStatus("A few fields still need filling in.", "error");
      bad.focus();
      return;
    }

    var key = form.querySelector('[name="access_key"]');

    // While the endpoint is still a placeholder, don't post anywhere.
    // TODO: drop this guard once the real form key is in place.
    if (key && key.value === PLACEHOLDER_KEY) {
      e.preventDefault();
      setStatus(
        "Form is not connected yet — this is the private V1 build. " +
        "Add the real form key before launch and this will send.",
        "note"
      );
      return;
    }

    setStatus("Sending your request\u2026", "note");
  });

  form.addEventListener("input", function (e) {
    if (e.target.hasAttribute("aria-invalid")) clearError(e.target);
  });
  form.addEventListener("change", function (e) {
    if (e.target.hasAttribute("aria-invalid")) clearError(e.target);
  });
})();

export const formBridgeScript = String.raw`
<script>
(function () {
  "use strict";

  function collectFields(form) {
    var data = {};
    Array.prototype.slice.call(form.elements || []).forEach(function (field) {
      if (!field.name && !field.id) return;
      if ((field.type === "checkbox" || field.type === "radio") && !field.checked) return;
      var key = field.name || field.id;
      data[key] = field.value;
    });
    return data;
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || form.tagName !== "FORM") return;

    event.preventDefault();
    event.stopPropagation();

    var payload = {
      pageUrl: window.location.href,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent,
      fields: collectFields(form)
    };

    fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Telegram request failed");
        return response.json();
      })
      .then(function () {
        form.reset();
        alert("Dziękujemy. Wiadomość została wysłana.");
      })
      .catch(function () {
        alert("Nie udało się wysłać formularza. Spróbuj ponownie lub zadzwoń: 662 755 566.");
      });
  }, true);
})();
</script>`;

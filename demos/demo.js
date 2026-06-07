document.querySelectorAll(".demo-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      status.textContent = "Completa los campos requeridos.";
      return;
    }

    status.textContent = "Demo recibida. En una version real este formulario se conecta a EmailJS o al CRM del cliente.";
    form.reset();
  });
});

const claimsForm = document.querySelector("#claimsForm");
const claimsStatus = document.querySelector("#claimsStatus");

claimsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(claimsForm);
  const requiredFields = [
    "claimName",
    "claimDocumentType",
    "claimDocument",
    "claimEmail",
    "claimPhone",
    "claimType",
    "claimService",
    "claimDescription",
    "claimRequest"
  ];
  const missingField = requiredFields.some((field) => !String(data.get(field)).trim());

  claimsStatus.classList.remove("error");

  if (missingField || !data.get("claimConsent")) {
    claimsStatus.textContent = "Completa todos los campos obligatorios y acepta la declaracion.";
    claimsStatus.classList.add("error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("claimEmail")).trim())) {
    claimsStatus.textContent = "Ingresa un correo electronico valido.";
    claimsStatus.classList.add("error");
    return;
  }

  const claimCode = `LUM-${Date.now().toString().slice(-6)}`;
  claimsStatus.textContent = `Solicitud registrada con codigo ${claimCode}. Para envio real, conecta este formulario a EmailJS o a un backend.`;
  claimsForm.reset();
});

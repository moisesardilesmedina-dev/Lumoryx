const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const serviceSelect = document.querySelector("#service");
const messageInput = document.querySelector("#message");
const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalClose = document.querySelector(".modal-close");
const quoteCalculator = document.querySelector("#quoteCalculator");
const quotePrice = document.querySelector("#quotePrice");
const quoteSummary = document.querySelector("#quoteSummary");
const quoteStatus = document.querySelector("#quoteStatus");
const sectionCount = document.querySelector("#sectionCount");
const contactForm = document.querySelector("#contactForm");

let currentQuote = "";
const emailConfig = {
  publicKey: "TU_PUBLIC_KEY",
  serviceId: "TU_SERVICE_ID",
  templateId: "TU_TEMPLATE_ID"
};

if (window.emailjs && !emailConfig.publicKey.startsWith("TU_")) {
  emailjs.init({ publicKey: emailConfig.publicKey });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();

    const service = link.dataset.service;
    if (service) {
      setService(service);
    }
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = mainNav.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    setService(button.dataset.service);
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".project-card").forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    modalClose.focus();
  });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeMenu();
  }
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    item.setAttribute("aria-expanded", String(isOpen));
    item.querySelector("strong").textContent = isOpen ? "-" : "+";
  });
});

if (quoteCalculator) {
  quoteCalculator.addEventListener("input", updateQuote);
  quoteCalculator.addEventListener("change", updateQuote);
  updateQuote();
}

document.querySelector("#sendQuote").addEventListener("click", () => {
  setService(getQuoteService(), currentQuote);
  document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  quoteStatus.textContent = "Resumen agregado al formulario.";
});

document.querySelector("#copyQuote").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentQuote);
    quoteStatus.textContent = "Resumen copiado.";
  } catch (error) {
    quoteStatus.textContent = "No se pudo copiar automaticamente.";
    quoteStatus.classList.add("error");
  }
});

document.querySelector("#copyEmail").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const originalText = button.textContent;

  try {
    await navigator.clipboard.writeText(button.dataset.email);
    button.textContent = "Email copiado";
  } catch (error) {
    button.textContent = button.dataset.email;
  }

  window.setTimeout(() => {
    button.textContent = originalText;
  }, 2200);
});

contactForm.addEventListener("input", saveContactDraft);
loadContactDraft();

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.querySelector("#formStatus");
  const submitButton = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const company = String(data.get("company")).trim();
  const email = String(data.get("email")).trim();
  const phone = String(data.get("phone")).trim();
  const service = String(data.get("service")).trim();
  const budget = String(data.get("budget")).trim();
  const message = String(data.get("message")).trim();

  status.classList.remove("error");

  if (!name || !email || !phone || !service || !budget || !message) {
    status.textContent = "Completa todos los campos para enviar la solicitud.";
    status.classList.add("error");
    return;
  }

  if (!isValidEmail(email)) {
    status.textContent = "Ingresa un email valido.";
    status.classList.add("error");
    return;
  }

  status.textContent = "Enviando solicitud...";
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    await sendContactRequest(form, { name, company, email, phone, service, budget, message });
    status.textContent = "Solicitud enviada. Te responderemos pronto.";
    form.reset();
    localStorage.removeItem("lumoryxContactDraft");
  } catch (error) {
    status.textContent = error.message === "EmailJS is not configured"
      ? "Falta configurar EmailJS en script.js para activar el envio directo."
      : "No se pudo enviar ahora. Intenta nuevamente o usa WhatsApp.";
    status.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Enviar solicitud";
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      document.querySelectorAll(".main-nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

function updateQuote() {
  const typeSelect = document.querySelector("#quoteType");
  const sectionsInput = document.querySelector("#quoteSections");
  const urgencySelect = document.querySelector("#quoteUrgency");
  const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'));
  const base = Number(typeSelect.value);
  const sections = Number(sectionsInput.value);
  const sectionCost = Math.max(sections - 1, 0) * 25;
  const extrasCost = extras.reduce((total, item) => total + Number(item.value), 0);
  const urgencyCost = Number(urgencySelect.value);
  const total = base + sectionCost + extrasCost + urgencyCost;
  const typeLabel = typeSelect.selectedOptions[0].dataset.label;
  const urgencyLabel = urgencySelect.selectedOptions[0].dataset.label;
  const extrasLabels = extras.map((item) => item.dataset.label);

  sectionCount.textContent = sections;
  quotePrice.textContent = `$${total}`;
  currentQuote = [
    `Proyecto: ${typeLabel}`,
    `Secciones: ${sections}`,
    `Extras: ${extrasLabels.length ? extrasLabels.join(", ") : "Sin extras"}`,
    `Urgencia: ${urgencyLabel}`,
    `Estimado referencial: $${total}`
  ].join("\n");
  quoteSummary.textContent = currentQuote.replaceAll("\n", " | ");
  quoteStatus.textContent = "";
  quoteStatus.classList.remove("error");
}

function getQuoteService() {
  const typeLabel = document.querySelector("#quoteType").selectedOptions[0].dataset.label;
  const serviceMap = {
    "Landing page": "Landing page",
    "Sitio web completo": "Proyecto web completo",
    "Tienda online": "E-commerce",
    Automatizacion: "Automatizacion"
  };

  return serviceMap[typeLabel] || "Proyecto web completo";
}

function setService(service, customMessage) {
  if (!serviceSelect) return;

  const option = Array.from(serviceSelect.options).find((item) => item.text === service);
  serviceSelect.value = option ? option.value : "Proyecto web completo";

  if (messageInput && (customMessage || !messageInput.value.trim())) {
    messageInput.value = customMessage || `Hola Lumoryx, quiero cotizar ${service}.`;
  }

  saveContactDraft();
}

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendContactRequest(form, fields) {
  if (!window.emailjs || emailConfig.publicKey.startsWith("TU_")) {
    throw new Error("EmailJS is not configured");
  }

  return emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
    to_email: form.dataset.recipient,
    from_name: fields.name,
    from_email: fields.email,
    company: fields.company || "No especificada",
    phone: fields.phone,
    service: fields.service,
    budget: fields.budget,
    message: fields.message,
    subject: `Solicitud Lumoryx: ${fields.service}`
  });
}

function saveContactDraft() {
  const draft = {
    name: document.querySelector("#name").value,
    company: document.querySelector("#company").value,
    email: document.querySelector("#email").value,
    phone: document.querySelector("#phone").value,
    service: serviceSelect.value,
    budget: document.querySelector("#budget").value,
    message: messageInput.value
  };

  localStorage.setItem("lumoryxContactDraft", JSON.stringify(draft));
}

function loadContactDraft() {
  const saved = localStorage.getItem("lumoryxContactDraft");
  if (!saved) return;

  try {
    const draft = JSON.parse(saved);
    document.querySelector("#name").value = draft.name || "";
    document.querySelector("#company").value = draft.company || "";
    document.querySelector("#email").value = draft.email || "";
    document.querySelector("#phone").value = draft.phone || "";
    serviceSelect.value = draft.service || "";
    document.querySelector("#budget").value = draft.budget || "";
    messageInput.value = draft.message || "";
  } catch (error) {
    localStorage.removeItem("lumoryxContactDraft");
  }
}

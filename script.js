const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const serviceSelect = document.querySelector("#service");
const messageInput = document.querySelector("#message");
const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalClose = document.querySelector(".modal-close");

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

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.querySelector("#formStatus");
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const email = String(data.get("email")).trim();
  const service = String(data.get("service")).trim();
  const message = String(data.get("message")).trim();

  status.classList.remove("error");

  if (!name || !email || !service || !message) {
    status.textContent = "Completa todos los campos para enviar la solicitud.";
    status.classList.add("error");
    return;
  }

  if (!isValidEmail(email)) {
    status.textContent = "Ingresa un email valido.";
    status.classList.add("error");
    return;
  }

  const subject = encodeURIComponent(`Solicitud Lumoryx: ${service}`);
  const body = encodeURIComponent(
    `Nombre: ${name}\nEmail: ${email}\nServicio: ${service}\n\nMensaje:\n${message}`
  );

  status.textContent = "Solicitud preparada. Se abrira tu correo para enviarla.";
  window.location.href = `mailto:hola@lumoryx.agency?subject=${subject}&body=${body}`;
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

function setService(service) {
  if (!serviceSelect) return;

  const option = Array.from(serviceSelect.options).find((item) => item.text === service);
  serviceSelect.value = option ? option.value : "Proyecto web completo";

  if (messageInput && !messageInput.value.trim()) {
    messageInput.value = `Hola Lumoryx, quiero cotizar ${service}.`;
  }
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

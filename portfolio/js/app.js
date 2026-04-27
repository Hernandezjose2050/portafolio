const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll(".reveal");
const skillCards = document.querySelectorAll(".skill-card");
const backToTop = document.querySelector(".back-to-top");
const typingText = document.getElementById("typing-text");
const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");
const projectCards = document.querySelectorAll(".project-card");

const typingPhrases = [
  "Backend Developer",
  "Software Developer",
  "Systems Student"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 520);
}

function closeMenu() {
  navToggle.classList.remove("active");
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateHeader);
updateHeader();

function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (deleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typingText.textContent = currentPhrase.slice(0, charIndex);

  if (!deleting && charIndex === currentPhrase.length) {
    deleting = true;
    setTimeout(typeLoop, 1250);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  }

  setTimeout(typeLoop, deleting ? 48 : 82);
}

typeLoop();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-card")) {
      const progress = entry.target.querySelector(".progress span");
      progress.style.width = `${entry.target.dataset.level}%`;
    }
  });
}, {
  threshold: 0.16
});

revealElements.forEach((element) => revealObserver.observe(element));
skillCards.forEach((card) => revealObserver.observe(card));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-42% 0px -50% 0px"
});

document.querySelectorAll("main section").forEach((section) => {
  sectionObserver.observe(section);
});

function setFieldError(field, message) {
  const error = field.nextElementSibling;
  field.classList.toggle("invalid", Boolean(message));
  field.classList.toggle("valid", !message && field.value.trim().length > 0);
  error.textContent = message;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  let isValid = true;

  formSuccess.textContent = "";

  if (name.value.trim().length < 3) {
    setFieldError(name, "Ingresa un nombre de al menos 3 caracteres.");
    isValid = false;
  } else {
    setFieldError(name, "");
  }

  if (!validateEmail(email.value.trim())) {
    setFieldError(email, "Ingresa un correo válido.");
    isValid = false;
  } else {
    setFieldError(email, "");
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, "El mensaje debe tener al menos 10 caracteres.");
    isValid = false;
  } else {
    setFieldError(message, "");
  }

  if (!isValid) return;

  formSuccess.textContent = "Mensaje validado correctamente. Gracias por contactarme.";
  contactForm.reset();
  contactForm.querySelectorAll(".valid").forEach((field) => field.classList.remove("valid"));
});

contactForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.name === "name") {
      setFieldError(field, field.value.trim().length >= 3 ? "" : "Ingresa un nombre de al menos 3 caracteres.");
    }

    if (field.name === "email") {
      setFieldError(field, validateEmail(field.value.trim()) ? "" : "Ingresa un correo válido.");
    }

    if (field.name === "message") {
      setFieldError(field, field.value.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres.");
    }
  });
});

projectCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = ((0.5 - y / rect.height)) * 7;

    card.style.transform = `translateY(-9px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrame;
const pointer = {
  x: null,
  y: null,
  radius: 165
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createParticles();
}

function createParticles() {
  const count = Math.min(Math.floor(window.innerWidth / 13), 140);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2.1 + 0.8,
    speedX: (Math.random() - 0.5) * 0.55,
    speedY: (Math.random() - 0.5) * 0.55,
    alpha: Math.random() * 0.58 + 0.28
  }));
}

function drawConnections() {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 145) {
        ctx.strokeStyle = `rgba(68, 242, 255, ${0.2 - distance / 760})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function drawPointerConnections() {
  if (pointer.x === null || pointer.y === null) return;

  particles.forEach((particle) => {
    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;
    const distance = Math.hypot(dx, dy);

    if (distance < pointer.radius) {
      const alpha = 0.36 - distance / 460;
      ctx.strokeStyle = `rgba(68, 242, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(pointer.x, pointer.y);
      ctx.stroke();
    }
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

    if (pointer.x !== null && pointer.y !== null) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy);

      if (distance < pointer.radius && distance > 0) {
        const force = (pointer.radius - distance) / pointer.radius;
        particle.x += (dx / distance) * force * 0.42;
        particle.y += (dy / distance) * force * 0.42;
      }
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(68, 242, 255, ${particle.alpha})`;
    ctx.shadowColor = "rgba(68, 242, 255, 0.55)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  drawConnections();
  drawPointerConnections();
  animationFrame = requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});
window.addEventListener("mouseleave", () => {
  pointer.x = null;
  pointer.y = null;
});
resizeCanvas();
animateParticles();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    animateParticles();
  }
});

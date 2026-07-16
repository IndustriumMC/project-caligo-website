document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const closeNavigation = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  nav?.classList.remove("is-open");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav?.classList.toggle("is-open", !isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    closeNavigation();
    navToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (navToggle?.getAttribute("aria-expanded") !== "true") return;
  if (header?.contains(event.target)) return;
  closeNavigation();
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

const headerSentinel = document.querySelector(".header-sentinel");

if (header && headerSentinel && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-scrolled", !entry.isIntersecting && entry.boundingClientRect.top < 0);
  });
  headerObserver.observe(headerSentinel);
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const emailField = contactForm.querySelector("[name='email']");
  const emailWrapper = emailField?.closest(".form-field");
  const emailError = contactForm.querySelector("[data-email-error]");
  const startedAt = contactForm.querySelector("[data-form-started-at]");
  const submitButton = contactForm.querySelector("button[type='submit']");
  const submitLabel = contactForm.querySelector("[data-submit-label]");
  const status = contactForm.querySelector("[data-form-status]");

  const resetStartTime = () => {
    if (startedAt) startedAt.value = String(Date.now());
  };

  const setStatus = (message, state = "") => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  const setSubmitting = (isSubmitting) => {
    contactForm.classList.toggle("is-submitting", isSubmitting);
    if (submitButton) submitButton.disabled = isSubmitting;
    if (submitLabel) submitLabel.textContent = isSubmitting ? "Sending request…" : "Discuss your network";
  };

  const validateEmail = () => {
    const isValid = Boolean(emailField?.validity.valid);
    emailWrapper?.classList.toggle("has-error", !isValid);
    emailField?.setAttribute("aria-invalid", String(!isValid));
    if (emailError) {
      if (isValid) emailError.textContent = "";
      else if (emailField?.validity.valueMissing) emailError.textContent = "Email is required.";
      else emailError.textContent = "Enter an email in name@example.com format.";
    }
    return isValid;
  };

  emailField?.addEventListener("blur", validateEmail);
  emailField?.addEventListener("input", () => {
    if (emailWrapper?.classList.contains("has-error")) validateEmail();
  });

  window.addEventListener("offline", () => {
    setStatus("You’re offline. Your message has not been sent.", "offline");
  });

  window.addEventListener("online", () => {
    if (status?.dataset.state === "offline") setStatus("You’re back online. You can send your request now.");
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    contactForm.classList.remove("is-success");

    if (!validateEmail()) {
      setStatus("Enter a valid email address so we know where to reply.", "error");
      emailField?.focus();
      return;
    }

    if (!navigator.onLine) {
      setStatus("You’re offline. Your message has not been sent.", "offline");
      return;
    }

    setSubmitting(true);
    setStatus("Sending your request…", "submitting");

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn’t send your request.");

      contactForm.reset();
      resetStartTime();
      emailWrapper?.classList.remove("has-error");
      emailField?.setAttribute("aria-invalid", "false");
      contactForm.classList.add("is-success");
      setStatus("Request received. A Caligo team member will reply to you by email.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn’t send your request.";
      setStatus(`${message} You can also email contact@industrium.net.`, "error");
    } finally {
      setSubmitting(false);
    }
  });

  resetStartTime();
}

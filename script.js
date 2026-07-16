document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches) document.documentElement.classList.add("motion-ready");

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

const mobileNavigation = window.matchMedia("(max-width: 820px)");
mobileNavigation.addEventListener?.("change", (event) => {
  if (!event.matches) closeNavigation();
});

const headerSentinel = document.querySelector(".header-sentinel");

if (header && headerSentinel && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-scrolled", !entry.isIntersecting && entry.boundingClientRect.top < 0);
  });
  headerObserver.observe(headerSentinel);
}

const motionTargets = document.querySelectorAll(".continuity-demo, .journey-list, .about-mark");
if (!reducedMotion.matches && motionTargets.length && "IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
        motionObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12%", threshold: 0.28 },
  );
  motionTargets.forEach((target) => motionObserver.observe(target));
}

const sectionLinks = [...(nav?.querySelectorAll("a[href^='#']") ?? [])];
const sectionLinkById = new Map(sectionLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));
const trackedSections = [...sectionLinkById.keys()]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (trackedSections.length) {
  let sectionUpdateFrame = 0;
  const updateCurrentSection = () => {
    sectionUpdateFrame = 0;
    const marker = Math.max(96, window.innerHeight * 0.34);
    const current = trackedSections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= marker && bounds.bottom > marker;
    });
    sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
    if (current) sectionLinkById.get(current.id)?.setAttribute("aria-current", "location");
  };
  const scheduleSectionUpdate = () => {
    if (!sectionUpdateFrame) sectionUpdateFrame = window.requestAnimationFrame(updateCurrentSection);
  };
  window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
  window.addEventListener("resize", scheduleSectionUpdate);
  scheduleSectionUpdate();
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
    if (!reducedMotion.matches && message && status.animate) {
      status.animate(
        [
          { opacity: 0.55, transform: "translateY(4px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 220, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
      );
    }
  };

  const animateInvalidField = () => {
    if (reducedMotion.matches || !emailField?.animate) return;
    emailField.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 220, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
    );
  };

  const setSubmitting = (isSubmitting) => {
    contactForm.classList.toggle("is-submitting", isSubmitting);
    if (submitButton) submitButton.disabled = isSubmitting;
    if (submitLabel) submitLabel.textContent = isSubmitting ? "Sending request..." : "Discuss your network";
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

  emailField?.addEventListener("invalid", (event) => {
    event.preventDefault();
    validateEmail();
    setStatus("Enter a valid email address so we know where to reply.", "error");
    animateInvalidField();
    emailField.focus();
  });

  emailField?.addEventListener("blur", validateEmail);
  emailField?.addEventListener("input", () => {
    if (emailWrapper?.classList.contains("has-error")) validateEmail();
  });

  window.addEventListener("offline", () => {
    setStatus("You're offline. Your message has not been sent.", "offline");
  });

  window.addEventListener("online", () => {
    if (status?.dataset.state === "offline") setStatus("You're back online. You can send your request now.");
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    contactForm.classList.remove("is-success");

    if (!validateEmail()) {
      setStatus("Enter a valid email address so we know where to reply.", "error");
      animateInvalidField();
      emailField?.focus();
      return;
    }

    if (!navigator.onLine) {
      setStatus("You're offline. Your message has not been sent.", "offline");
      return;
    }

    setSubmitting(true);
    setStatus("Sending your request...", "submitting");

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn't send your request.");

      contactForm.reset();
      resetStartTime();
      emailWrapper?.classList.remove("has-error");
      emailField?.setAttribute("aria-invalid", "false");
      contactForm.classList.add("is-success");
      setStatus("Request received. A Caligo team member will reply to you by email.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't send your request.";
      setStatus(`${message} You can also email contact@industrium.net.`, "error");
    } finally {
      setSubmitting(false);
    }
  });

  resetStartTime();
}

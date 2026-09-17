/**
 * White Forest Homes interaction layer.
 * No third-party dependencies are required.
 */
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const body = document.body;
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const yearNodes = document.querySelectorAll("[data-current-year]");

  /** Keep copyright years current without requiring annual edits. */
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const desktopNavigationQuery = window.matchMedia("(min-width: 64rem)");
  const backgroundRegions = document.querySelectorAll("main, .site-footer, [data-cookie-banner]");

  /** Open and close the mobile drawer while keeping its own scroll area usable. */
  function setNavigation(open, { returnFocus = false } = {}) {
    const shouldOpen = open && !desktopNavigationQuery.matches;

    body.classList.toggle("nav-open", shouldOpen);
    document.documentElement.classList.toggle("nav-open", shouldOpen);
    backgroundRegions.forEach((region) => { region.inert = shouldOpen; });
    if (nav) nav.inert = !shouldOpen && !desktopNavigationQuery.matches;
    navToggle?.setAttribute("aria-expanded", String(shouldOpen));
    navToggle?.setAttribute(
      "aria-label",
      shouldOpen ? "Close navigation" : "Open navigation",
    );

    if (shouldOpen && nav) {
      nav.scrollTop = 0;
      nav.querySelector("a")?.focus({ preventScroll: true });
    }

    if (!shouldOpen && returnFocus) {
      navToggle?.focus();
    }
  }

  navToggle?.addEventListener("click", () => {
    setNavigation(!body.classList.contains("nav-open"));
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNavigation(false);
  });

  /** Clicking the shaded page area closes the drawer. */
  document.addEventListener("pointerdown", (event) => {
    if (!body.classList.contains("nav-open")) return;
    if (nav?.contains(event.target) || navToggle?.contains(event.target)) return;
    setNavigation(false, { returnFocus: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setNavigation(false, { returnFocus: true });
    }

    if (event.key === "Tab" && body.classList.contains("nav-open")) {
      const items = [navToggle, ...nav.querySelectorAll("a[href], button:not([disabled])")].filter(Boolean);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /** Remove the mobile scroll lock if the viewport is widened to desktop. */
  desktopNavigationQuery.addEventListener("change", (event) => {
    const focusWasInNavigation = nav?.contains(document.activeElement) || document.activeElement === navToggle;
    setNavigation(false);
    if (focusWasInNavigation) {
      (event.matches ? nav?.querySelector("a") : navToggle)?.focus({ preventScroll: true });
    }
  });
  setNavigation(false);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) setNavigation(false);
  });

  /** Add a subtle header divider after the first few pixels of scrolling. */
  function syncHeaderState() {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  /** Progressive scroll reveal with reduced-motion support. */
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8%",
      threshold: 0,
    });

    revealNodes.forEach((node) => observer.observe(node));
  }

  /** Accessible project filtering on the portfolio page. */
  const filterButtons = document.querySelectorAll("[data-project-filter]");
  const projectTiles = document.querySelectorAll("[data-project-category]");
  const projectCount = document.querySelector("[data-project-count]");

  function applyProjectFilter(category) {
    let visibleCount = 0;

    projectTiles.forEach((tile) => {
      const categories = String(tile.dataset.projectCategory || "")
        .split(" ")
        .filter(Boolean);
      const visible = category === "all" || categories.includes(category);

      tile.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.projectFilter === category),
      );
    });

    if (projectCount) {
      projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyProjectFilter(button.dataset.projectFilter || "all");
    });
  });

  /** Every fragment moves keyboard focus to its actual heading or section. */
  function focusFragment() {
    if (!window.location.hash) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    if (target.closest("[data-project-category]")?.hidden) applyProjectFilter("all");
    target.closest("[data-reveal]")?.classList.add("is-visible");
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }
  window.addEventListener("hashchange", focusFragment);
  window.addEventListener("load", focusFragment, { once: true });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname && destination.hash && destination.hash === location.hash) {
      event.preventDefault();
      focusFragment();
    }
  });

  const inquiryForm = document.querySelector('form[name="project-inquiry"]');
  const previewHost = location.hostname.endsWith(".github.io") || ["localhost", "127.0.0.1"].includes(location.hostname);
  if (inquiryForm) {
    const notice = document.querySelector("[data-inquiry-notice]");
    if (previewHost) {
      if (notice) notice.hidden = false;
      inquiryForm.querySelector('[type="submit"]').textContent = "Prepare email inquiry";
    }
    inquiryForm.addEventListener("submit", (event) => {
      if (previewHost) {
        event.preventDefault();
        const fields = new FormData(inquiryForm);
        const labels = { "first-name": "First name", "last-name": "Last name", email: "Email", phone: "Phone", "property-location": "Property location", "project-type": "Project type", budget: "Approximate investment", timeline: "Target timing", "project-details": "Project details" };
        const message = Object.entries(labels).map(([key, label]) => `${label}: ${fields.get(key) || "Not provided"}`).join("\n");
        const email = document.querySelector('.direct-contact-action[href^="mailto:"]');
        if (email) location.href = `${email.href}?subject=${encodeURIComponent("Project inquiry — White Forest Homes")}&body=${encodeURIComponent(message)}`;
        if (notice) notice.textContent = "Your email app should open with your inquiry. Review it and press Send there. If it does not open, use the email address or phone number in Direct contact.";
      } else {
        try { sessionStorage.setItem("wfh_inquiry_pending", String(Date.now())); } catch { /* Storage is optional. */ }
      }
    });
  }

  /** Fire the lead events only on the successful thank-you page. */
  if (body.dataset.conversionPage === "project-inquiry") {
    const sendTo = window.WFH_TRACKING_CONFIG?.projectInquiryConversion;
    let leadEventSent = false;
    let submittedAt = 0;
    try {
      submittedAt = Number(sessionStorage.getItem("wfh_inquiry_pending"));
      sessionStorage.removeItem("wfh_inquiry_pending");
    } catch { /* Do not count an unverified submission. */ }
    const verifiedSubmission = submittedAt > 0 && Date.now() - submittedAt < 30 * 60 * 1000;

    async function trackLeadOnce() {
      if (leadEventSent || !verifiedSubmission) return;

      const consent = window.WFHAnalytics?.getConsent();
      if (!consent?.analytics && !consent?.advertising) return;

      leadEventSent = true;

      if (consent.analytics) {
        await window.WFHAnalytics?.trackEvent("generate_lead", {
          lead_source: "website_project_inquiry",
        });
      }

      if (consent.advertising) {
        await window.WFHAnalytics?.trackAdsConversion(sendTo, {
          value: 1,
          currency: "CAD",
        });
      }
    }

    document.addEventListener("wfh:consent-updated", trackLeadOnce);

    /** Handle visitors who already had a saved consent choice. */
    window.setTimeout(trackLeadOnce, 650);
  }
})();

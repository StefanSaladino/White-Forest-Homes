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

  /** Open and close the mobile drawer while keeping its own scroll area usable. */
  function setNavigation(open, { returnFocus = false } = {}) {
    const shouldOpen = open && !desktopNavigationQuery.matches;

    body.classList.toggle("nav-open", shouldOpen);
    navToggle?.setAttribute("aria-expanded", String(shouldOpen));
    navToggle?.setAttribute(
      "aria-label",
      shouldOpen ? "Close navigation" : "Open navigation",
    );

    if (shouldOpen && nav) {
      nav.scrollTop = 0;
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
    setNavigation(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setNavigation(false, { returnFocus: true });
    }
  });

  /** Remove the mobile scroll lock if the viewport is widened to desktop. */
  desktopNavigationQuery.addEventListener("change", (event) => {
    if (event.matches) setNavigation(false);
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
      threshold: 0.12,
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

  /** Fire the lead events only on the successful thank-you page. */
  if (body.dataset.conversionPage === "project-inquiry") {
    const sendTo = window.WFH_TRACKING_CONFIG?.projectInquiryConversion;
    let leadEventSent = false;

    async function trackLeadOnce() {
      if (leadEventSent) return;

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

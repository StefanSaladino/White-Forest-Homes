/**
 * White Forest Homes consent manager.
 *
 * Implements a basic, consent-first Google tag setup:
 * - Analytics and advertising storage default to denied.
 * - Google tags are not downloaded until the visitor grants at least one
 *   non-essential category.
 * - Visitors can reopen preferences from the footer at any time.
 *
 * TODO(PROD): Have the final banner wording and retention practices reviewed
 * for the business's actual legal obligations and advertising regions.
 */
(() => {
  "use strict";

  const config = window.WFH_TRACKING_CONFIG || {};
  const storageKey = config.consentStorageKey || "wfh_consent_v1";
  const consentVersion = Number(config.consentVersion || 1);

  const banner = document.querySelector("[data-cookie-banner]");
  const dialog = document.querySelector("[data-cookie-dialog]");
  const analyticsToggle = document.querySelector("[data-consent-analytics]");
  const adsToggle = document.querySelector("[data-consent-advertising]");
  const openButtons = document.querySelectorAll("[data-open-cookie-settings]");

  let googleTagLoadingPromise = null;

  /** Create the Google command queue before any tag is loaded. */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  /** Consent Mode v2 default state. */
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  /**
   * Determine whether a configured Google ID is safe to load.
   * Placeholder values intentionally no-op in development.
   */
  function isConfiguredId(value, prefix) {
    return typeof value === "string"
      && value.startsWith(prefix)
      && !value.includes("X");
  }

  function normalizeConsent(value) {
    return {
      version: consentVersion,
      analytics: Boolean(value?.analytics),
      advertising: Boolean(value?.advertising),
      updatedAt: typeof value?.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    };
  }

  function readConsent() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (Number(parsed?.version) !== consentVersion) return null;

      return normalizeConsent(parsed);
    } catch (error) {
      console.warn("Unable to read saved cookie preferences.", error);
      return null;
    }
  }

  function saveConsent(consent) {
    const normalized = normalizeConsent({
      ...consent,
      updatedAt: new Date().toISOString(),
    });

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(normalized));
    } catch (error) {
      console.warn("Unable to save cookie preferences.", error);
    }

    return normalized;
  }

  function updateGoogleConsent(consent) {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.advertising ? "granted" : "denied",
      ad_user_data: consent.advertising ? "granted" : "denied",
      ad_personalization: consent.advertising ? "granted" : "denied",
    });
  }

  function primaryGoogleId() {
    if (isConfiguredId(config.ga4MeasurementId, "G-")) {
      return config.ga4MeasurementId;
    }

    if (isConfiguredId(config.googleAdsId, "AW-")) {
      return config.googleAdsId;
    }

    return null;
  }

  /** Load and configure Google's shared tag only after consent. */
  function loadGoogleTag(consent) {
    const primaryId = primaryGoogleId();
    if (!primaryId || (!consent.analytics && !consent.advertising)) {
      return Promise.resolve(false);
    }

    if (googleTagLoadingPromise) return googleTagLoadingPromise;

    googleTagLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`;
      script.onload = () => {
        window.gtag("js", new Date());

        if (isConfiguredId(config.ga4MeasurementId, "G-")) {
          window.gtag("config", config.ga4MeasurementId, {
            send_page_view: consent.analytics,
          });
        }

        if (isConfiguredId(config.googleAdsId, "AW-") && consent.advertising) {
          window.gtag("config", config.googleAdsId);
        }

        resolve(true);
      };
      script.onerror = () => reject(new Error("Google tag failed to load."));
      document.head.appendChild(script);
    }).catch((error) => {
      console.warn(error.message);
      googleTagLoadingPromise = null;
      return false;
    });

    return googleTagLoadingPromise;
  }

  function syncControls(consent) {
    if (analyticsToggle) analyticsToggle.checked = consent.analytics;
    if (adsToggle) adsToggle.checked = consent.advertising;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function openDialog() {
    if (!dialog) return;

    syncControls(readConsent() || { analytics: false, advertising: false });
    document.body.classList.add("modal-open");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog() {
    if (!dialog) return;

    document.body.classList.remove("modal-open");

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  async function applyConsent(value, options = {}) {
    const consent = options.persist === false
      ? normalizeConsent(value)
      : saveConsent(value);

    syncControls(consent);
    updateGoogleConsent(consent);
    hideBanner();
    closeDialog();

    if (consent.analytics || consent.advertising) {
      await loadGoogleTag(consent);
    }

    document.dispatchEvent(new CustomEvent("wfh:consent-updated", {
      detail: consent,
    }));

    return consent;
  }

  /** Public measurement helpers used by the thank-you page and future forms. */
  window.WFHAnalytics = Object.freeze({
    getConsent: () => readConsent(),

    async trackEvent(name, parameters = {}) {
      const consent = readConsent();
      if (!consent?.analytics) return false;

      await loadGoogleTag(consent);
      window.gtag("event", name, parameters);
      return true;
    },

    async trackAdsConversion(sendTo, parameters = {}) {
      const consent = readConsent();
      if (!consent?.advertising || !isConfiguredId(sendTo, "AW-")) return false;

      await loadGoogleTag(consent);
      window.gtag("event", "conversion", {
        send_to: sendTo,
        ...parameters,
      });
      return true;
    },
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-consent-action]");
    if (!target) return;

    const action = target.dataset.consentAction;

    if (action === "accept") {
      applyConsent({ analytics: true, advertising: true });
    }

    if (action === "reject") {
      applyConsent({ analytics: false, advertising: false });
    }

    if (action === "manage") {
      openDialog();
    }

    if (action === "save") {
      applyConsent({
        analytics: Boolean(analyticsToggle?.checked),
        advertising: Boolean(adsToggle?.checked),
      });
    }

    if (action === "close") {
      closeDialog();
    }
  });

  openButtons.forEach((button) => {
    button.addEventListener("click", openDialog);
  });

  dialog?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
  });

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  /** Initialize from a saved choice or surface the banner. */
  const savedConsent = readConsent();
  if (savedConsent) {
    applyConsent(savedConsent, { persist: false });
  } else {
    showBanner();
  }
})();

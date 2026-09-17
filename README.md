# White Forest Homes Redesign

A complete mobile-first static website with no runtime dependencies for White Forest Homes. The design translates the approved editorial Muskoka concept into production-oriented HTML, CSS and JavaScript with local temporary imagery, structured SEO data, a privacy page, a consent preference centre and Google measurement hooks.

## Important status

The current photography and portfolio content are **concept placeholders**, not completed White Forest Homes projects. The code deliberately labels them as concept previews and includes production TODOs throughout. Review [`TODO-PRODUCTION.md`](TODO-PRODUCTION.md) before publishing.

## Pages

- `index.html` — homepage
- `projects.html` — filterable portfolio preview
- `services.html` — services overview
- `custom-homes.html`
- `renovations-additions.html`
- `kitchens-interiors.html`
- `outdoor-living.html`
- `process.html`
- `about.html`
- `contact.html` — Netlify-ready project inquiry form
- `privacy.html` — privacy/cookie starter policy
- `thank-you.html` — noindex conversion page
- `404.html` — noindex error page

## Technical approach

- Mobile-first responsive CSS with no framework
- Role-based CSS source files compiled into one stable production bundle
- Semantic HTML and accessible navigation/forms/dialogs
- Local WebP image variants with width/height attributes and lazy loading
- Page-specific titles, descriptions, canonicals and social metadata
- `GeneralContractor`, `Service`, `BreadcrumbList`, `FAQPage`, `WebSite` and page-level JSON-LD
- `robots.txt`, `sitemap.xml`, `llms.txt` and web manifest
- Netlify redirects, security headers and form markup
- Basic Google Consent Mode v2 implementation
- Optional Google Analytics and Google Ads tags blocked until visitor consent
- No runtime dependencies; the optional CSS build step uses Node.js only

## Local preview

From the project root:

```bash
npm run serve
```

Open `http://localhost:8080`.

## CSS workflow

Every HTML page now loads the role-based files under `assets/css/src/` directly and in the exact cascade order documented in `assets/css/README.md`. Edit the file responsible for the relevant role instead of editing the generated compatibility bundle.

The optional bundle commands remain available for deployment experiments or comparison checks:

```bash
npm run build:css
npm run check:css
```

`npm run validate` also confirms that every page uses the complete modular stylesheet list in the correct order and does not reference the old monolithic bundle.

## Validation

```bash
npm run check:css
npm run check:js
npm run validate
npm run check:todos
```

`npm run validate` checks internal links and fragments (including SVG symbols), responsive-image references, duplicate IDs/titles/canonicals, accessible names and references, metadata, JSON-LD, CSP-incompatible inline styles, and manifest paths.

For the responsive and interaction regression suite:

```bash
npm ci
npx playwright install chromium
npm run test:browser
# Optional screenshots of the main layouts:
npm run test:browser -- --screenshots
```

The browser suite covers 13 pages at 13 viewport sizes, axe accessibility checks, menus, focus, anchors, filters, cookie preferences, form validation, no-JavaScript navigation and nested 404 routes. It starts its own local test server. Results are written to the ignored `.audit-results/` directory. A locally installed Chromium executable can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

See [AUDIT.md](AUDIT.md) for the verified scope and remaining production dependencies.

## Google Analytics and Google Ads setup

Edit `assets/js/tracking-config.v2.js`:

```js
window.WFH_TRACKING_CONFIG = Object.freeze({
  ga4MeasurementId: "G-XXXXXXXXXX",
  googleAdsId: "AW-XXXXXXXXXX",
  projectInquiryConversion: "AW-XXXXXXXXXX/XXXXXXXXXXXX",
  consentStorageKey: "wfh_consent_v1",
  consentVersion: 1,
});
```

Replace the placeholders only after the production GA4 property and Google Ads conversion are ready. The included implementation uses **basic consent mode**: no Google tag is downloaded until a visitor grants analytics or advertising consent.

Do not also deploy the same tags through Google Tag Manager unless the direct-tag implementation is removed.

## Form setup

The contact form uses Netlify Forms markup:

```html
<form
  name="project-inquiry"
  method="POST"
  action="thank-you.html"
  data-netlify="true"
  netlify-honeypot="company-website"
>
```

On GitHub Pages and localhost, the submit button reads “Prepare email inquiry”: it opens a populated email draft, which the visitor must send in their email app. It does not claim a server submission succeeded. On other hosts, the existing Netlify POST remains in place. After the first Netlify deploy, configure form notifications and complete an end-to-end test. Other production hosts require a form handler.

The thank-you page only attempts lead events after a recent form submission marker in the same browser tab; direct visits and reloads are not counted. Google IDs remain placeholders.

## Asset replacement

Illustrative stock photography is stored in `assets/images/photos/`. See [PHOTO-CREDITS.md](PHOTO-CREDITS.md) for sources and regeneration instructions. When real project photography arrives:

1. Generate responsive WebP variants from full-resolution originals using `scripts/build-photos.mjs` and the source manifest.
2. Use new filenames when changing photographs, then update each HTML `src`/`srcset` reference to avoid stale immutable caches.
3. Preserve accurate intrinsic `width` and `height` attributes.
4. Rewrite the alt text to describe the real image.
5. Replace the Open Graph image with a final 1200×630 JPG.

## Cache/versioning

The modular CSS links use a shared query version such as `?v=3`, while JavaScript uses versioned filenames such as `script.v2.js`. When CSS changes are deployed, increment the CSS query version in every HTML page so Netlify's immutable asset cache receives a new URL. Increment JavaScript filenames when those assets change.

## Current public details used

- Phone: `1-705-970-6325`
- Email: `Whiteforesthomes@hotmail.com`
- Location: Huntsville, Muskoka
- Instagram: `https://www.instagram.com/the_white_forests/`

These must be reconfirmed before production.

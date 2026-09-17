# Responsive, navigation and accessibility audit

Completed September 17, 2026, against the repository starting at `332d9c0`.

## What was fixed

- Restored the intended configuration → consent → interaction script order. The original files contained the wrong modules and referenced a missing consent file. Versioned URLs prevent stale cached JavaScript and CSS.
- Replaced the duplicated custom-home content on the renovations route, including its title, canonical URL, structured data, imagery and FAQ.
- Added matching project-heading destinations for homepage portfolio links. Inquiry calls to action now land at the form heading. Fragment navigation accounts for the sticky header and transfers keyboard focus to its destination.
- Named service-card links through their own headings. Checked all internal anchor destinations, accessibility references, image variants and SVG symbols.
- Adjusted interior hero typography and cropping, tablet contact/service layouts, desktop service columns, narrow-screen wrapping, footer columns, filter controls and image alignment. Corrected three intrinsic image dimensions and eager-load priorities for service hero images.
- Added mobile-menu keyboard containment, background isolation, Escape/focus restoration, resize cleanup and a scrollable drawer. Navigation remains available when JavaScript is disabled.
- Improved muted-text contrast, focus indicators, touch-target sizes and button hover contrast. Added explicit cookie-switch labels and usable short-screen dialog/banner scrolling.
- Fixed cookie-switch pointer interception, storage-unavailable handling and asynchronous consent configuration. Categories can be granted independently after the shared tag loads; withdrawn consent blocks subsequent helper events.
- Added an explicit email-draft flow on GitHub Pages/localhost because those static previews do not process Netlify Forms. The visitor must send the prepared message in their email app. The existing POST remains for production form hosting.
- Prevented direct visits and reloads of the thank-you page from counting as new leads.
- Corrected manifest paths for project-subdirectory hosting and nested 404 navigation. Extended the homepage's existing GitHub-hosted social-image URL to the other pages. Removed inline styles that conflicted with the supplied CSP.
- Repaired the documented CSS commands, made filesystem paths portable, and added reproducible browser checks.

## Verification

The browser suite uses Chromium and axe-core. It tests all 13 HTML pages at these viewport sizes:

`320×568`, `360×640`, `390×844`, `430×932`, `568×320`, `667×375`, `672×900`, `768×1024`, `1024×768`, `1280×800`, `1440×900`, `1920×1080`, `2560×1440`.

- 169 layout cases: horizontal bounds and heading overflow.
- 26 automated accessibility scans: each page at 390px and 1440px, plus a separate cookie-dialog scan.
- 13 interaction groups: mobile focus and scrolling, desktop resize, consent persistence and withdrawal, heading destinations, portfolio links and filters, FAQs, required fields, direct thank-you visits, no-JavaScript navigation, disabled browser storage, mocked measurement loading, and nested 404 paths.
- Static checks: 431 anchor elements checked for names/destinations, all internal links/fragments, source references, responsive images, duplicate IDs/titles/canonicals, accessible link names, required metadata, JSON-LD, manifest paths and stylesheet order.
- JavaScript syntax, generated CSS consistency and whitespace checks.
- Visual inspection of the main desktop, tablet and mobile layouts. Images were loaded by scrolling before capturing the final screenshots.

Final result: all checks passed, with zero horizontal-overflow cases, zero reported axe violations, and zero page/asset errors in the viewport sweep.

Run the commands documented in `README.md`. Browser output is stored in `.audit-results/` and is intentionally ignored by git.

## Boundaries and remaining production work

- These are Chromium viewport simulations, not physical iPhone/iPad/Safari or Firefox certification. Automated accessibility checks supplement, rather than replace, human assistive-technology testing.
- Instagram's live external availability could not be verified by the available public fetch service. Its existing account URL is retained. Phone/email destinations were checked for consistency, not by placing calls or sending messages.
- No inquiry was sent to the business. Production Netlify delivery, notification settings and spam handling still require a real deployment test. Other production hosts need their own form endpoint. The preview email flow depends on the visitor having an email handler.
- Google IDs remain placeholders. Measurement behavior was tested using local mocks; no production Google Analytics/Ads configuration or live conversion delivery is claimed.
- Existing concept photography and project labels remain concept material. The production content and business approvals already listed in `TODO-PRODUCTION.md` still apply.
- Production canonicals remain on the intended business domain. Social images use the GitHub preview asset URL; update those when the production asset domain is ready.

## Photography refresh — 2026-09-17

Replaced all 35 in-page photographic placements with nine high-resolution Pexels originals, exported as 40 local responsive WebP assets. The originals range from 2560 to 6164 pixels wide. The homepage includes a separate portrait crop for small screens; planning, kitchen, renovation, deck and contact sections now use images matched to their content. Source credits and regeneration details are in `PHOTO-CREDITS.md`.

Removed the superseded soft WebP variants. Updated alternative text, intrinsic dimensions and responsive sources; new asset URLs avoid stale caches. Preserved the sharp branded social card and vector identity. Fixed the homepage photo-strip picture containers so all three images fill their tiles evenly; bumped CSS cache versions to 3.

Validation: the photography replacement passed the existing 169 viewport cases, 26 page accessibility scans and 13 interaction groups with no reported failures. After the photo-strip adjustment, a focused pass checked 24 page/viewport combinations at 2× device scale, decoded every displayed photo, verified all 40 exported image dimensions, and confirmed aligned desktop photo-strip heights. Reviewed mobile and desktop hero and gallery screenshots. Static site validation and whitespace checks passed.

# CSS architecture

Every HTML page loads the role-based files under `assets/css/src/` directly. The link order is intentional and matches the original monolithic cascade, so do not reorder it without visual regression testing.

## Responsibilities

- `tokens.css` — brand tokens, typography stacks, spacing constants and shared variables.
- `base/foundations.css` — reset, box sizing and element foundations.
- `base/global.css` — shared layout, typography, buttons and global utilities.
- `components/navigation.css` — header, desktop navigation and mobile drawer.
- `components/heroes.css` — homepage and interior-page hero treatments.
- `pages/home.css` — homepage sections and homepage card layouts.
- `pages/projects.css` — project filters, project tiles and case-study layouts.
- `pages/services.css` — service listing and service-detail layouts.
- `pages/process-about.css` — process timeline, values and service-area content.
- `pages/contact.css` — form and direct-contact panel.
- `components/cta-footer.css` — global call-to-action and footer.
- `components/consent.css` — cookie banner and preference dialog.
- `pages/utility-pages.css` — privacy, thank-you and 404 layouts.
- `components/animations.css` — reveal and motion behaviour.
- `responsive/tablet.css` — tablet overrides.
- `responsive/desktop.css` — desktop overrides and desktop-only utilities.

## Required HTML order

```html
<link rel="stylesheet" href="assets/css/src/tokens.css?v=1">
<link rel="stylesheet" href="assets/css/src/base/foundations.css?v=1">
<link rel="stylesheet" href="assets/css/src/base/global.css?v=1">
<link rel="stylesheet" href="assets/css/src/components/navigation.css?v=1">
<link rel="stylesheet" href="assets/css/src/components/heroes.css?v=1">
<link rel="stylesheet" href="assets/css/src/pages/home.css?v=1">
<link rel="stylesheet" href="assets/css/src/pages/projects.css?v=1">
<link rel="stylesheet" href="assets/css/src/pages/services.css?v=1">
<link rel="stylesheet" href="assets/css/src/pages/process-about.css?v=1">
<link rel="stylesheet" href="assets/css/src/pages/contact.css?v=1">
<link rel="stylesheet" href="assets/css/src/components/cta-footer.css?v=1">
<link rel="stylesheet" href="assets/css/src/components/consent.css?v=1">
<link rel="stylesheet" href="assets/css/src/pages/utility-pages.css?v=1">
<link rel="stylesheet" href="assets/css/src/components/animations.css?v=1">
<link rel="stylesheet" href="assets/css/src/responsive/tablet.css?v=1">
<link rel="stylesheet" href="assets/css/src/responsive/desktop.css?v=1">
```

All pages currently load the full ordered list to guarantee that the rendered cascade remains identical to the previous bundle. Browser caching prevents repeat downloads as visitors move between pages.

## Optional compatibility bundle

The old `assets/css/styles.v1.css` file is retained as a generated compatibility artifact, but no page references it.

```bash
npm run build:css
npm run check:css
```

After changing modular CSS, increment the shared `?v=` value in all HTML files before deployment so immutable asset caching does not serve stale CSS.

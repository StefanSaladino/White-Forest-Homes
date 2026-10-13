# Photo and social update

This full site package is based on GitHub main at 8e7168e. It retains the reviewed site and includes:
- 14 unique real work photos with descriptive names, plus responsive sizes, directly in assets/images.
- Removal of obsolete stock photographs and nested photo directories.
- A real-work 1200 × 630 branded JPG sharing card, editable SVG source and updated social metadata on every page.
- An opaque cream header whenever the burger menu is open, with a refreshed CSS version.

When applying this package to an existing checkout, replace assets/images entirely with the folder in this ZIP. Overlaying alone will leave obsolete images on disk. Pull GitHub updates before applying the package. No push has been made by the assistant.

Run npm run validate, npm run check:js and npm run check:css. Browser visual testing remains a local check.

Menu correction: fixed opaque header, full-width opaque menu, surface opacity animation removed. Navigation CSS v5 and interaction script cache version v3. Verify opening while scrolled, closing with Escape/X, scroll lock and desktop resize locally.

Polish: phone, email and Instagram line icons in every mobile menu; brief hero-copy entrance; small scroll reveals on selected section headings and copy; subtle service-arrow and contact-icon hover motion. All added movement respects reduced-motion preferences.

Photo viewer: every gallery photograph and its full-photo text link opens an on-page dialog, with keyboard Escape, close button and returned focus. Hover adds 2.5% zoom and 8% grayscale on devices supporting hover; reduced-motion users see no effect. Native image links remain available without JavaScript.

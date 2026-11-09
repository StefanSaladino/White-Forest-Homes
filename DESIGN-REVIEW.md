# Homepage, Process and About review

Branch: `design/homepage-process-about-review`

This review is based on main commit `7e2e5a928ee0616853ac9ca9a56e46a69bd3a762`.
It is intended for branch inspection, not a production release or merge.

## Changes

- Homepage introduces the company with the supplied "Make more of your home" copy.
- Four service options: Renovations, Additions, Custom Homes and Custom Carpentry.
- Services overview, footer navigation, inquiry options and the homepage service catalog use the same categories. Existing kitchen service and project URLs remain available.
- Featured work is presented as four large, staggered project features with supporting detail photos, rather than a gallery grid.
- Homepage process section and the complete four-stage Process page use the supplied copy.
- About page introduces Danny Jenkins and includes the complete supplied biography and craftsmanship copy.
- More existing client photographs appear on these pages; clickable photographs keep the accessible full-size viewer and restrained hover treatment.
- Updated page-specific metadata, generated CSS bundle and stylesheet validation.
- Seven supplied addition and carpentry photographs now appear in the portfolio with two new filters. Selected photos also appear on Home, Services, Renovations & Additions and Process.

- The Projects page presents three featured case studies, each with two photographs. Each case study opens with a project introduction and overview, followed by photos grouped into room sections. The church case study credits the full renovation, and the whole-home case study shows the two washrooms separately. Existing project URLs remain available.

## Awaiting supplied assets

- Danny Jenkins's portrait: the About page currently shows a clearly captioned custom-home staircase photo in its media position. Replace that figure, including alt text and caption, after the portrait arrives. No generic or generated portrait is used.

## Verification

- `npm run validate`: all 15 HTML files passed internal links, fragments, image references, SEO metadata, heading counts, accessible reference targets, JSON-LD and project attribution checks.
- `npm run check:js`: passed.
- `npm run check:css`: passed after `npm run build:css`.
- Chrome responsive-frame checks for Home, About, Process and Services at viewport widths 320, 390, 768, 1024 and 1280 pixels: no settled horizontal overflow or overflowing headings in 20 cases. This checks responsive CSS in browser frames; it is not a physical-device or Safari test.
- Manually inspected phone, tablet and desktop compositions. Verified mobile menu/header, photo expansion/close, cookie preferences/save, and Custom Carpentry inquiry preselection.
- The existing full browser-audit script contains obsolete project-card/filter assertions from before the real-work redesign; it was not used as evidence for this branch.
- Existing production setup items (tracking IDs, real form delivery, custom-domain URLs) remain in `TODO-PRODUCTION.md` and are outside this presentation update.

## Local inspection

Run `npm run serve` and open `http://localhost:8080/`.
Inspect `index.html`, `services.html`, `process.html` and `about.html`.
The local responsive-review harness and preview output are not committed.

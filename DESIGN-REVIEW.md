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

- The spacing review added client work alongside the homepage and About introductions, service descriptions, and the construction and completion steps. Service detail pages now keep case-study links beside their corresponding photos and end with the inquiry CTA. Galleries display the full image proportions, and case studies keep their separate room sections.

- All seven photos in the second retouched batch are visible under the gallery’s "More work" filter. The snowy blue house appears beside the homepage and Services introductions. Generic placements of the original staircase and white kitchen have each dropped from seven to four; their named case studies retain the correct photographs.

## Awaiting supplied assets

- Danny Jenkins's portrait: the About page currently shows a clearly captioned custom-home staircase photo in its media position. Replace that figure, including alt text and caption, after the portrait arrives. No generic or generated portrait is used.

## Viewport audit — 10 November 2026

All 15 HTML pages were checked at 15 viewport sizes (225 page/viewport combinations), including narrow phones, short landscape screens, tablets, the 1024px navigation breakpoint and wide desktops.

| Coverage | Viewport sizes (CSS pixels) |
| --- | --- |
| Phones | 320×568, 360×640, 390×844, 430×932 |
| Landscape phones | 568×320, 667×375 |
| Tablets and breakpoints | 672×900, 768×1024, 820×1180, 1023×768, 1024×768 |
| Desktops | 1280×800, 1440×900, 1920×1080, 2560×1440 |

### Fixes from this audit

- Replaced 53 decorative text arrows with SVG icons. The system font in the audit browser rendered some diagonal arrows as missing-glyph boxes. Arrow direction and accessible link names are preserved.
- Disabled the mobile drawer transition for inline desktop navigation. Resizing across 1024px previously caused a brief horizontal spill while the drawer transform interpolated; the desktop menu now takes its final position immediately.

### Results

- Full-page scroll passes and geometry checks found no remaining horizontal overflow, clipped text, unintended text/image overlap or image distortion. The complete viewport matrix was checked again after the fixes for overflow, text clipping and misplaced elements.
- All 114 WebP assets decoded successfully. The full Projects gallery loaded all 45 main-content images without broken or pending images in its tablet loading check.
- Mobile navigation checked at six sizes, including both short landscape sizes: solid background, reachable contact links, keyboard focus wrapping, Escape and focus return. Opening at 1023px and resizing to 1024px correctly restores page scrolling and removes background inertness.
- Cookie preferences checked at 320×568, 568×320, 667×375 and 1280×800: optional categories toggle independently, saved values persist on reopening, rejection closes the dialog and releases the scroll lock. Switches retain their 48×26px shape; dialog actions remain reachable by scrolling on short screens.
- Photo expansion checked at the same four sizes: images load with `object-fit: contain`, the close control is available, Escape closes the viewer and focus returns to the original photo link.
- All seven gallery filters return the expected counts at phone and wide-desktop sizes: 38 total, 11 church, 7 custom home, 6 full-house, 3 additions, 4 carpentry and 7 more work.
- Inquiry form checked for required fields, malformed-email validation and valid field states without sending an inquiry. It uses one column on a narrow phone and two on desktop. Service links correctly preselect Renovation and Custom Carpentry and focus the inquiry heading. FAQ disclosures work with the keyboard.
- Visually reviewed phone, tablet and desktop compositions, photo framing, captions and the new snowy-house placement. No site-origin JavaScript errors were observed.
- `npm run validate`: all 15 HTML files passed internal links, fragments, image references, SEO metadata, heading counts, accessible reference targets, JSON-LD and project attribution checks.
- `npm run check:js`, `npm run check:css` and `git diff --check`: passed.

This is a Chrome responsive-frame audit, not verification on physical devices or Safari. The existing full browser-audit script contains obsolete project-card/filter assertions and was not used as evidence for this branch. Existing production setup items (tracking IDs, real form delivery, custom-domain URLs) remain in `TODO-PRODUCTION.md`.

## Follow-up mobile photo review

The screenshot review caught a visual problem the earlier overflow checks did not: the homepage staircase and washroom used desktop-style percentage widths on phones. Both now fill the content column below 672px.

The site-wide follow-up also corrected cramped photo pairs on Projects and the renovation/kitchen service pages, indented service photos, and portrait-photo width caps that left empty space on landscape phones. Photos stack in one column on phones; paired and inset compositions begin at their tablet/desktop breakpoints. Responsive image `sizes` values were updated to match the new display widths.

Verified all 111 main-content photo placements across all 15 pages at 11 sizes: 320×568, 360×640, 390×844, 430×932, 568×320, 667×375, 671×900, 672×900, 768×1024, 1024×768 and 1440×900 (165 page/viewport checks). No remaining undersized or off-centre mobile photos, image distortion, caption overflow or page overflow were found in those checks. Both originally flagged photos were visually inspected at 390×844 and their expand/close interactions were verified. Static site validation and the CSS bundle check passed.

## Local inspection

Run `npm run serve` and open `http://localhost:8080/`.
Inspect `index.html`, `services.html`, `process.html` and `about.html`.
The local responsive-review harness and preview output are not committed.

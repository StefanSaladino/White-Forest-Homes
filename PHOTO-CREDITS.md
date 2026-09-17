# Photography credits and usage

Updated 2026-09-17. These are illustrative stock photographs, not completed White Forest Homes projects. The portfolio preview labels and existing fragment URLs remain in place.

All replacements come from Pexels. License: https://www.pexels.com/license/. Originals were downloaded before generating local responsive WebP variants; the site does not hotlink photos or contact Pexels.

| Asset | Photographer | Pexels photo ID | Original download |
| --- | --- | --- | --- |
| woodland-home | Kevin Yung | 35264654 | [Original](https://images.pexels.com/photos/35264654/pexels-photo-35264654.jpeg) |
| winter-home | Chris F | 11616132 | [Original](https://images.pexels.com/photos/11616132/pexels-photo-11616132.jpeg) |
| kitchen-island | Curtis Adams | 4800189 | [Original](https://images.pexels.com/photos/4800189/pexels-photo-4800189.jpeg) |
| timber-cabins | Helen1 | 34923424 | [Original](https://images.pexels.com/photos/34923424/pexels-photo-34923424.jpeg) |
| open-plan-renovation | Curtis Adams | 4800185 | [Original](https://images.pexels.com/photos/4800185/pexels-photo-4800185.jpeg) |
| lakeside-deck | Arthur Shuraev | 19402460 | [Original](https://images.pexels.com/photos/19402460/pexels-photo-19402460.jpeg) |
| modern-living | Viaceslav Kat | 1571460 | [Original](https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg) |
| waterfront-seating | Zak Mogel | 38282488 | [Original](https://images.pexels.com/photos/38282488/pexels-photo-38282488.jpeg) |
| project-planning | Marina Zvada | 34573691 | [Original](https://images.pexels.com/photos/34573691/pexels-photo-34573691.jpeg) |

## Placement

- Woodland cabin: homepage hero, services/about imagery, and closing banners.
- Winter home and timber cabins: custom-home and cottage previews.
- Kitchen island: Kitchens & Interiors and its preview card.
- Open-plan interior: Renovations & Additions and its preview card.
- Living room: projects/privacy heroes and the interior preview.
- Timber deck: Outdoor Living and its preview.
- Waterfront seating: contact hero.
- Architectural drawings: process hero and approach sections.

## Responsive assets

Source manifest: `scripts/photo-sources.json`. Run `node scripts/build-photos.mjs /path/to/originals` with sharp installed as an authoring tool. Save originals as `<Pexels ID>-original.jpg`. The generator rejects dimensions that would upscale the source.

The full-width hero has landscape variants up to 3200px and a separate 2:3 mobile crop. Other photos use 4:3 or portrait exports appropriate to their slots. All exports use WebP quality 85, accurate intrinsic dimensions, and new filenames to avoid stale immutable caches. Below-the-fold images remain lazy-loaded.

The existing branded social card remains: its text and artwork are already clear at the intended 1200×630 share size. SVG logos and icons remain resolution-independent.

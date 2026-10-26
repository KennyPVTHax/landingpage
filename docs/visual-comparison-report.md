# Visual comparison report

Reference: https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN; initial capture 2026-10-23T15:34:26.363Z; browser Chromium 156.0.8078.4. All comparisons use matching width/height, DPR1, light color scheme, en-IN browser locale, loaded fonts/images and top scroll position. Pixelmatch8, threshold0.1, includeAA=false (anti-aliased edge pixels excluded by the library). No region masks. Mismatch percentage is **not a perceived design accuracy or similarity score**. No100% equivalence claim.

## Equal-viewport hero measurements

| Viewport | Mismatch pixels | Mismatch % |
| --- | ---: | ---: |
| 1920×1080 | 25017 | 1.206 |
| 1440×900 | 14509 | 1.12 |
| 1366×768 | 10760 | 1.026 |
| 1280×800 | 11412 | 1.114 |
| 1024×768 | 15033 | 1.912 |
| 768×1024 | 12034 | 1.53 |
| 430×932 | 11249 | 2.807 |
| 390×844 | 9923 | 3.015 |
| 375×812 | 8798 | 2.889 |
| 360×800 | 8738 | 3.034 |
| 600×800 | 7285 | 1.518 |
| 601×800 | 7218 | 1.501 |
| 839×900 | 7036 | 0.932 |
| 840×900 | 19378 | 2.563 |
| 960×900 | 16626 | 1.924 |

## Lower sections, independently aligned

Each pair starts12px above its own section heading. These crops intentionally remove accumulated page shifts and must not be described as full-page equivalence. They use equal crop dimensions and no stretching or masks.

| Width | Section | Crop | Mismatch pixels | Mismatch % |
| --- | --- | --- | ---: | ---: |
| 1440 | about | 860×320 | 5133 | 1.865 |
| 1440 | safety | 860×400 | 11581 | 3.367 |
| 1440 | reviews | 860×1400 | 70504 | 5.856 |
| 390 | about | 342×350 | 3666 | 3.063 |
| 390 | safety | 342×560 | 16332 | 8.528 |
| 390 | reviews | 342×1900 | 61290 | 9.432 |

## Reviewable artifacts

- [Desktop side by side](../artifacts/diffs/side-by-side-1440.png), [phone side by side](../artifacts/diffs/side-by-side-390.png).
- [Desktop overlay](../artifacts/diffs/overlay-1440.png), [phone overlay](../artifacts/diffs/overlay-390.png).
- Hero heatmaps: ../artifacts/diffs/diff-WIDTH-hero.png.
- Section heatmaps: ../artifacts/diffs/diff-WIDTH-about.png, -safety.png and -reviews.png.
- Genuine full-page views: ../artifacts/reference/reference-1440-full.png and reference-390-full.png; corresponding local-1440-full.png and local-390-full.png.
- JSON measurements: ../artifacts/reports/visual.json and sections.json.

Human inspection covered representative desktop/phone hero and full pages, tablet geometry, About, and lower section crops. Iteration corrected overall composition first, then hero geometry, assets, paragraph tracking/clipping and review response layout.

## Remaining differences

Header wordmark text and some icon glyphs are approximate. Review/header/card spacing, button widths and star treatment differ. Mobile Data safety and reviews exceed the suggested5% stretch target. One later reference helpfulness count changed170→171; the local snapshot deliberately retains the initial170, without masking the region. Modal layout differs despite functional keyboard parity. Tablet reviews open the official listing; full data safety uses the official page; trailer opens its genuine video. The footer adds a local-study notice. Full pages have residual vertical shifts and mobile related/support ordering differences. Full-page pixel equivalence and interactive-state parity were not certified.

Regenerate hero captures with npm run capture:local (while dev server5173 runs), then npm run test:visual. Section re-capture requires network and node scripts/compare-sections.mjs. Existing reference captures are the reproducible frozen baseline; live Google experiments/content may change.

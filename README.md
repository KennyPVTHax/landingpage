# mparivahan-playstore-landing

A responsive React reconstruction of the public [NextGen mParivahan Google Play listing](https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN), captured on **23 October 2026**. Private local UI study only. No affiliation with Google, National Informatics Centre, or the Government of India. **Do not deploy or publish this replica.** This repository stores reviewable source and evidence; no hosting or deployment configuration is included.

## Run locally

Node 24 LTS was used (Node 22.20+ is also compatible with the declared tools). From this project root:

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open the loopback address printed by Vite, normally http://127.0.0.1:5173/. This is a local development address, not a public preview. The app uses locally saved assets and needs no backend, login, API key, or runtime network access to render. External navigation intentionally goes to the original public services.

## Build and verify

```sh
npm run typecheck
npm run build
npm run test:e2e
npm run dev -- --port 5173
# In a second terminal:
npm run capture:local
npm run test:visual
node scripts/compare-sections.mjs
```

The E2E suite starts a production preview on port 4173 using the existing build. Close any conflicting server or set CI=1 to require a fresh test server. Headless Chromium is the verified browser. Linux users may need the normal Playwright runtime dependency installer: npx playwright install --with-deps chromium.

**Verified:** production build; 28 passing Playwright tests; 15 equal-viewport hero comparisons and 6 independently aligned section comparisons. See [test results](docs/test-results.md) and [visual comparison report](docs/visual-comparison-report.md). This is not pixel-equivalent to Google Play.

## Behavior

Install, wishlist and account controls open the genuine listing. Share uses Web Share or copies the original listing URL, with a selectable fallback when denied. Screenshots support arrows, native touch scrolling, keyboard navigation and a full-resolution lightbox. About and the frozen reviews open local dialogs; App support expands inline. Data safety and Tablet reviews open the official pages. Review helpfulness is session-local and explicitly identified as a demo. No credentials, OTPs, installation, Google-account writes, or government records are handled.

## Files and reproducibility

- src/: semantic React components, custom CSS, dated listing snapshot.
- public/assets/: saved public icon, screenshots, thumbnail, fonts and icons.
- tests/e2e/: executable functional, responsive and axe accessibility coverage.
- scripts/: reference capture, measurement, local capture, Pixelmatch comparisons, docs generation.
- artifacts/reference/, local/, diffs/, reports/: genuine screenshots and structured evidence.
- docs/: provenance, environment audit, implementation notes and known differences.

Re-capture live evidence with npm run capture:reference followed by node scripts/inspect-reference.mjs, node scripts/refine-reference.mjs and node scripts/download-lightbox.mjs. These require ordinary network access and depend on the current public DOM; Google may change it. They do not authenticate. Re-capture can change reference counts and content. Regenerate the frozen snapshot intentionally using node scripts/prepare-data.mjs and review the result. Do not use downloaded page HTML as application markup.

Third-party images, brand marks and fonts retain their owners' rights. Public availability is not a redistribution license. See [asset manifest](docs/asset-manifest.md). No broad license to those assets is granted by this project.

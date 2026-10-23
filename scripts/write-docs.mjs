import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
await fs.mkdir('docs',{recursive:true});
const meta=JSON.parse(await fs.readFile('artifacts/reference/metadata.json','utf8'));
const visual=JSON.parse(await fs.readFile('artifacts/reports/visual.json','utf8'));
const sections=JSON.parse(await fs.readFile('artifacts/reports/sections.json','utf8'));
const tests=JSON.parse(await fs.readFile('artifacts/reports/playwright.json','utf8'));
const manifest=JSON.parse(await fs.readFile('artifacts/reference/asset-manifest.json','utf8'));
const pkg=JSON.parse(await fs.readFile('package-lock.json','utf8'));
const b=await chromium.launch(),p=await b.newPage();await p.goto('http://127.0.0.1:5173/');
const files=await fs.readdir('public/assets');
const dims=await p.evaluate(async files=>Object.fromEntries(await Promise.all(files.filter(f=>/\.(webp|png|jpg|svg)$/.test(f)).map(async file=>{const i=new Image();i.src=`/assets/${file}`;await i.decode();return[file,[i.naturalWidth,i.naturalHeight]]}))),files);await b.close();
const versionTable=Object.entries(pkg.packages).filter(([k])=>/^node_modules\/[^/]+$|^node_modules\/@[^/]+\/[^/]+$/.test(k)&&Object.keys({...pkg.packages[''].dependencies,...pkg.packages[''].devDependencies}).includes(k.replace('node_modules/',''))).map(([k,v])=>`| ${k.replace('node_modules/','')} | ${v.version} |`).join('\n');
const write=(name,text)=>fs.writeFile(name,text.trim()+'\n');
await write('README.md',`# mparivahan-playstore-landing

A responsive React reconstruction of the public [NextGen mParivahan Google Play listing](${meta.url}), captured on **23 October 2026**. Private local UI study only. No affiliation with Google, National Informatics Centre, or the Government of India. **Do not deploy or publish this replica.** This repository stores reviewable source and evidence; no hosting or deployment configuration is included.

## Run locally

Node 24 LTS was used (Node 22.20+ is also compatible with the declared tools). From this project root:

\`\`\`sh
npm ci
npx playwright install chromium
npm run dev
\`\`\`

Open the loopback address printed by Vite, normally http://127.0.0.1:5173/. This is a local development address, not a public preview. The app uses locally saved assets and needs no backend, login, API key, or runtime network access to render. External navigation intentionally goes to the original public services.

## Build and verify

\`\`\`sh
npm run typecheck
npm run build
npm run test:e2e
npm run dev -- --port 5173
# In a second terminal:
npm run capture:local
npm run test:visual
node scripts/compare-sections.mjs
\`\`\`

The E2E suite starts a production preview on port 4173 using the existing build. Close any conflicting server or set CI=1 to require a fresh test server. Headless Chromium is the verified browser. Linux users may need the normal Playwright runtime dependency installer: npx playwright install --with-deps chromium.

**Verified:** production build; ${tests.stats.expected} passing Playwright tests; 15 equal-viewport hero comparisons and 6 independently aligned section comparisons. See [test results](docs/test-results.md) and [visual comparison report](docs/visual-comparison-report.md). This is not pixel-equivalent to Google Play.

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
`);
await write('docs/environment-and-tools.md',`# Environment and tools

- Session: Windows desktop, not the managed Linux Cloud environment described in the supplied prompt. OS API returned Microsoft Windows 10.0.26200, X64; PowerShell; Node v24.20.0; npm/npx 11.19.0; Git 2.56.0.windows.2.
- Initial chat directory contained only outputs/ and work/; git status and rev-parse failed because there was no checkout. No pre-existing application was changed. The user supplied KennyPVTHax/landingpage. It was inspected via the GitHub connector and cloned into work/repository. main initially contained only README.md at 48968034045f953df13beb9955ed47c89f5e2ef4; clean status; no AGENTS.md. Project is transferred to its dedicated repository root.
- npm registry connectivity verified via npm view and actual installation. GitHub verified via connector, README access, git ls-remote and clone. Google Play returned HTTP 200 in actual Chromium. Image/font downloads succeeded with ordinary public access.
- npx playwright install chromium succeeded. A real launch, DOM inspection and screenshots succeeded using Chromium ${meta.browser}. Linux dependency installation did not apply. Browser cache is outside the source distribution in the normal per-user Playwright cache.
- Agent Browser ${pkg.packages['node_modules/agent-browser'].version} installed locally. Initial auto-launch failed (Chrome not found); retry with --executable-path pointing to the newly downloaded Chrome for Testing succeeded. It opened the real listing and saved artifacts/reference/agent-browser-reference.png, then was closed. No unrelated browser profile was used.
- npm 11 reported that Agent Browser's postinstall was not allowlisted. Its native CLI still ran successfully; no installation success was inferred from package metadata alone.
- Project-local skills installed with the bundled skill-installer helper using --dest .agents/skills: vercel-labs/agent-browser skills/agent-browser, vercel-labs/agent-skills skills/web-design-guidelines and skills/react-best-practices. Their SKILL.md instructions were read, and Agent Browser core instructions obtained from its installed CLI. React and accessibility guidance informed the implementation. Vercel's current web interface guidelines were fetched from its official GitHub source. No global skills or Codex configuration were changed. Local installed skills are excluded from distribution; installation sources are recorded here.
- Chrome DevTools MCP and Playwright MCP READMEs were inspected at their official GitHub repositories. They are not active tools in this session. Optional MCP configuration was not added because it would modify user-wide settings and duplicate direct Playwright/CDP. Direct computed-style/geometry inspection and CDP touch input were the verified fallbacks.
- Web-reader access to the locale-specific Play URL failed; direct Chromium succeeded. No bypass, credentials, cookies or private API access was used.
- Preview is loopback only. No externally reachable preview, cloud tunnel, merge or deployment was created.

## Exact direct package versions

| Package | Version |
| --- | --- |
${versionTable}

The lockfile pins transitive dependencies. npm install reported zero vulnerabilities. Browser automation and GitHub connector were available; no Linux/cloud runtime was inferred from the document's wording.
`);
await write('docs/reference-specification.md',`# Reference specification

Source: ${meta.url}

Captured: ${meta.capturedAt} (23 October 2026, India Standard Time). Chromium ${meta.browser}; DPR 1; light color scheme; browser locale ${meta.locale}; HTML lang=${meta.htmlLang}; unauthenticated. The visible footer identified India (English (United States)); gl=IN was requested, but no independent server-region assertion is made.

## Observed structure and content

Fixed Google Play header: Games, Apps selected, Books, Kids, Search, Help, anonymous account. No desktop sidebar navigation was observed. Dark trailer-thumbnail hero with NextGen mParivahan, National Informatics Centre., 3.7 stars, 729K overall reviews, Government badge and 100M+ downloads. Mobile adds a Rated for 3+ badge in its horizontally scrollable metadata row. The separate Phone review panel had 726K reviews. These counts differ in the real source because they have different scopes; they are preserved, not made artificially identical.

Seven portrait screenshots; About modal and six-line clipped description; updated Sep 30, 2026; Productivity category; Data safety link and four-row summary; Phone/Tablet review controls; five rating bars and three visible reviews (including two developer replies); App support disclosure; six more NIC apps; six similar apps; Play/family and legal footer. Trailer, related sections and footer were actually observed. No Android-app dashboard or backend was built.

## Measured geometry

| Feature | 1440 × 900 | 390 × 844 |
| --- | --- | --- |
| Header | 64px high, fixed | 104px high, two rows |
| Hero title | x72 y336, 560×152; 64/76px, weight 500 | x120 y283.375; 24/32px |
| Hero thumbnail | x373 y64, 1067×600, cover | x0 y104, 390×219.375 |
| Hero background end | y716 | y598.375 |
| Main gutter | 72px, max width1296 | 24px |
| Hero icon | x72 y556, 48×48 | x24 y290.375, 72×72 |
| Install | x72 y636, 200×44, radius8 | x24 y472.375, 342×36 |
| Screenshot strip | x72 y756, width860; tiles131×296, gap16 | x24 y638.375, width342; tiles92×204, gap12 |
| About heading | x72 y1098, 22/28px | x24 y864.375, 18/24px |
| Main text | Roboto 14/20px, letter spacing0.2px | Same |
| Related column | x1004, width364 | Becomes lower horizontal app lists |

Observed changes: header navigation moves to a second row below840px; content changes from two columns to one below960px; left/right gutters are24px on narrow phones,48px on tablet and72px on larger desktops. At1280px the title changes to64px and screenshots to296px tall; at1440px the thumbnail changes from947×532 to1067×600. Wide content caps at1296px. Tablet uses a96px hero icon and36px title. Source hero gradients were measured rather than independently invented.

## Evidence and limits

All ten requested viewports plus600,601,839,840,960 were genuinely captured and measured. artifacts/reference/geometry-*.json and measurements-*.json preserve raw DOM measurements. details.json preserves public About/support content and links; refinements.json and layers.json preserve responsive measurements and computed gradients. The full-page reference captures are genuine; comparisons use identical top viewports or explicitly aligned section crops. Gallery/About/support states were explored. Google gallery Escape did not reliably close the gallery during reconnaissance; the local lightbox deliberately provides reliable Escape closure.

Exact proprietary wordmark rendering, some icon variants, review/card spacing, modal appearance and lower mobile recommendation ordering remain approximations. The source changed one helpfulness count from170 to171 on a later capture; the local data remains the initial dated snapshot. Dynamic changes are not masked. No claim is made that India or another visitor always sees this experiment, counts or recommendations.
`);
const sources=new Map(manifest.map(a=>[a.file,a.src]));for(const f of meta.fonts)sources.set(f.file,f.url);sources.set('google-play.svg',`${meta.url} (public header SVG)`);
const assetRows=[];for(const file of files){const s=await fs.stat(`public/assets/${file}`);assetRows.push(`| public/assets/${file} | ${s.size} | ${dims[file]?.join('×')||'font'} | ${sources.get(file)||'Public reference gallery, observed full-resolution URL parameter'} |`)}
await write('docs/asset-manifest.md',`# Public asset manifest

Private UI study only. Original assets retain Google's, NIC's, developers' and reviewers' rights. No independent copyright/license clearance for public deployment is claimed. Do not deploy or treat this manifest as permission to redistribute. No private browser data was saved. URLs are the actual accessible public requests; the user-facing app renders saved local files.

| Local path | Bytes | Intrinsic dimensions | Original source/provenance |
| --- | ---: | --- | --- |
${assetRows.join('\n')}

image-1.jpg is the publicly rendered YouTube trailer thumbnail, not a screenshot of the webpage. image-2/3 are the large/small app icons; image-6 through12 are gallery screenshots; image-13 through16 data safety icons; image-17 through19 public review avatars; image-21 through32 related apps; image-33 the India flag. Fonts were the actual fetched reference fonts, including Roboto and Google Sans. Google Sans Display was specified by the reference but no such face was loaded, so both captured desktop title and replica use Roboto fallback. The Google Play triangle is saved SVG markup; its adjacent wordmark is recreated text and differs slightly.

screenshot-mobile-* retain the same public image source and use the source's measured mobile dimensions. screenshot-full-* use the public gallery's observed w2560-h1440 resizing parameter. Their actual dimensions above were decoded in Chromium; they are not assumed from URL parameters. There are no invented replacement app images or screenshot-as-page shortcuts.
`);
await write('docs/implementation-log.md',`# Implementation log

1. Read the complete supplied master prompt in two contiguous ranges. Audited the actual Windows environment and empty projectless directory. Requested only the missing repository destination while continuing independent work; inspected the user-specified repository before integration.
2. Verified current official tool documentation, installed compatible React/Vite/TypeScript, Playwright, Pixelmatch, pngjs and Agent Browser packages and three project-local skills. Used direct Playwright and CDP in place of optional inactive MCP integrations.
3. Captured the actual public listing, initial/full desktop and phone views, all required viewport sizes and additional breakpoint probes; collected measured typography, geometry, source links and assets. Frozen the public listing/reviews in src/data/listing.json.
4. Built real semantic components, reusable icons/dialog/carousel, responsive CSS tokens and local assets. No frontend frameworks or bitmap-composite shortcuts replaced the page layout. Actions open official destinations or explicitly local behavior.
5. Iterated quantitatively: first hero mismatches reached25.660% at1024 and46.842% at960 because of incorrect tablet composition; measured thumbnail gradients, sidebar width, hero heights and card placement reduced these to1.912% and1.924%. Phone hero improved from6.912% to3.015% at390. Corrected source screenshot sizing, About clipping,0.2px body tracking and mobile replies after comparing lower sections.
6. Initial browser suite:26 passed,2 failed. Added explicit dialog Tab wrapping and close/restore cleanup; fixed a test assertion that tried to locate a hidden status role after cancelled sharing. Final suite passed28/28, including native touch input and axe checks. No failures were hidden or marked skipped.
7. Build and screenshots rerun after source changes. Preserved independent section metrics, including remaining mobile differences. Formatted code, wrote provenance/environment reports and prepared source ZIP and repository branch for review. No merge or deployment.

Intentional adaptations: official navigation instead of fake account/installation; Data safety links to source page as observed; Tablet reviews and trailer open real destinations; helpfulness is clearly local; local review modal uses the captured reviews. No live account operations or fabricated reviews.
`);
await write('docs/test-results.md',`# Verified test results

Run date: 23 October 2026. Production build tested in Chromium ${meta.browser} on Windows x64, DPR1, light, locale en-IN.

- npm run build: passed (TypeScript noEmit + Vite production build). Last observed bundle: index HTML0.95kB, CSS21.41kB, JS245.36kB (gzip76.07kB). Exact hash names are generated by Vite.
- npm run test:e2e: **${tests.stats.expected} passed, ${tests.stats.unexpected} failed, ${tests.stats.skipped} skipped**, final run${(tests.stats.duration/1000).toFixed(1)}seconds; 3 workers. JSON: ../artifacts/reports/playwright.json. Full HTML report can be regenerated locally; transient browser traces and reports are excluded from source ZIP.
- npm run capture:local: passed;15 hero viewports, representative full pages, About dialogs and gallery states; no uncaught runtime errors. ../artifacts/reports/local-runtime.json.
- npm run test:visual: executed successfully;15 genuine reference/local pairs, no masks or rescaling. This script measures mismatch and rejects incompatible dimensions; it does not turn a high mismatch into a false pass or claim perceptual similarity.
- node scripts/compare-sections.mjs: executed successfully;6 independently aligned lower-section pairs; ../artifacts/reports/sections.json.
- npm install: successful, zero vulnerabilities reported. npx playwright install chromium and actual launch/screenshot successful. Agent Browser actual public open/screenshot successful with explicit Chrome path.

## Coverage

All required viewport sizes plus5 breakpoint probes; no document horizontal overflow; all lazy assets decode; no page/console errors or HTTP4xx/5xx during local rendering; required headings/publisher; correct official action links; Web Share success/cancel and clipboard success/denied fallback; arrow and keyboard carousel; native CDP touch swipe; screenshot keyboard/buttons/Escape; About focus trap/return; support expand/collapse; local review feedback and reviews dialog; named controls, visible focus and skip link; orientation switch; axe WCAG2A/AA/2.1AA scans at1440 and390 returned no violations. Automated accessibility results do not certify complete manual or assistive-technology coverage.

External services were checked by destination without actually installing an app or changing accounts. The primary Install link uses the genuine listing URL and target=_blank. Current source review counts may change. Browser support outside Chromium was not verified.
`);
await write('docs/visual-comparison-report.md',`# Visual comparison report

Reference: ${meta.url}; initial capture ${meta.capturedAt}; browser Chromium ${meta.browser}. All comparisons use matching width/height, DPR1, light color scheme, en-IN browser locale, loaded fonts/images and top scroll position. Pixelmatch8, threshold0.1, includeAA=false (anti-aliased edge pixels excluded by the library). No region masks. Mismatch percentage is **not a perceived design accuracy or similarity score**. No100% equivalence claim.

## Equal-viewport hero measurements

| Viewport | Mismatch pixels | Mismatch % |
| --- | ---: | ---: |
${visual.pairs.map(p=>`| ${p.width}×${p.height} | ${p.mismatchPixels} | ${p.mismatchPercent} |`).join('\n')}

## Lower sections, independently aligned

Each pair starts12px above its own section heading. These crops intentionally remove accumulated page shifts and must not be described as full-page equivalence. They use equal crop dimensions and no stretching or masks.

| Width | Section | Crop | Mismatch pixels | Mismatch % |
| --- | --- | --- | ---: | ---: |
${sections.pairs.map(p=>`| ${p.width} | ${p.section} | ${p.cropWidth}×${p.cropHeight} | ${p.mismatchPixels} | ${p.mismatchPercent} |`).join('\n')}

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
`);
console.log('All seven documentation deliverables generated, with decoded asset dimensions and actual metrics.');

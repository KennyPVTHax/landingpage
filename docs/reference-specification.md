# Reference specification

Source: https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN

Captured: 2026-10-23T15:34:26.363Z (23 October 2026, India Standard Time). Chromium 156.0.8078.4; DPR 1; light color scheme; browser locale en-IN; HTML lang=en; unauthenticated. The visible footer identified India (English (United States)); gl=IN was requested, but no independent server-region assertion is made.

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

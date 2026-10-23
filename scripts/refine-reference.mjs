import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const b = await chromium.launch(),
  c = await b.newContext({
    viewport: { width: 390, height: 844 },
    locale: "en-IN",
    deviceScaleFactor: 1,
    colorScheme: "light",
  }),
  p = await c.newPage();
await p.goto(
  "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN",
);
await p.evaluate(() => document.fonts.ready);
const logo = await p
  .getByRole("link", { name: "Google Play logo", exact: true })
  .evaluate((e) => e.innerHTML);
await fs.writeFile("artifacts/reference/logo.html", logo);
const svg = await p
  .getByRole("link", { name: "Google Play logo", exact: true })
  .locator("svg")
  .first()
  .evaluate((e) => e.outerHTML);
await fs.writeFile("public/assets/google-play.svg", svg);
const manifest = JSON.parse(
  await fs.readFile("artifacts/reference/asset-manifest.json", "utf8"),
);
for (const [i, img] of (
  await p
    .locator('img[alt="Screenshot image"]')
    .evaluateAll((a) =>
      a.map((i) => ({
        src: i.currentSrc,
        w: i.naturalWidth,
        h: i.naturalHeight,
      })),
    )
).entries()) {
  const r = await c.request.get(img.src),
    body = await r.body();
  const file = `screenshot-mobile-${i}.webp`;
  await fs.writeFile(`public/assets/${file}`, body);
  manifest.push({
    file,
    src: img.src,
    width: img.w,
    height: img.h,
    bytes: body.length,
    alt: "Mobile screenshot image",
  });
}
await fs.writeFile(
  "artifacts/reference/asset-manifest.json",
  JSON.stringify(manifest, null, 2),
);
const report = [];
for (const width of [390, 768, 840, 960, 1024, 1280, 1440]) {
  await p.setViewportSize({ width, height: 900 });
  await p.evaluate(() => scrollTo(0, 0));
  report.push(
    await p.evaluate(() => ({
      width: innerWidth,
      parents: [
        ...(function* (e) {
          for (let i = 0; e && i < 9; i++, e = e.parentElement) yield e;
        })(document.querySelector(".B5GQxf")),
      ].map((e) => ({
        cls: e.className,
        rect: e.getBoundingClientRect().toJSON(),
        grid: getComputedStyle(e).gridTemplateColumns,
      })),
      stats: [...document.querySelectorAll(".ClM7O")].map((e) => ({
        cls: e.className,
        rect: e.getBoundingClientRect().toJSON(),
      })),
      hero: [
        ...document.querySelectorAll(
          ".wkMJlb,.PyyLUd,.jaQz3d,.qxNhq,.RhBWnf,.Fd93Bb,.g1rdde",
        ),
      ]
        .slice(0, 10)
        .map((e) => ({
          cls: e.className,
          rect: e.getBoundingClientRect().toJSON(),
          margin: getComputedStyle(e).margin,
          font: getComputedStyle(e).font,
          bg: getComputedStyle(e).background,
        })),
    })),
  );
}
await fs.writeFile(
  "artifacts/reference/refinements.json",
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    report.map((r) => ({
      width: r.width,
      parents: r.parents.map((p) => ({
        cls: p.cls,
        x: p.rect.x,
        y: p.rect.y,
        w: p.rect.width,
        h: p.rect.height,
      })),
      hero: r.hero,
    })),
    null,
    2,
  ),
);
await b.close();

import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
const b = await chromium.launch();
const results = [];
for (const width of [1440, 390]) {
  const pages = [];
  for (const kind of ["reference", "local"]) {
    const p = await b.newPage({
      viewport: { width, height: width === 1440 ? 900 : 844 },
      locale: "en-IN",
      timezoneId: "Asia/Kolkata",
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    pages.push(p);
    await p.goto(
      kind === "reference"
        ? "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN"
        : "http://127.0.0.1:5173/",
    );
    await p.evaluate(() => document.fonts.ready);
    for (
      let y = 0;
      y < (await p.locator("body").evaluate((e) => e.scrollHeight));
      y += 700
    ) {
      await p.evaluate((y) => scrollTo(0, y), y);
    }
    await p.evaluate(() => scrollTo(0, 0));
    for (const [section, title, height] of [
      ["about", "About this app", width === 1440 ? 320 : 350],
      ["safety", "Data safety", width === 1440 ? 400 : 560],
      ["reviews", "Ratings and reviews", width === 1440 ? 1400 : 1900],
    ]) {
      const heading = p
        .getByRole("heading", { name: title, exact: true })
        .first();
      const box = await heading.boundingBox();
      if (!box) throw Error("Missing heading");
      const y = Math.round(box.y + (await p.evaluate(() => scrollY)) - 12);
      const x = width === 1440 ? 72 : 24;
      const clip = { x, y, width: width === 1440 ? 860 : 342, height };
      await p.screenshot({
        path: `artifacts/${kind}/${kind}-${width}-${section}-crop.png`,
        clip,
        fullPage: true,
        animations: "disabled",
      });
    }
    await p
      .getByRole("button", {
        name:
          kind === "reference"
            ? "See more information on About this app"
            : "More about About this app",
        exact: true,
      })
      .click();
    await p.getByRole("dialog").waitFor({ state: "visible" });
    await p.screenshot({
      path: `artifacts/${kind}/${kind}-${width}-about-dialog.png`,
      animations: "disabled",
    });
    // Navigate to a fresh baseline: source gallery does not consistently close on Escape.
    if (kind === "reference") {
      await p.goto(
        "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN",
      );
      await p
        .getByRole("button", { name: "Screenshot image", exact: true })
        .first()
        .click();
      await p.locator(".h5VCA").waitFor({ state: "visible" });
      await p.waitForFunction(() => [...document.images].some(img => img.currentSrc.includes("w2560") && img.complete && img.naturalWidth > 0));
      await p.screenshot({
        path: `artifacts/reference/reference-${width}-lightbox.png`,
        animations: "disabled",
      });
      const imgs = await p
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => i.getBoundingClientRect().height > 300)
            .map((i) => ({
              src: i.currentSrc,
              w: i.naturalWidth,
              h: i.naturalHeight,
            })),
        );
      const high = imgs.find((i) => i.src.includes("JtFWJ080"));
      if (high) {
        const r = await p.request.get(high.src),
          file = "screenshot-full-0.webp";
        await fs.writeFile(`public/assets/${file}`, await r.body());
        await fs.writeFile(
          "artifacts/reference/lightbox-asset.json",
          JSON.stringify({ ...high, file }, null, 2),
        );
      }
    }
  }
  for (const section of ["about", "safety", "reviews"]) {
    const a = PNG.sync.read(
        await fs.readFile(
          `artifacts/reference/reference-${width}-${section}-crop.png`,
        ),
      ),
      c = PNG.sync.read(
        await fs.readFile(`artifacts/local/local-${width}-${section}-crop.png`),
      );
    if (a.width !== c.width || a.height !== c.height)
      throw Error("Invalid dimensions");
    const diff = new PNG({ width: a.width, height: a.height });
    const pixels = pixelmatch(a.data, c.data, diff.data, a.width, a.height, {
      threshold: 0.1,
      includeAA: false,
    });
    await fs.writeFile(
      `artifacts/diffs/diff-${width}-${section}.png`,
      PNG.sync.write(diff),
    );
    results.push({
      width,
      section,
      cropWidth: a.width,
      cropHeight: a.height,
      mismatchPixels: pixels,
      mismatchPercent: +((pixels / (a.width * a.height)) * 100).toFixed(3),
    });
  }
  for (const p of pages) await p.close();
}
await fs.writeFile(
  "artifacts/reports/sections.json",
  JSON.stringify(
    {
      method:
        "Independently align each heading at y=12; fixed-size section crops; no scaling or masks; same Chromium, DPR 1, locale en-IN, light. Section alignment removes accumulated vertical shifts, so these are not full-page equivalence measurements.",
      pairs: results,
    },
    null,
    2,
  ),
);
console.table(results);
await b.close();

import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "en-IN",
  deviceScaleFactor: 1,
  colorScheme: "light",
  timezoneId: "Asia/Kolkata",
});
await page.goto(
  "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN",
);
await page.evaluate(() => document.fonts.ready);
const report = {};
report.styles = await page.evaluate(() => {
  const paths = ["h1", ".oiEt0d", ".B5GQxf", ".S3WLMd", ".XfZNbf"];
  return paths.map((sel) => ({
    sel,
    ancestors: [
      ...(function* (e) {
        for (let i = 0; e && i < 5; i++, e = e.parentElement) yield e;
      })(document.querySelector(sel)),
    ].map((e) => {
      const s = getComputedStyle(e),
        r = e.getBoundingClientRect();
      return {
        tag: e.tagName,
        cls: e.className,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        styles: Object.fromEntries(
          [
            "background",
            "backgroundImage",
            "position",
            "display",
            "padding",
            "margin",
            "height",
            "width",
            "maxWidth",
            "font",
            "letterSpacing",
            "gridTemplateColumns",
            "gap",
            "maskImage",
            "opacity",
            "objectFit",
          ].map((k) => [k, s[k]]),
        ),
        before: getComputedStyle(e, "::before").background,
        after: getComputedStyle(e, "::after").background,
      };
    }),
  }));
});
report.fontFaces = await page.evaluate(() =>
  [...document.styleSheets].flatMap((s) => {
    try {
      return [...s.cssRules]
        .filter((r) => r.cssText.startsWith("@font-face"))
        .map((r) => r.cssText);
    } catch {
      return [];
    }
  }),
);
report.links = await page
  .locator("a")
  .evaluateAll((a) => a.map((a) => ({ text: a.innerText, href: a.href })));
report.reviews = await page
  .locator('[role="img"][aria-label*="reviews for star"]')
  .evaluateAll((a) =>
    a.map((e) => ({ label: e.getAttribute("aria-label"), html: e.outerHTML })),
  );
await page
  .getByRole("button", {
    name: "See more information on About this app",
    exact: true,
  })
  .click();
await page.getByRole("dialog").waitFor();
await page.screenshot({
  path: "artifacts/reference/reference-1440-about-dialog.png",
});
report.aboutDialog = await page.getByRole("dialog").innerText();
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Expand", exact: true }).click();
report.support = await page.locator("body").innerText();
await page.screenshot({
  path: "artifacts/reference/reference-1440-support.png",
});
await page
  .getByRole("button", { name: "Screenshot image", exact: true })
  .first()
  .click();
await page.waitForFunction(() => !!document.querySelector(".h5VCA"));
await page.screenshot({
  path: "artifacts/reference/reference-1440-lightbox.png",
});
report.lightbox = await page.locator("body").ariaSnapshot();
await page.keyboard.press("Escape");
await fs.writeFile(
  "artifacts/reference/details.json",
  JSON.stringify(report, null, 2),
);
await page.goto(
  "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN",
);
for (const [w, h] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [375, 812],
  [360, 800],
  [600, 800],
  [601, 800],
  [839, 900],
  [840, 900],
  [960, 900],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  // Return support disclosure to baseline before captures.
  const collapse = page.getByRole("button", { name: "Collapse", exact: true });
  if (await collapse.count()) await collapse.click();
  await page.screenshot({
    path: `artifacts/reference/reference-${w}-hero.png`,
  });
  const geom = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    items: [...document.querySelectorAll("h1,h2,.oiEt0d,.B5GQxf,header")]
      .filter((e) => e.getBoundingClientRect().width)
      .map((e) => {
        const r = e.getBoundingClientRect(),
          s = getComputedStyle(e);
        return {
          text: e.innerText?.slice(0, 80),
          cls: e.className,
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          font: s.font,
        };
      }),
  }));
  await fs.writeFile(
    `artifacts/reference/geometry-${w}.json`,
    JSON.stringify(geom, null, 2),
  );
}
await page.setViewportSize({ width: 390, height: 844 });
await page
  .getByRole("button", {
    name: "See more information on About this app",
    exact: true,
  })
  .click();
await page.screenshot({
  path: "artifacts/reference/reference-390-about-dialog.png",
});
console.log("Reference states and all 10 viewports captured.");
await browser.close();

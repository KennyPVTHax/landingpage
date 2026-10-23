import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
await fs.mkdir("artifacts/local", { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({
  locale: "en-IN",
  timezoneId: "Asia/Kolkata",
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "reduce",
});
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
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
  await p.setViewportSize({ width: w, height: h });
  await p.goto("http://127.0.0.1:5173/");
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() =>
    [...document.images]
      .filter((i) => i.getBoundingClientRect().top < innerHeight)
      .every((i) => i.complete),
  );
  await p.screenshot({ path: `artifacts/local/local-${w}-hero.png` });
  if (w === 1440 || w === 390)
    await p.screenshot({
      path: `artifacts/local/local-${w}-full.png`,
      fullPage: true,
    });
  const geom = await p.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    headings: [...document.querySelectorAll("h1,h2")].map((e) => ({
      text: e.innerText,
      rect: e.getBoundingClientRect().toJSON(),
    })),
  }));
  await fs.writeFile(
    `artifacts/local/geometry-${w}.json`,
    JSON.stringify(geom, null, 2),
  );
  if (w === 1440 || w === 390) {
    await p
      .getByRole("button", { name: "More about About this app", exact: true })
      .click();
    await p.screenshot({ path: `artifacts/local/local-${w}-about-dialog.png` });
    await p.keyboard.press("Escape");
    await p
      .getByRole("button", { name: "Open screenshot 1", exact: true })
      .click();
    await p.getByRole("dialog").locator("img").evaluate(img => img.decode());
    await p.screenshot({ path: `artifacts/local/local-${w}-lightbox.png` });
    await p.keyboard.press("Escape");
  }
}
await fs.mkdir("artifacts/reports", { recursive: true });
await fs.writeFile(
  "artifacts/reports/local-runtime.json",
  JSON.stringify(
    { browser: b.version(), errors, timestamp: new Date().toISOString() },
    null,
    2,
  ),
);
await b.close();
console.log("Local captures complete. Runtime errors:", errors.length);

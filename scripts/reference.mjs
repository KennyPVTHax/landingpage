import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const out = "artifacts/reference";
await fs.mkdir(out, { recursive: true });
await fs.mkdir("public/assets", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  locale: "en-IN",
  timezoneId: "Asia/Kolkata",
  deviceScaleFactor: 1,
  colorScheme: "light",
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const url =
  "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN";
const fonts = [];
page.on("response", async (r) => {
  if (r.request().resourceType() === "font" && r.ok()) {
    try {
      const file = `font-${fonts.length}.woff2`;
      fonts.push({ file, url: r.url() });
      await fs.writeFile(`public/assets/${file}`, await r.body());
    } catch {}
  }
});
try {
  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page
    .getByRole("heading", { name: "NextGen mParivahan", exact: true })
    .waitFor({ timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.locator("img").first().waitFor();
  await page.waitForFunction(
    () =>
      [...document.images]
        .filter((i) => i.getBoundingClientRect().top < innerHeight)
        .every((i) => i.complete),
    { timeout: 15000 },
  );
  const meta = {
    url: page.url(),
    status: response.status(),
    capturedAt: new Date().toISOString(),
    browser: browser.version(),
    locale: await page.evaluate(() => navigator.language),
    htmlLang: await page.locator("html").getAttribute("lang"),
    regionRequested: "IN",
    regionVerified: false,
    dpr: 1,
    fonts,
  };
  await page.screenshot({ path: `${out}/reference-1440-hero.png` });
  await fs.writeFile(`${out}/body.txt`, await page.locator("body").innerText());
  await fs.writeFile(`${out}/page.html`, await page.content());
  await fs.writeFile(
    `${out}/accessibility.yml`,
    await page.locator("body").ariaSnapshot(),
  );
  const measure = async (label) => {
    const measurements = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          "header, h1, h2, h3, button, main, img, nav",
        ),
      ]
        .filter((e) => e.getBoundingClientRect().width)
        .map((e) => {
          const r = e.getBoundingClientRect(),
            s = getComputedStyle(e);
          return {
            tag: e.tagName,
            text: e.innerText?.slice(0, 100),
            alt: e.alt,
            cls: e.className,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height },
            font: s.font,
            fontFamily: s.fontFamily,
            color: s.color,
            background: s.backgroundColor,
            borderRadius: s.borderRadius,
            gap: s.gap,
          };
        }),
    );
    await fs.writeFile(
      `${out}/measurements-${label}.json`,
      JSON.stringify(measurements, null, 2),
    );
  };
  await measure("1440");
  const assets = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs.map((i) => ({
        alt: i.alt,
        src: i.currentSrc,
        width: i.naturalWidth,
        height: i.naturalHeight,
        rect: {
          width: i.getBoundingClientRect().width,
          height: i.getBoundingClientRect().height,
        },
      })),
    );
  const manifest = [];
  for (const [index, asset] of assets.entries()) {
    if (!asset.src.startsWith("https://")) continue;
    try {
      const r = await context.request.get(asset.src);
      if (!r.ok()) continue;
      const contentType = r.headers()["content-type"] || "";
      const ext = contentType.includes("png")
        ? "png"
        : contentType.includes("webp")
          ? "webp"
          : contentType.includes("svg")
            ? "svg"
            : "jpg";
      const file = `image-${index}.${ext}`;
      const body = await r.body();
      await fs.writeFile(`public/assets/${file}`, body);
      manifest.push({ ...asset, file, bytes: body.length, contentType });
    } catch (e) {
      console.log("Asset failed", index, e.message);
    }
  }
  for (
    let y = 0;
    y < (await page.locator("body").evaluate((e) => e.scrollHeight));
    y += 700
  ) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: `${out}/reference-1440-full.png`,
    fullPage: true,
  });
  for (const text of ["About this app", "Data safety", "Ratings and reviews"]) {
    const el = page.getByText(text, { exact: true }).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${out}/reference-1440-${text.split(" ")[0].toLowerCase()}.png`,
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/reference-390-hero.png` });
  await measure("390");
  await page.screenshot({
    path: `${out}/reference-390-full.png`,
    fullPage: true,
  });
  await fs.writeFile(
    `${out}/metadata.json`,
    JSON.stringify({ ...meta, fonts }, null, 2),
  );
  await fs.writeFile(
    `${out}/asset-manifest.json`,
    JSON.stringify(manifest, null, 2),
  );
  console.log(
    JSON.stringify({ ...meta, assets: manifest.length, fonts }, null, 2),
  );
} catch (e) {
  await fs.writeFile(
    `${out}/failure.json`,
    JSON.stringify(
      { url, error: e.message, timestamp: new Date().toISOString() },
      null,
      2,
    ),
  );
  await page.screenshot({ path: `${out}/access-failure.png` }).catch(() => {});
  throw e;
} finally {
  await browser.close();
}

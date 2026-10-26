import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const b = await chromium.launch(),
  p = await b.newPage({
    viewport: { width: 1440, height: 900 },
    locale: "en-IN",
  });
await p.goto(
  "https://play.google.com/store/apps/details?id=com.nic.mparivahan&hl=en&gl=IN",
);
await p.evaluate(() => document.fonts.ready);
const r = await p.evaluate(() => ({
  layers: [...document.querySelector(".PyyLUd").querySelectorAll("*")].map(
    (e) => ({
      tag: e.tagName,
      cls: e.className,
      style: getComputedStyle(e).cssText,
      bg: getComputedStyle(e).background,
      rect: e.getBoundingClientRect().toJSON(),
    }),
  ),
  css: [...document.styleSheets].flatMap((s) => {
    try {
      return [...s.cssRules]
        .filter(
          (r) =>
            r.cssText.includes("gradient") &&
            /PyyLUd|oiEt0d|202124|32,33,36/.test(r.cssText),
        )
        .map((r) => r.cssText);
    } catch {
      return [];
    }
  }),
}));
await fs.writeFile(
  "artifacts/reference/layers.json",
  JSON.stringify(r, null, 2),
);
console.log(JSON.stringify(r));
await b.close();

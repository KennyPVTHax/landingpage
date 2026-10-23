import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const official =
  "https://play.google.com/store/apps/details?id=com.nic.mparivahan";
const viewports = [
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
];
for (const [width, height] of viewports) {
  test(`responsive layout ${width} × ${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const failures: string[] = [];
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { level: 1, name: "NextGen mParivahan" }),
    ).toBeVisible();
    await expect(page.locator(".publisher")).toHaveText(
      "National Informatics Centre.",
    );
    for (const title of [
      "About this app",
      "Data safety",
      "Ratings and reviews",
      "App support",
      "Similar apps",
    ])
      await expect(
        page.getByRole("heading", { name: title, exact: true }).first(),
      ).toBeAttached();
    await expect(
      page.getByRole("link", { name: "Install", exact: true }),
    ).toHaveAttribute("href", official);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
    // All original assets must resolve even once lazy-loaded.
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) => imgs.every((i) => i.naturalWidth > 0)),
    ).toBe(true);
  });
}
test("install opens the original listing and navigation uses authentic destinations", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Install", exact: true });
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(page.locator(".publisher")).toHaveAttribute(
    "href",
    /play\.google\.com\/store\/apps\/dev/,
  );
  await expect(
    page.getByRole("link", { name: "Play official trailer" }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=d0JuFxJIukc");
  await expect(
    page.getByRole("link", { name: "Add to wishlist", exact: true }),
  ).toHaveAttribute("href", official);
  const invalid = await page
    .locator("a")
    .evaluateAll(
      (a) =>
        a.filter(
          (e) => !e.getAttribute("href") || e.getAttribute("href") === "#",
        ).length,
    );
  expect(invalid).toBe(0);
});
test("About dialog has real description, traps focus, closes with Escape and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "More about About this app",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Encrypted QR Code");
  await expect(dialog).toContainText("2.0.143");
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("screenshots open, cycle with keyboard and buttons, then close", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open screenshot 1", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveText("Screenshot 1 of 7");
  await expect.poll(() => dialog.locator("img").evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(600);
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText("Screenshot 2 of 7");
  await dialog
    .getByRole("button", { name: "Previous screenshot", exact: true })
    .click();
  await expect(dialog.getByRole("heading")).toHaveText("Screenshot 1 of 7");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
test("carousel arrows and keyboard change horizontal position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const track = page.locator(".screenshot-track");
  await page
    .getByRole("button", { name: "Next screenshots", exact: true })
    .click();
  await expect
    .poll(() => track.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Previous screenshots", exact: true })
    .click();
  await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBe(0);
  await track.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => track.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0);
});
test("native touch swipe scrolls screenshots", async ({ browser }) => {
  const c = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await c.newPage();
  await page.goto("http://127.0.0.1:4173/");
  const track = page.locator(".screenshot-track");
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  if (!box) throw Error("Missing carousel");
  const y = box.y + 80;
  const cdp = await c.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 280, y }],
  });
  for (const x of [250, 220, 190, 160, 130, 100])
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => track.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0);
  await c.close();
});
test("App support expands and collapses with correct public contacts", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "App support",
    exact: true,
  });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: /Support email/ }),
  ).toHaveAttribute("href", "mailto:helpdesk-mparivahan@gov.in");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#support-details")).not.toBeAttached();
});
test("Share copies the official listing URL", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    official,
  );
});
test("Share API succeeds, cancellation is quiet, and denied clipboard has selectable fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      value: async () => {},
      configurable: true,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("shared");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: async () => {
        throw new DOMException("Cancelled", "AbortError");
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(page.getByRole("status")).not.toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw Error("Permission denied");
        },
      },
      configurable: true,
    });
  });
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Official listing URL to copy" }),
  ).toHaveValue(official);
});
test("review feedback is clearly local and reviews dialog works", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Yes", exact: true }).first().click();
  await expect(page.getByRole("status")).toContainText("local demo only");
  await page
    .getByRole("button", { name: "See all reviews", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Public review snapshot",
  );
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("keyboard skip link, named controls and visible focus", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.activeElement!).outlineStyle,
    ),
  ).not.toBe("none");
  const unnamed = await page
    .locator("button")
    .evaluateAll(
      (bs) =>
        bs.filter((b) => !b.getAttribute("aria-label") && !b.innerText.trim())
          .length,
    );
  expect(unnamed).toBe(0);
});
for (const width of [1440, 390])
  test(`WCAG automated accessibility ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
test("orientation changes keep controls visible without document overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(
    page.getByRole("link", { name: "Install", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(844);
});

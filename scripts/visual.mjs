import fs from "node:fs/promises";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
await fs.mkdir("artifacts/diffs", { recursive: true });
await fs.mkdir("artifacts/reports", { recursive: true });
const report = [];
for (const width of [
  1920, 1440, 1366, 1280, 1024, 768, 430, 390, 375, 360, 600, 601, 839, 840,
  960,
]) {
  const ref = PNG.sync.read(
    await fs.readFile(`artifacts/reference/reference-${width}-hero.png`),
  );
  const local = PNG.sync.read(
    await fs.readFile(`artifacts/local/local-${width}-hero.png`),
  );
  if (ref.width !== local.width || ref.height !== local.height)
    throw new Error(`Invalid dimensions at ${width}; no rescaling permitted.`);
  const diff = new PNG({ width: ref.width, height: ref.height });
  const count = pixelmatch(
    ref.data,
    local.data,
    diff.data,
    ref.width,
    ref.height,
    { threshold: 0.1, includeAA: false },
  );
  await fs.writeFile(
    `artifacts/diffs/diff-${width}-hero.png`,
    PNG.sync.write(diff),
  );
  if (width === 1440 || width === 390) {
    const pair = new PNG({ width: ref.width * 2, height: ref.height });
    PNG.bitblt(ref, pair, 0, 0, ref.width, ref.height, 0, 0);
    PNG.bitblt(local, pair, 0, 0, ref.width, ref.height, ref.width, 0);
    await fs.writeFile(
      `artifacts/diffs/side-by-side-${width}.png`,
      PNG.sync.write(pair),
    );
    const overlay = new PNG({ width: ref.width, height: ref.height });
    for (let i = 0; i < overlay.data.length; i += 4) {
      for (let c = 0; c < 3; c++)
        overlay.data[i + c] = Math.round(
          (ref.data[i + c] + local.data[i + c]) / 2,
        );
      overlay.data[i + 3] = 255;
    }
    await fs.writeFile(
      `artifacts/diffs/overlay-${width}.png`,
      PNG.sync.write(overlay),
    );
  }
  report.push({
    viewport: width,
    width: ref.width,
    height: ref.height,
    threshold: 0.1,
    includeAA: false,
    mismatchPixels: count,
    totalPixels: ref.width * ref.height,
    mismatchPercent: Number(
      ((count / (ref.width * ref.height)) * 100).toFixed(3),
    ),
    diff: `artifacts/diffs/diff-${width}-hero.png`,
  });
}
await fs.writeFile(
  "artifacts/reports/visual.json",
  JSON.stringify(
    {
      method:
        "Pixelmatch 8; threshold 0.1; anti-alias pixels excluded; no masks; DPR 1; Chromium 156; light; en-IN. Mismatch is not a perceptual similarity score.",
      pairs: report,
    },
    null,
    2,
  ),
);
console.table(
  report.map(({ viewport, mismatchPercent }) => ({
    viewport,
    mismatchPercent,
  })),
);

import fs from "node:fs/promises";
const text = await fs.readFile("artifacts/reference/body.txt", "utf8");
const metadata = JSON.parse(
  await fs.readFile("artifacts/reference/metadata.json", "utf8"),
);
const details = JSON.parse(
  await fs.readFile("artifacts/reference/details.json", "utf8"),
);
const description = text
  .split("About this app\narrow_forward\n")[1]
  .split("\nComplete Transport Solution for Citizen")[0];
const names = ["Harshil Karani", "Adit Newah", "uday kiran reddy Anumula"];
const reviews = names.map((name, i) => {
  const block = text
    .split(`${name}\nmore_vert\n`)[1]
    .split("\nDid you find this helpful?")[0];
  const lines = block.split("\n");
  return {
    name,
    date: lines[0],
    text: lines.slice(1, -1).join("\n"),
    helpful: parseInt(lines.at(-1)),
    stars: 1,
    avatar: `image-${17 + i}.webp`,
    reply:
      i < 2
        ? {
            date: i === 0 ? "September 15, 2026" : "July 20, 2026",
            text: text
              .split("National Informatics Centre.\nSeptember 15, 2026\n")[1]
              .split("\nAdit Newah")[0],
          }
        : null,
  };
});
const titles = [
  "Mera Ration App",
  "NSP OTR",
  "JeevanPramaan",
  "PMKISAN GoI",
  "eCourts Services",
  "AadhaarBAS",
  "Vehicleinfo - RTO Information",
  "Axis Mobile: Pay, Invest & UPI",
  "DigiLocker",
  "CarInfo - RTO Vehicle Info App",
  "iGOT Karmayogi",
  "Bajaj Finance : UPI & Loan App",
];
const related = titles.map((title, i) => {
  const lines = text.split(`${title}\n`)[1].split("\n");
  const link = details.links.find((l) => l.text.startsWith(title));
  return {
    title,
    publisher: lines[0],
    rating: lines[1],
    url: link?.href ?? metadata.url,
    image: `image-${21 + i}.webp`,
  };
});
await fs.mkdir("src/data", { recursive: true });
await fs.writeFile(
  "src/data/listing.json",
  JSON.stringify(
    {
      capturedAt: metadata.capturedAt,
      locale: metadata.locale,
      htmlLang: metadata.htmlLang,
      region: "India (English (United States))",
      source: metadata.url,
      officialUrl:
        "https://play.google.com/store/apps/details?id=com.nic.mparivahan",
      title: "NextGen mParivahan",
      publisher: "National Informatics Centre.",
      publisherUrl:
        "https://play.google.com/store/apps/dev?id=9076108670215860604",
      rating: "3.7",
      reviews: "729K",
      phoneReviews: "726K",
      downloads: "100M+",
      updated: "Sep 30, 2026",
      version: "2.0.143",
      description,
      reviewsSnapshot: reviews,
      distribution: [422597, 58964, 34834, 27990, 182005],
      related,
      footerLinks: details.links.filter((l) =>
        [
          "Play Pass",
          "Play Points",
          "Gift cards",
          "Redeem",
          "Refund policy",
          "Parent Guide",
          "Family sharing",
          "Terms of Service",
          "Privacy",
          "About Google Play",
          "Developers",
          "Google Store",
        ].includes(l.text.trim()),
      ),
    },
    null,
    2,
  ),
);
console.log("Frozen data extracted from captured public listing.");

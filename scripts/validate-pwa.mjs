import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const publicDir = resolve("public");
const manifest = JSON.parse(await readFile(resolve(publicDir, "manifest.webmanifest"), "utf8"));

const errors = [];
for (const field of ["name", "short_name", "start_url", "display", "theme_color", "background_color"]) {
  if (!manifest[field]) errors.push(`manifest is missing ${field}`);
}

const expectedIcons = new Map([
  ["192x192:any", [192, 192]],
  ["512x512:any", [512, 512]],
  ["512x512:maskable", [512, 512]],
]);

for (const icon of manifest.icons ?? []) {
  const purpose = icon.purpose ?? "any";
  const key = `${icon.sizes}:${purpose}`;
  const expectedSize = expectedIcons.get(key);
  if (!expectedSize) continue;

  try {
    const bytes = await readFile(resolve(publicDir, icon.src.replace(/^\.\//, "")));
    const signature = bytes.subarray(1, 4).toString("ascii");
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (signature !== "PNG" || width !== expectedSize[0] || height !== expectedSize[1]) {
      errors.push(`${icon.src} must be a ${icon.sizes} PNG`);
    }
    expectedIcons.delete(key);
  } catch {
    errors.push(`${icon.src} does not exist`);
  }
}

for (const key of expectedIcons.keys()) errors.push(`manifest is missing icon ${key}`);

const html = await readFile(resolve("index.html"), "utf8");
if (!/rel="apple-touch-icon"[^>]+apple-touch-icon\.png/.test(html)) {
  errors.push("index.html is missing the PNG apple-touch-icon");
}
for (const metadata of ["canonical", "og:title", "og:description", "og:image", "twitter:card"]) {
  if (!html.includes(metadata)) errors.push(`index.html is missing ${metadata} metadata`);
}

try {
  const ogImage = await readFile(resolve(publicDir, "og-image.png"));
  if (ogImage.readUInt32BE(16) !== 1200 || ogImage.readUInt32BE(20) !== 630) {
    errors.push("og-image.png must be 1200x630");
  }
} catch {
  errors.push("og-image.png does not exist");
}

for (const publicFile of ["robots.txt", "sitemap.xml"]) {
  try {
    await readFile(resolve(publicDir, publicFile));
  } catch {
    errors.push(`${publicFile} does not exist`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PWA manifest and icons: OK");
}

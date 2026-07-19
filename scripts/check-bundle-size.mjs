import { gzipSync } from "node:zlib";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const limits = {
  raw: 440 * 1024,
  gzip: 135 * 1024,
};

const assetsDir = new URL("../dist/assets/", import.meta.url);
const assetNames = await readdir(assetsDir);
const entryScripts = assetNames.filter((name) => /^index-.*\.js$/.test(name));

if (entryScripts.length !== 1) {
  throw new Error(`Expected one entry JavaScript asset, found ${entryScripts.length}: ${entryScripts.join(", ")}`);
}

const assetName = entryScripts[0];
const contents = await readFile(join(fileURLToPath(assetsDir), assetName));
const sizes = {
  raw: contents.byteLength,
  gzip: gzipSync(contents).byteLength,
};

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const failures = Object.entries(limits)
  .filter(([kind, limit]) => sizes[kind] > limit)
  .map(([kind, limit]) => `${kind}: ${formatKiB(sizes[kind])} > ${formatKiB(limit)}`);

console.log(
  `Bundle size: ${assetName} raw ${formatKiB(sizes.raw)} / gzip ${formatKiB(sizes.gzip)} ` +
    `(limits ${formatKiB(limits.raw)} / ${formatKiB(limits.gzip)})`,
);

if (failures.length > 0) {
  throw new Error(`Bundle size limit exceeded:\n${failures.join("\n")}`);
}

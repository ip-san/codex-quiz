import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") return markdownFiles(path);
    return entry.isFile() && extname(entry.name) === ".md" ? [path] : [];
  });
}

const failures = [];
for (const file of markdownFiles(root)) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || /^[a-z]+:/i.test(target)) continue;
    const localPath = decodeURIComponent(target.split("#", 1)[0]);
    if (!existsSync(resolve(dirname(file), localPath))) failures.push(`${file.slice(root.length + 1)} -> ${target}`);
  }
}

if (failures.length) {
  console.error(`Broken documentation links:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Documentation links: OK");

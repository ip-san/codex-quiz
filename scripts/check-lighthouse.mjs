import { spawn } from "node:child_process";
import process from "node:process";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const host = "127.0.0.1";
const port = 4174;
const url = `http://${host}:${port}/`;
const thresholds = {
  performance: 0.8,
  accessibility: 0.95,
  "best-practices": 0.9,
  seo: 0.8,
};

const server = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--host", host, "--port", String(port)],
  { stdio: "inherit" },
);

let chrome;

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready at ${url}`);
};

try {
  await waitForServer();
  chrome = await launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });
  const result = await lighthouse(
    url,
    {
      port: chrome.port,
      output: "json",
      logLevel: "error",
    },
    desktopConfig,
  );
  if (!result?.lhr) throw new Error("Lighthouse did not return a report");

  const failures = [];
  for (const [category, minimum] of Object.entries(thresholds)) {
    const score = result.lhr.categories[category]?.score;
    if (typeof score !== "number") throw new Error(`Missing Lighthouse category: ${category}`);
    console.log(`${category}: ${Math.round(score * 100)} (minimum ${Math.round(minimum * 100)})`);
    if (score < minimum) failures.push(`${category} ${Math.round(score * 100)} < ${Math.round(minimum * 100)}`);
  }

  const incompleteAudits = result.lhr.categories.seo.auditRefs
    .filter(({ weight, id }) => weight > 0 && result.lhr.audits[id]?.score !== 1)
    .map(({ id }) => `${id}: ${result.lhr.audits[id]?.title ?? "Unknown audit"}`);
  if (incompleteAudits.length > 0) console.log(`SEO opportunities:\n- ${incompleteAudits.join("\n- ")}`);

  if (failures.length > 0) throw new Error(`Lighthouse thresholds failed: ${failures.join(", ")}`);
} finally {
  try {
    await chrome?.kill();
  } catch (error) {
    console.warn(`Chrome cleanup warning: ${error instanceof Error ? error.message : String(error)}`);
  }
  server.kill();
}

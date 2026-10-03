import { spawn } from "node:child_process";
import process from "node:process";
import { createServer, preview } from "vite";

const isCI = Boolean(process.env.CI);
const args = process.argv.slice(2);
const isPwa = args.includes("playwright.pwa.config.ts");
let server;

try {
  if (!isCI) {
    if (isPwa) {
      server = await preview({
        preview: { host: "127.0.0.1", port: 4175, strictPort: true },
      });
    } else {
      server = await createServer({
        server: { host: "127.0.0.1", port: 4173, strictPort: true },
      });
      await server.listen();
    }
  }

  const child = spawn(
    process.execPath,
    ["node_modules/playwright/cli.js", "test", ...args],
    {
      stdio: "inherit",
      env: isCI ? process.env : { ...process.env, PLAYWRIGHT_EXTERNAL_SERVER: "1" },
    },
  );

  process.exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await server?.close();
}

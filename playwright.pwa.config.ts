import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e-pwa",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:4175", ...devices["Desktop Chrome"] },
  webServer: {
    command: "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
  },
});

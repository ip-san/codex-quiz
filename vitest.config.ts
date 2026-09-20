import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["e2e/**", "e2e-pwa/**", "node_modules/**", "dist/**"],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id) => (id.endsWith("/src/data.ts") ? "quiz-data" : undefined),
      },
    },
  },
});

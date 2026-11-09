import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": "http://localhost:5000" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.js"],
    clearMocks: true,
    restoreMocks: true,
  },
});

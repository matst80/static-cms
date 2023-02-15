import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../static",
  },
  server: {
    proxy: {
      "^/page/.*": {
        target: "http://localhost:3010",
        changeOrigin: true,
      },
      "^/settings/.*": {
        target: "http://localhost:3010",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});

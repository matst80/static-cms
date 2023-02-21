import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../static",
  },
  server: {
    proxy: {
      "^/page.*": {
        target: "https://cms.tornberg.me",
        changeOrigin: true,
      },
      "^/api.*": {
        target: "https://cms.tornberg.me",
        changeOrigin: true,
      },
      "^/settings.*": {
        target: "https://cms.tornberg.me",
        changeOrigin: true,
      },
      "^/assets.*": {
        target: "https://cms.tornberg.me",
        changeOrigin: true,
      },
      "/urls.json": {
        target: "https://cms.tornberg.me",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});

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
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
      "^/settings/.*": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
      "/urls.json": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});

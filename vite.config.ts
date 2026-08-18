import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Freebuff requires HMR to remain disabled.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    hmr: false,
  },
  preview: {
    host: "0.0.0.0",
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ritterstein.app/", // Name deines Repos (WICHTIG!)
  plugins: [react()],
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite configuration for React and Tailwind CSS v4.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

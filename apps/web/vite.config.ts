import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      // `?react` 쿼리가 붙은 SVG만 React 컴포넌트로 변환
      include: "**/*.svg?react",
      svgrOptions: {
        exportType: "default",
        ref: true,
        titleProp: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

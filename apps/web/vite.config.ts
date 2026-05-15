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
    // workspace 패키지(@xross/core)가 react/react-query를 monorepo root에서
    // resolve하면 apps/web의 인스턴스와 달라 "Invalid hook call" 발생
    // → 항상 apps/web의 단일 인스턴스 사용 보장
    dedupe: ["react", "react-dom", "@tanstack/react-query", "zustand"],
  },
});

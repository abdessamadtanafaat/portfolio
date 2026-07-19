import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/**/*.test.{ts,tsx}"],
    setupFiles: [],
    fileParallelism: false,
  },
});

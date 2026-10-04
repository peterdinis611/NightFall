import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  envDir: ".",
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./app/routes",
      generatedRouteTree: "./app/routeTree.gen.ts",
      quoteStyle: "double",
    }),
    react(),
    tsConfigPaths(),
  ],
  resolve: {
    alias: {
      "@convex/_generated": new URL("./convex/_generated", import.meta.url).pathname,
      "~": new URL("./app", import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./app/__tests__/setup.ts"],
    include: ["app/__tests__/**/*.test.ts", "app/__tests__/**/*.test.tsx"],
  },
})

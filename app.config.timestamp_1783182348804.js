// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  vite: {
    plugins: [tsConfigPaths()]
  },
  server: {
    preset: "node-server"
  },
  routers: {
    ssr: {
      entry: "./app/ssr.tsx"
    },
    client: {
      entry: "./app/client.tsx"
    }
  }
});
export {
  app_config_default as default
};

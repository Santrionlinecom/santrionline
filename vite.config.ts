import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Ensure __dirname works in ESM context
// (Node ESM doesn't define __dirname by default)
// This allows stable path resolution for alias config on all platforms.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    cloudflareDevProxyVitePlugin({
      getLoadContext,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
    alias: {
      "~": path.resolve(__dirname, "app"),
      "@": path.resolve(__dirname, "app"),
    },
  },
  build: {
    minify: true,
  },
});

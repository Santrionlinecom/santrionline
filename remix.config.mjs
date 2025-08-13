/**
 * Remix App Configuration for Cloudflare Pages (Vite).
 * Keeping explicit server/client output paths so Cloudflare Pages picks up build/client.
 * Native/binary modules (e.g. better-sqlite3) must NOT be imported anywhere in app/.
 *
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  ignoredRouteFiles: ["**/.*"],
  assetsBuildDirectory: "build/client",
  serverBuildDirectory: "build/server",
  publicPath: "/build/",
  serverModuleFormat: "esm",
  serverPlatform: "cloudflare-pages",
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
  watchPaths: ["drizzle"],
};

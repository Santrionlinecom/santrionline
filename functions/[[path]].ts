// Bridge file wiring Remix build output into Cloudflare Pages Functions.
// We keep types minimal and future-proof without suppressing all checking.
// If the generated build types drift, regenerate with `npm run build`.
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import type { ServerBuild } from '@remix-run/server-runtime';
// Import the generated build output (JS) and cast to ServerBuild at runtime.
// @ts-expect-error - Remix build output dihasilkan saat proses build
import * as rawBuild from '../build/server/index.js'; // eslint-disable-line @typescript-eslint/no-var-requires, import/no-unresolved

const build = rawBuild as unknown as ServerBuild;

// Minimal shape we care about; extend as needed.
// We don't import Remix's full internal PagesArgs type; keep lightweight & permissive.
// params values can be string or string[] (per Remix), so reflect that.
interface CloudflareContextLike {
  request: Request;
  env: Record<string, unknown>;
  params: Record<string, string | string[]>;
  waitUntil?: (p: Promise<unknown>) => void;
  next?: () => Promise<Response>;
  data?: unknown;
}

// Helper to coerce context while keeping implementation simple.
const getLoadContext = ((context: CloudflareContextLike) => ({
  cloudflare: context,
})) as unknown as Parameters<typeof createPagesFunctionHandler>[0]['getLoadContext'];

export const onRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext,
});

import { createRequestHandler, type ServerBuild } from '@remix-run/cloudflare';
import { log, redactEnv } from './app/lib/logger';
// @ts-expect-error - Remix build output dihasilkan saat proses build
import * as build from './build/server'; // eslint-disable-line import/no-unresolved
import { getLoadContext } from './load-context';

// Cast build through unknown to satisfy ServerBuild type requirements
const handleRemixRequest = createRequestHandler(build as unknown as ServerBuild);

export default {
  async fetch(request: Request, env: any, ctx: any) {
    try {
      const url = new URL(request.url);

      // Lightweight health endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }

      // Status endpoint showing which env variables are bound
      if (url.pathname === '/status') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            env: redactEnv({
              CLOUDFLARE_ACCOUNT_ID: env?.CLOUDFLARE_ACCOUNT_ID ? 'set' : 'missing',
              DATABASE_ID: env?.DATABASE_ID ? 'set' : 'missing',
              d1: env?.DB ? 'bound' : 'unbound',
            }),
            ts: Date.now(),
          }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          },
        );
      }

      // Let Remix handle assets
      if (url.pathname.startsWith('/assets/')) {
        const loadContext = getLoadContext({
          request,
          context: {
            cloudflare: {
              cf: (request as any).cf,
              ctx,
              caches,
              env,
            },
          },
        });
        return await handleRemixRequest(request, loadContext);
      }

      // Default handler
      const loadContext = getLoadContext({
        request,
        context: {
          cloudflare: {
            cf: (request as any).cf,
            ctx,
            caches,
            env,
          },
        },
      });
      const start = Date.now();
      const response = await handleRemixRequest(request, loadContext);
      const ms = Date.now() - start;
      log.info('request', {
        method: request.method,
        path: url.pathname,
        status: response.status,
        ms,
      });
      return response;
    } catch (error) {
      log.error('server-error', {
        error: error instanceof Error ? error.message : String(error),
      });
      return new Response('An unexpected error occurred', { status: 500 });
    }
  },
} satisfies ExportedHandler;

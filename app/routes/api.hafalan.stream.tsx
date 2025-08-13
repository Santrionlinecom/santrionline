import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

// Simple in-memory subscriber registry (ephemeral per worker instance)
declare global {
  // eslint-disable-next-line no-var
  var __HAFALAN_SUBSCRIBERS__: Set<WritableStreamDefaultWriter> | undefined;
}

function getSubscribers() {
  if (!globalThis.__HAFALAN_SUBSCRIBERS__) {
    globalThis.__HAFALAN_SUBSCRIBERS__ = new Set();
  }
  return globalThis.__HAFALAN_SUBSCRIBERS__;
}

export function broadcastHafalanEvent(event: { type: string; [key: string]: unknown }) {
  const subs = getSubscribers();
  const encoder = new TextEncoder();
  const payload = `event: hafalan\ndata: ${JSON.stringify(event)}\n\n`;
  for (const writer of subs) {
    try {
      writer.write(encoder.encode(payload));
    } catch {
      /* ignore */
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const subs = getSubscribers();
  subs.add(writer);
  const encoder = new TextEncoder();
  // Initial hello
  await writer.write(encoder.encode('event: hello\ndata: {"ok":true}\n\n'));
  // Heartbeat
  const interval = setInterval(() => {
    writer.write(encoder.encode(': ping\n\n'));
  }, 30000);
  const close = () => {
    clearInterval(interval);
    subs.delete(writer);
    try {
      writer.close();
    } catch {
      /* ignore close errors */
    }
  };
  // Close when client aborts
  request.signal.addEventListener('abort', close);
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export const unstable_shouldReload = () => false;

import { redirect } from '@remix-run/cloudflare';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
// NOTE: server-only session helper dynamically imported inside loader

export async function loader({ request, context }: LoaderFunctionArgs) {
  // Ensure user is logged in
  const { requireUserId } = await import('~/lib/session.server');
  await requireUserId(request, context);
  
  // Redirect directly to dashboard
  throw redirect('/dashboard');
}


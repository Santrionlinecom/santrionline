import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
// NOTE: server-only logout helper moved to dynamic import in action

export async function action({ request, context }: ActionFunctionArgs) {
  const { logout } = await import('~/lib/session.server');
  return logout(request, context);
}

export async function loader() {
  return redirect('/');
}

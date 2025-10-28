import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { logout } from '~/lib/session.server';

export function loader() {
  return redirect('/');
}

export async function action({ request, context }: ActionFunctionArgs) {
  return logout(request, context);
}

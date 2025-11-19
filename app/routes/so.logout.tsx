import { redirect } from '@remix-run/cloudflare';
import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { destroyUserSession } from '~/utils/santri-session.server';

export async function action({ context }: ActionFunctionArgs) {
  const cookie = await destroyUserSession(context);
  return redirect('/so/login', { headers: { 'Set-Cookie': cookie } });
}

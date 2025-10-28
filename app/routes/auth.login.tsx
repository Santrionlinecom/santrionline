import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { safeRedirect } from '~/utils/safe-redirect';
import { getOAuthStateCookie } from '~/utils/oauth.server';

export function loader() {
  return redirect('/');
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createSupabaseServerClient(context);
  const url = new URL(request.url);
  const rawRedirect = url.searchParams.get('redirectTo') ?? undefined;
  const redirectTo = rawRedirect ? safeRedirect(rawRedirect) : '/dashboard';

  const state = crypto.randomUUID();
  const stateCookie = getOAuthStateCookie(context);
  const callbackUrl = new URL('/auth/callback', url.origin).toString();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
      scopes: 'openid email profile',
      queryParams: {
        state,
        prompt: 'select_account',
        access_type: 'offline',
      },
    },
  });

  if (error || !data?.url) {
    throw new Response('Failed to initiate Google authentication.', { status: 500 });
  }

  const headers = new Headers();
  headers.append('Set-Cookie', await stateCookie.serialize({ state, redirectTo }, { maxAge: 600 }));

  return redirect(data.url, {
    headers,
  });
}

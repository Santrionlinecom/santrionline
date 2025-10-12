import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { nanoid } from 'nanoid';
import { getSession, commitSession } from '~/lib/session.server';
import { safeRedirect } from '~/utils/safe-redirect';
import { getGoogleClientConfig } from '~/lib/google-auth.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const googleConfig = getGoogleClientConfig(context);
  if (!googleConfig) {
    throw new Response('Google OAuth belum dikonfigurasi.', { status: 500 });
  }

  const requestUrl = new URL(request.url);
  const rawRedirect = requestUrl.searchParams.get('redirectTo');
  const redirectTo = rawRedirect ? safeRedirect(rawRedirect) : '/dashboard';
  const session = await getSession(request, context);
  const state = nanoid();
  session.set('oauth:state', state);
  session.set('oauth:redirectTo', redirectTo);
  if (rawRedirect) {
    session.set('oauth:redirectProvided', '1');
  } else {
    session.unset('oauth:redirectProvided');
  }

  const callbackUrl = new URL('/auth/google/callback', requestUrl.origin).toString();

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', googleConfig.clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  return redirect(authUrl.toString(), {
    headers: {
      'Set-Cookie': await commitSession(session, context, {
        maxAge: 60 * 10,
      }),
    },
  });
}

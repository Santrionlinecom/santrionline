import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { nanoid } from 'nanoid';
import { getSession, commitSession } from '~/lib/session.server';
import { safeRedirect } from '~/utils/safe-redirect';

function getGoogleClientId(context: LoaderFunctionArgs['context']): string | null {
  const fromContext = context?.cloudflare?.env?.GOOGLE_CLIENT_ID;
  if (fromContext) return fromContext;
  if (typeof process !== 'undefined') {
    const fromProcess = process.env.GOOGLE_CLIENT_ID;
    if (fromProcess) return fromProcess;
  }
  return null;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const clientId = getGoogleClientId(context);
  if (!clientId) {
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
  authUrl.searchParams.set('client_id', clientId);
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

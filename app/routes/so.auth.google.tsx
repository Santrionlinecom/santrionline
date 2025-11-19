import { redirect } from '@remix-run/cloudflare';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare?.env as {
    GOOGLE_CLIENT_ID?: string;
  };
  const clientId = env?.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID belum diisi');
  }
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/so/auth/google/callback`;
  const state = Math.random().toString(36).slice(2);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    state,
    prompt: 'select_account',
  });

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

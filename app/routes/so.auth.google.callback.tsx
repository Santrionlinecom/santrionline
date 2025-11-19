import { json, redirect } from '@remix-run/cloudflare';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { loginWithGoogle } from '~/services/santri-auth.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return redirect('/so/login');

  const env = context.cloudflare?.env as {
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
  };
  const clientId = env?.GOOGLE_CLIENT_ID;
  const clientSecret = env?.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth belum dikonfigurasi');
  }
  const redirectUri = `${url.origin}/so/auth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return json({ error: 'Gagal mendapatkan token' }, { status: 400 });
  }
  const token = await tokenRes.json();
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!profileRes.ok) {
    return json({ error: 'Gagal membaca profil' }, { status: 400 });
  }
  const profile = await profileRes.json();
  const { cookie } = await loginWithGoogle(context, {
    googleId: profile.sub,
    email: profile.email,
    name: profile.name ?? profile.email,
  });

  return redirect('/so', { headers: { 'Set-Cookie': cookie } });
}

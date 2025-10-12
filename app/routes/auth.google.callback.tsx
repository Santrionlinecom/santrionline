import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '~/db/drizzle.server';
import { user as userSchema } from '~/db/schema';
import { createUserSession, getSession, commitSession } from '~/lib/session.server';
import { hashPassword } from '~/lib/crypto.server';
import { ensureWallet } from '~/lib/wallet.server';
import { safeRedirect } from '~/utils/safe-redirect';
import { getGoogleClientConfig } from '~/lib/google-auth.server';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
  credentials: { clientId: string; clientSecret: string },
) {
  const body = new URLSearchParams({
    code,
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menukar kode Google OAuth: ${errorText}`);
  }

  return response.json() as Promise<{
    access_token: string;
    id_token?: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    token_type: string;
  }>;
}

async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data profil Google: ${errorText}`);
  }

  return response.json() as Promise<{
    sub: string;
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  }>;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const session = await getSession(request, context);
  const storedState = session.get('oauth:state');
  const storedRedirect = session.get('oauth:redirectTo') ?? undefined;
  const redirectProvided = session.get('oauth:redirectProvided') === '1';
  const redirectTo = redirectProvided ? safeRedirect(storedRedirect) : '/dashboard';

  session.unset('oauth:state');
  session.unset('oauth:redirectTo');
  session.unset('oauth:redirectProvided');

  const commitAndRedirectToLogin = async (message: string) => {
    const params = new URLSearchParams({ error: message });
    if (redirectProvided) {
      params.set('redirectTo', redirectTo);
    }

    return redirect(`/masuk?${params.toString()}`, {
      headers: {
        'Set-Cookie': await commitSession(session, context),
      },
    });
  };

  if (error) {
    return commitAndRedirectToLogin('Autentikasi Google dibatalkan. Silakan coba lagi.');
  }

  if (!returnedState || !storedState || returnedState !== storedState) {
    return commitAndRedirectToLogin('Token keamanan tidak valid. Silakan coba lagi.');
  }

  if (!code) {
    return commitAndRedirectToLogin('Kode autentikasi tidak ditemukan. Silakan coba lagi.');
  }

  const credentials = getGoogleClientConfig(context);
  if (!credentials) {
    throw new Response('Google OAuth belum dikonfigurasi.', { status: 500 });
  }

  const callbackUrl = new URL('/auth/google/callback', url.origin).toString();

  let tokenResponse: Awaited<ReturnType<typeof exchangeCodeForTokens>>;
  try {
    tokenResponse = await exchangeCodeForTokens(code, callbackUrl, credentials);
  } catch (tokenError) {
    console.error(tokenError);
    return commitAndRedirectToLogin('Gagal melakukan autentikasi dengan Google.');
  }

  if (!tokenResponse?.access_token) {
    return commitAndRedirectToLogin('Google tidak mengembalikan token akses.');
  }

  let profile: Awaited<ReturnType<typeof getGoogleUserInfo>>;
  try {
    profile = await getGoogleUserInfo(tokenResponse.access_token);
  } catch (profileError) {
    console.error(profileError);
    return commitAndRedirectToLogin('Gagal mengambil data pengguna dari Google.');
  }

  if (!profile?.email) {
    return commitAndRedirectToLogin('Google tidak mengembalikan email yang valid.');
  }

  const db = getDb(context);
  let existingUser = profile.sub
    ? await db.query.user.findFirst({ where: eq(userSchema.googleId, profile.sub) })
    : null;

  if (!existingUser) {
    existingUser = await db.query.user.findFirst({ where: eq(userSchema.email, profile.email) });
  }

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    const updates: Partial<typeof userSchema.$inferSelect> = {
      updatedAt: new Date(),
    };

    if (!existingUser.googleId && profile.sub) {
      updates.googleId = profile.sub;
    }
    if (!existingUser.avatarUrl && profile.picture) {
      updates.avatarUrl = profile.picture;
    }
    if (!existingUser.name && profile.name) {
      updates.name = profile.name;
    }

    if (Object.keys(updates).length > 1) {
      await db.update(userSchema).set(updates).where(eq(userSchema.id, userId));
    }
  } else {
    userId = nanoid();
    const generatedPassword =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : nanoid();
    const passwordHash = await hashPassword(generatedPassword);

    await db.insert(userSchema).values({
      id: userId,
      email: profile.email,
      name: profile.name ?? profile.email,
      passwordHash,
      avatarUrl: profile.picture ?? null,
      googleId: profile.sub ?? null,
      createdAt: new Date(),
      role: 'santri',
      isPublic: true,
      theme: 'light',
    });

    try {
      await ensureWallet(db, userId);
    } catch (walletError) {
      console.warn('Gagal membuat dompet awal untuk pengguna Google:', walletError);
    }
  }

  return createUserSession({
    request,
    context,
    userId,
    remember: true,
    redirectTo,
    session,
  });
}

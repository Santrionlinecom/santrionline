import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { getOAuthStateCookie } from '~/utils/oauth.server';
import { safeRedirect } from '~/utils/safe-redirect';
import { users, legacyUser } from '~/db/schema';
import { getDb } from '~/db/drizzle.server';
import { isAdminEmail } from '~/utils/admin';
import { setSessionTokens } from '~/lib/session.server';
import { hashPassword } from '~/lib/crypto.server';
import { ensureWallet } from '~/lib/wallet.server';

export function loader() {
  return redirect('/');
}

export async function action({ request, context }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  const stateCookie = getOAuthStateCookie(context);
  const storedStateData = await stateCookie.parse(request.headers.get('Cookie'));

  const storedState =
    typeof storedStateData === 'object' && storedStateData ? storedStateData.state : null;
  const storedRedirect =
    typeof storedStateData === 'object' && storedStateData && 'redirectTo' in storedStateData
      ? (storedStateData.redirectTo as string)
      : null;
  const redirectTo = safeRedirect(storedRedirect ?? '/dashboard');

  const clearStateHeader = await stateCookie.serialize('', { maxAge: 0 });
  const failureHeaders = new Headers({ 'Set-Cookie': clearStateHeader });

  const redirectWithError = (message: string) => {
    const params = new URLSearchParams({ error: message });
    if (storedRedirect) {
      params.set('redirectTo', storedRedirect);
    }
    throw redirect(`/masuk?${params.toString()}`, { headers: failureHeaders });
  };

  if (error || errorDescription) {
    const message = errorDescription ?? 'Google authentication was cancelled.';
    redirectWithError(message);
  }

  if (!code || !returnedState || !storedState || returnedState !== storedState) {
    redirectWithError('Invalid authentication state.');
  }

  const supabase = createSupabaseServerClient(context);
  const callbackUrl = new URL('/auth/callback', url.origin).toString();

  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession({
    authCode: code,
    redirectTo: callbackUrl,
  });

  if (exchangeError || !data.session) {
    const message = exchangeError?.message ?? 'Unable to complete Google authentication.';
    redirectWithError(message);
  }

  const session = data.session;
  const supabaseUser = session.user ?? data.user;

  if (!supabaseUser?.id || !supabaseUser.email) {
    redirectWithError('Google account is missing email information.');
  }

  const email = supabaseUser.email.toLowerCase();
  const name =
    (supabaseUser.user_metadata?.full_name as string | undefined) ??
    (supabaseUser.user_metadata?.name as string | undefined) ??
    email;
  const avatarUrl = (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? null;
  const role = isAdminEmail(email, context) ? 'admin' : 'santri';

  const db = getDb(context);

  await db
    .insert(users)
    .values({
      id: supabaseUser.id,
      email,
      name,
      avatarUrl,
      role,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email,
        name,
        avatarUrl,
        role,
      },
    });

  const existingLegacyUser = await db.query.legacyUser.findFirst({
    where: eq(legacyUser.id, supabaseUser.id),
  });

  if (existingLegacyUser) {
    await db
      .update(legacyUser)
      .set({
        email,
        name,
        avatarUrl,
        role,
        googleId: supabaseUser.id,
        updatedAt: new Date(),
      })
      .where(eq(legacyUser.id, supabaseUser.id));
  } else {
    const passwordHash = await hashPassword(crypto.randomUUID());
    await db.insert(legacyUser).values({
      id: supabaseUser.id,
      email,
      name,
      avatarUrl,
      googleId: supabaseUser.id,
      passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
      theme: 'light',
    });
  }

  try {
    await ensureWallet(db, supabaseUser.id);
  } catch (walletError) {
    console.warn('Failed to ensure wallet on OAuth login', walletError);
  }

  const sessionCookie = await setSessionTokens(context, {
    accessToken: session.access_token,
    refreshToken: session.refresh_token ?? null,
    expiresAt: session.expires_at ?? null,
  });

  const headers = new Headers();
  headers.append('Set-Cookie', sessionCookie);
  headers.append('Set-Cookie', clearStateHeader);

  return redirect(redirectTo, { headers });
}

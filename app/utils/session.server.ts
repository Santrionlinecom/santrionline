import { createCookie, redirect } from '@remix-run/cloudflare';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';
import {
  createSupabaseServerClient,
  type SupabaseAuthUser,
  type SupabaseServerClient,
} from './supabase.server';
import { isAdminEmail } from './admin';
import { getDb } from '~/db/drizzle.server';
import { users } from '~/db/schema';

function getUserMetadataString(user: SupabaseAuthUser, key: string): string | null {
  const metadata = user.user_metadata;
  if (metadata && typeof metadata === 'object') {
    const value = (metadata as Record<string, unknown>)[key];
    return typeof value === 'string' && value.length > 0 ? value : null;
  }
  return null;
}

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number | null;
};

export type SessionUser = {
  id: string;
  email: string;
  role: 'santri' | 'admin';
  name?: string | null;
  avatarUrl?: string | null;
  accessToken: string;
  refreshToken?: string | null;
  supabase?: {
    id: string;
    aud?: string;
    email?: string;
  };
};

const COOKIE_NAME = 'sb:session';

function getAppEnv(context: AppLoadContext): string | undefined {
  const env = context?.cloudflare?.env as { APP_ENV?: string } | undefined;
  return env?.APP_ENV ?? (typeof process !== 'undefined' ? process.env?.APP_ENV : undefined);
}

function getSessionSecret(context: AppLoadContext): string {
  const envSecret = (context?.cloudflare?.env as { SESSION_SECRET?: string } | undefined)
    ?.SESSION_SECRET;
  if (envSecret) return envSecret;
  if (typeof process !== 'undefined' && process.env?.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  return 'dev-secret-change-me';
}

function getSessionCookie(context: AppLoadContext) {
  const isProduction = getAppEnv(context) === 'production';
  return createCookie(COOKIE_NAME, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: isProduction,
    secrets: [getSessionSecret(context)],
  });
}

export async function getSessionTokens(
  request: Request,
  context: AppLoadContext,
): Promise<SessionTokens | null> {
  const cookie = getSessionCookie(context);
  const parsed = await cookie.parse(request.headers.get('Cookie'));
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const tokens = parsed as SessionTokens;
  if (!tokens.accessToken) {
    return null;
  }
  return tokens;
}

export async function createSessionCookieHeader(
  context: AppLoadContext,
  tokens: SessionTokens,
): Promise<string> {
  const cookie = getSessionCookie(context);
  const now = Math.floor(Date.now() / 1000);
  const maxAge = tokens.expiresAt ? Math.max(tokens.expiresAt - now, 60 * 60) : 60 * 60 * 24 * 7;
  return cookie.serialize(tokens, { maxAge });
}

export async function destroySessionCookie(context: AppLoadContext): Promise<string> {
  const cookie = getSessionCookie(context);
  return cookie.serialize('', { maxAge: 0 });
}

async function getSupabaseUser(
  client: SupabaseServerClient,
  accessToken: string,
): Promise<SupabaseAuthUser | null> {
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data?.user) {
    return null;
  }
  return data.user;
}

export async function getUser(
  request: Request,
  context: AppLoadContext,
): Promise<SessionUser | null> {
  const tokens = await getSessionTokens(request, context);
  if (!tokens) {
    return null;
  }

  try {
    const supabase = createSupabaseServerClient(context);
    const supabaseUser = await getSupabaseUser(supabase, tokens.accessToken);
    if (!supabaseUser) {
      return null;
    }

    const db = getDb(context);
    const dbUser = await db.query.users.findFirst({ where: eq(users.id, supabaseUser.id) });
    if (!dbUser) {
      const metadataFullName = getUserMetadataString(supabaseUser, 'full_name');
      const metadataName = getUserMetadataString(supabaseUser, 'name');
      const metadataAvatar = getUserMetadataString(supabaseUser, 'avatar_url');

      return {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        role: isAdminEmail(supabaseUser.email ?? null, context) ? 'admin' : 'santri',
        name: metadataFullName ?? metadataName ?? supabaseUser.email ?? null,
        avatarUrl: metadataAvatar,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        supabase: {
          id: supabaseUser.id,
          aud: supabaseUser.aud ?? undefined,
          email: supabaseUser.email ?? undefined,
        },
      };
    }

    const metadataFullName = getUserMetadataString(supabaseUser, 'full_name');
    const metadataName = getUserMetadataString(supabaseUser, 'name');
    const metadataAvatar = getUserMetadataString(supabaseUser, 'avatar_url');

    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      name: dbUser.name ?? metadataFullName ?? metadataName ?? null,
      avatarUrl: dbUser.avatarUrl ?? metadataAvatar,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? null,
      supabase: {
        id: supabaseUser.id,
        aud: supabaseUser.aud ?? undefined,
        email: supabaseUser.email ?? undefined,
      },
    } satisfies SessionUser;
  } catch (error) {
    console.error('Failed to resolve user session', error);
    return null;
  }
}

export async function requireUser(request: Request, context: AppLoadContext): Promise<SessionUser> {
  const user = await getUser(request, context);
  if (!user) {
    throw redirect('/');
  }
  return user;
}

export async function requireUserId(request: Request, context: AppLoadContext): Promise<string> {
  const user = await requireUser(request, context);
  return user.id;
}

export async function requireAdminUserId(
  request: Request,
  context: AppLoadContext,
): Promise<string> {
  const user = await requireUser(request, context);
  if (user.role !== 'admin' && !isAdminEmail(user.email, context)) {
    throw redirect('/dashboard?error=unauthorized');
  }
  return user.id;
}

export async function logout(request: Request, context: AppLoadContext) {
  const tokens = await getSessionTokens(request, context);
  const supabase = createSupabaseServerClient(context);
  if (tokens?.accessToken && tokens?.refreshToken) {
    try {
      await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Failed to revoke Supabase session', error);
    }
  }

  const headers = new Headers();
  headers.append('Set-Cookie', await destroySessionCookie(context));
  return redirect('/', {
    headers,
  });
}

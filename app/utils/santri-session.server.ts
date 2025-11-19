import { createCookie, redirect } from '@remix-run/cloudflare';
import type { AppLoadContext } from '@remix-run/cloudflare';
import type { Role } from '~/db/santri-app.server';
import { getSantriDb, soUsers } from '~/db/santri-app.server';
import { eq } from 'drizzle-orm';

const COOKIE_NAME = 'so:session';

function getSessionSecret(context: AppLoadContext): string {
  const secret = (context.cloudflare?.env as { SESSION_SECRET?: string } | undefined)?.SESSION_SECRET;
  if (secret) return secret;
  if (typeof process !== 'undefined' && process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  return 'dev-secret-change-me';
}

function getSessionCookie(context: AppLoadContext) {
  const isProduction = (context.cloudflare?.env as { APP_ENV?: string } | undefined)?.APP_ENV === 'production';
  return createCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    secrets: [getSessionSecret(context)],
    maxAge: 60 * 60 * 24 * 30,
  });
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export async function getSessionUser(
  request: Request,
  context: AppLoadContext,
): Promise<SessionUser | null> {
  const cookie = getSessionCookie(context);
  const parsed = await cookie.parse(request.headers.get('Cookie'));
  if (!parsed || typeof parsed !== 'object' || !parsed.userId) return null;
  const db = getSantriDb(context);
  const row = await db.query.soUsers.findFirst({ where: eq(soUsers.id, parsed.userId) });
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export async function requireUser(
  request: Request,
  context: AppLoadContext,
): Promise<SessionUser> {
  const user = await getSessionUser(request, context);
  if (!user) {
    const redirectTo = new URL(request.url).pathname;
    throw redirect(`/so/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}

export async function requireRole(
  request: Request,
  context: AppLoadContext,
  allowed: Role[],
): Promise<SessionUser> {
  const user = await requireUser(request, context);
  if (!allowed.includes(user.role)) {
    throw redirect('/so');
  }
  return user;
}

export async function createUserSession(
  context: AppLoadContext,
  userId: string,
): Promise<string> {
  const cookie = getSessionCookie(context);
  return cookie.serialize({ userId });
}

export async function destroyUserSession(context: AppLoadContext): Promise<string> {
  const cookie = getSessionCookie(context);
  return cookie.serialize('', { maxAge: 0 });
}

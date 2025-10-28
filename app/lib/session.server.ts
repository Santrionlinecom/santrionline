export type { SessionTokens, SessionUser } from '~/utils/session.server';

export {
  getSessionTokens as getSession,
  createSessionCookieHeader,
  destroySessionCookie as destroySession,
  getUser,
  requireUser,
  requireUserId,
  requireAdminUserId,
  logout,
} from '~/utils/session.server';

import type { AppLoadContext } from '@remix-run/cloudflare';
import type { SessionTokens, SessionUser } from '~/utils/session.server';
import {
  getUser as getSessionUser,
  createSessionCookieHeader,
  destroySessionCookie,
} from '~/utils/session.server';

export async function getUserId(
  request: Request,
  context: AppLoadContext,
): Promise<string | undefined> {
  const user = await getSessionUser(request, context);
  return user?.id;
}

export async function setSessionTokens(
  context: AppLoadContext,
  tokens: SessionTokens,
): Promise<string> {
  return createSessionCookieHeader(context, tokens);
}

export async function clearSession(context: AppLoadContext): Promise<string> {
  return destroySessionCookie(context);
}

export async function getUserProfile(
  request: Request,
  context: AppLoadContext,
): Promise<SessionUser | null> {
  return getSessionUser(request, context);
}

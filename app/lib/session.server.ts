import { createCookieSessionStorage, redirect } from '@remix-run/cloudflare';
import type { AppLoadContext } from '@remix-run/cloudflare';

export type User = {
  id: string;
  email: string;
  role: 'santri' | 'admin';
  name?: string;
};

const USER_SESSION_KEY = 'userId';
const DEFAULT_SECRET = 'DEV_SECRET_CHANGE_ME_IN_PRODUCTION';

function getSessionSecret(context: AppLoadContext): string {
  try {
    const secret = context?.cloudflare?.env?.SESSION_SECRET;
    if (secret) {
      return secret;
    }
  } catch (error) {
    console.warn('Could not access environment variables, using default secret for development');
  }
  
  // Fallback for development
  return DEFAULT_SECRET;
}

function createSessionStore(context: AppLoadContext) {
  const secret = getSessionSecret(context);
  const isProduction = context?.cloudflare?.env?.APP_ENV === 'production';
  
  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [secret],
      secure: isProduction,
    },
  });
}

export async function getSession(request: Request, context: AppLoadContext) {
  try {
    const cookie = request.headers.get('Cookie');
    return createSessionStore(context).getSession(cookie);
  } catch (error) {
    console.error('Error getting session:', error);
    // Return empty session if there's an error
    return createSessionStore(context).getSession();
  }
}

export async function getUserId(
  request: Request, 
  context: AppLoadContext
): Promise<string | undefined> {
  try {
    const session = await getSession(request, context);
    const userId = session.get(USER_SESSION_KEY);
    return userId ? String(userId) : undefined;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return undefined;
  }
}

export async function requireUserId(
  request: Request,
  context: AppLoadContext,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getUserId(request, context);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/masuk?${searchParams}`);
  }
  return userId;
}

export async function requireAdminUserId(
  request: Request,
  context: AppLoadContext,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getUserId(request, context);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/masuk?${searchParams}`);
  }
  
  // Get user from database to check role
  const { getDb } = await import('~/db/drizzle.server');
  const { user } = await import('~/db/schema');
  const { eq } = await import('drizzle-orm');
  
  const db = getDb(context);
  const userRecord = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });
  
  if (!userRecord || userRecord.role !== 'admin') {
    throw redirect('/dashboard?error=unauthorized');
  }
  
  return userId;
}

export async function createUserSession({
  request,
  context,
  userId,
  remember = false,
  redirectTo = '/dashboard',
}: {
  request: Request;
  context: AppLoadContext;
  userId: string;
  remember?: boolean;
  redirectTo?: string;
}) {
  try {
    const session = await getSession(request, context);
    session.set(USER_SESSION_KEY, userId);
    const sessionStorage = createSessionStore(context);
    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session, {
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        }),
      },
    });
  } catch (error) {
    console.error('Error creating user session:', error);
    throw redirect(redirectTo);
  }
}

export async function logout(request: Request, context: AppLoadContext) {
  try {
    const session = await getSession(request, context);
    const sessionStorage = createSessionStore(context);
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session),
      },
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return redirect('/');
  }
}
import { createCookie } from '@remix-run/cloudflare';
import type { AppLoadContext } from '@remix-run/cloudflare';

function readEnv(context: AppLoadContext, key: string): string | undefined {
  const envRecord = context?.cloudflare?.env as unknown as
    | Record<string, string | undefined>
    | undefined;
  const envValue = envRecord?.[key];
  if (envValue) return envValue;
  if (typeof process !== 'undefined') {
    const value = process.env?.[key];
    if (value) return value;
  }
  return undefined;
}

function isProduction(context: AppLoadContext): boolean {
  return (readEnv(context, 'APP_ENV') ?? '').toLowerCase() === 'production';
}

function getCookieSecret(context: AppLoadContext): string {
  return readEnv(context, 'SESSION_SECRET') ?? 'dev-secret-change-me';
}

export function getOAuthStateCookie(context: AppLoadContext) {
  return createCookie('sb:oauth-state', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(context),
    path: '/',
    secrets: [getCookieSecret(context)],
  });
}

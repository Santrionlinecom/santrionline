import type { AppLoadContext } from '@remix-run/cloudflare';

function getAdminEmailsRaw(context: AppLoadContext): string | null {
  const fromEnv = context?.cloudflare?.env as { ADMIN_EMAILS?: string } | undefined;
  if (fromEnv?.ADMIN_EMAILS) {
    return fromEnv.ADMIN_EMAILS;
  }

  if (typeof process !== 'undefined' && process.env?.ADMIN_EMAILS) {
    return process.env.ADMIN_EMAILS;
  }

  return null;
}

export function getAdminEmails(context: AppLoadContext): string[] {
  const raw = getAdminEmailsRaw(context);
  if (!raw) return [];

  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isAdminEmail(email: string | null | undefined, context: AppLoadContext): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return getAdminEmails(context).includes(normalized);
}

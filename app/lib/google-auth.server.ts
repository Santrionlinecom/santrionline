import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

type GoogleEnv = {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

type RemixContext = LoaderFunctionArgs['context'];

function getCloudflareEnv(context: RemixContext): GoogleEnv | undefined {
  return (context as { cloudflare?: { env?: GoogleEnv } } | undefined)?.cloudflare?.env;
}

function readEnv(context: RemixContext, key: keyof GoogleEnv): string | undefined {
  const cloudflareEnv = getCloudflareEnv(context);
  if (cloudflareEnv?.[key]) {
    return cloudflareEnv[key];
  }

  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  return undefined;
}

export type GoogleClientConfig = {
  clientId: string;
  clientSecret: string;
};

export function getGoogleClientConfig(context: RemixContext): GoogleClientConfig | null {
  const clientId = readEnv(context, 'GOOGLE_CLIENT_ID');
  const clientSecret = readEnv(context, 'GOOGLE_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret };
}

export function hasGoogleClientConfig(context: RemixContext): boolean {
  return getGoogleClientConfig(context) !== null;
}

export function getGoogleClientId(context: RemixContext): string | null {
  return getGoogleClientConfig(context)?.clientId ?? null;
}

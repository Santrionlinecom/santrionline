import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppLoadContext } from '@remix-run/cloudflare';

export type SupabaseServerClient = SupabaseClient;

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function getFromProcessEnv(key: string) {
  if (typeof process !== 'undefined' && process.env && key in process.env) {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return null;
}

export function getSupabaseConfig(context: AppLoadContext): SupabaseConfig {
  const env = context?.cloudflare?.env ?? {};
  const url = (env as { SUPABASE_URL?: string }).SUPABASE_URL ?? getFromProcessEnv('SUPABASE_URL');
  const anonKey =
    (env as { SUPABASE_ANON_KEY?: string }).SUPABASE_ANON_KEY ??
    getFromProcessEnv('SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return { url, anonKey };
}

export function createSupabaseServerClient(
  context: AppLoadContext,
  options?: { global?: { fetch?: typeof fetch } },
): SupabaseServerClient {
  const { url, anonKey } = getSupabaseConfig(context);

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch:
        options?.global?.fetch ??
        (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : undefined),
    },
  });
}

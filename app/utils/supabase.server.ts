import type { AppLoadContext } from '@remix-run/cloudflare';

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseAuthUser = {
  id: string;
  email?: string | null;
  aud?: string | null;
  user_metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string | null;
  expires_in: number;
  expires_at: number | null;
  token_type: string;
  provider_token?: string | null;
  user: SupabaseAuthUser | null;
};

type SupabaseAuthError = {
  message: string;
  status?: number;
};

type OAuthOptions = {
  provider: 'google';
  options: {
    redirectTo: string;
    scopes?: string;
    queryParams?: Record<string, string | number | boolean>;
  };
};

export type ExchangeCodeForSessionConfig = {
  authCode: string;
  redirectTo: string;
};

type SetSessionConfig = {
  access_token: string;
  refresh_token?: string | null;
};

type FetchLike = typeof fetch;

function resolveFetch(customFetch?: FetchLike): FetchLike {
  if (customFetch) return customFetch;
  if (typeof fetch === 'function') {
    return fetch.bind(globalThis) as typeof fetch;
  }
  throw new Error('Fetch API is not available in this environment.');
}

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

class SupabaseAuthApi {
  #config: SupabaseConfig;
  #fetch: FetchLike;
  #sessionTokens: { accessToken: string; refreshToken?: string | null } | null = null;

  constructor(config: SupabaseConfig, fetchImpl: FetchLike) {
    this.#config = config;
    this.#fetch = fetchImpl;
  }

  #resolveUrl(path: string) {
    return new URL(path, this.#config.url).toString();
  }

  #headers(accessToken?: string) {
    const headers = new Headers({
      apikey: this.#config.anonKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }

  async getUser(
    accessToken: string,
  ): Promise<{ data: { user: SupabaseAuthUser | null }; error: SupabaseAuthError | null }> {
    try {
      const response = await this.#fetch(this.#resolveUrl('/auth/v1/user'), {
        method: 'GET',
        headers: this.#headers(accessToken),
      });

      if (!response.ok) {
        const message = await response.text();
        return {
          data: { user: null },
          error: {
            message: message || 'Failed to retrieve Supabase user.',
            status: response.status,
          },
        };
      }

      const payload = (await response.json()) as { user?: SupabaseAuthUser | null };
      return { data: { user: payload?.user ?? null }, error: null };
    } catch (error) {
      return {
        data: { user: null },
        error: { message: error instanceof Error ? error.message : 'Unknown Supabase error.' },
      };
    }
  }

  async signInWithOAuth({ provider, options }: OAuthOptions): Promise<{
    data: { url: string | null };
    error: SupabaseAuthError | null;
  }> {
    if (provider !== 'google') {
      return {
        data: { url: null },
        error: { message: `Unsupported OAuth provider: ${provider}` },
      };
    }

    const authorizeUrl = new URL('/auth/v1/authorize', this.#config.url);
    authorizeUrl.searchParams.set('provider', provider);
    authorizeUrl.searchParams.set('redirect_to', options.redirectTo);
    if (options.scopes) {
      authorizeUrl.searchParams.set('scopes', options.scopes);
    }
    if (options.queryParams) {
      for (const [key, value] of Object.entries(options.queryParams)) {
        authorizeUrl.searchParams.set(key, String(value));
      }
    }

    return { data: { url: authorizeUrl.toString() }, error: null };
  }

  async exchangeCodeForSession({ authCode, redirectTo }: ExchangeCodeForSessionConfig): Promise<{
    data: { session: SupabaseSession | null; user: SupabaseAuthUser | null };
    error: SupabaseAuthError | null;
  }> {
    try {
      const response = await this.#fetch(
        `${this.#resolveUrl('/auth/v1/token')}?grant_type=authorization_code`,
        {
          method: 'POST',
          headers: this.#headers(),
          body: JSON.stringify({ code: authCode, redirect_to: redirectTo }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        return {
          data: { session: null, user: null },
          error: {
            message: message || 'Failed to exchange authorization code.',
            status: response.status,
          },
        };
      }

      const payload = (await response.json()) as {
        access_token: string;
        refresh_token?: string | null;
        expires_in?: number;
        expires_at?: number | null;
        token_type?: string;
        provider_token?: string | null;
        user?: SupabaseAuthUser | null;
      };

      const expiresIn = payload.expires_in ?? 0;
      const session: SupabaseSession = {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token ?? null,
        expires_in: expiresIn,
        expires_at:
          payload.expires_at ?? (expiresIn > 0 ? Math.floor(Date.now() / 1000) + expiresIn : null),
        token_type: payload.token_type ?? 'bearer',
        provider_token: payload.provider_token ?? null,
        user: payload.user ?? null,
      };

      this.#sessionTokens = {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      };

      return { data: { session, user: session.user }, error: null };
    } catch (error) {
      return {
        data: { session: null, user: null },
        error: { message: error instanceof Error ? error.message : 'Unknown Supabase error.' },
      };
    }
  }

  async setSession(session: SetSessionConfig): Promise<{
    data: { session: SupabaseSession | null; user: SupabaseAuthUser | null };
    error: SupabaseAuthError | null;
  }> {
    this.#sessionTokens = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token ?? null,
    };

    return {
      data: {
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token ?? null,
          expires_in: 0,
          expires_at: null,
          token_type: 'bearer',
          provider_token: null,
          user: null,
        },
        user: null,
      },
      error: null,
    };
  }

  async signOut(): Promise<{ error: SupabaseAuthError | null }> {
    if (!this.#sessionTokens?.accessToken) {
      return { error: null };
    }

    try {
      const body =
        this.#sessionTokens.refreshToken && this.#sessionTokens.refreshToken.length > 0
          ? JSON.stringify({ refresh_token: this.#sessionTokens.refreshToken })
          : null;

      const response = await this.#fetch(this.#resolveUrl('/auth/v1/logout'), {
        method: 'POST',
        headers: this.#headers(this.#sessionTokens.accessToken),
        body,
      });

      if (!response.ok) {
        const message = await response.text();
        return {
          error: {
            message: message || 'Failed to sign out from Supabase.',
            status: response.status,
          },
        };
      }

      this.#sessionTokens = null;
      return { error: null };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : 'Unknown Supabase error.' },
      };
    }
  }
}

export class SupabaseServerClient {
  auth: SupabaseAuthApi;

  constructor(config: SupabaseConfig, fetchImpl: FetchLike) {
    this.auth = new SupabaseAuthApi(config, fetchImpl);
  }
}

export function createSupabaseServerClient(
  context: AppLoadContext,
  options?: { global?: { fetch?: typeof fetch } },
): SupabaseServerClient {
  const config = getSupabaseConfig(context);
  const fetchImpl = resolveFetch(options?.global?.fetch);
  return new SupabaseServerClient(config, fetchImpl);
}

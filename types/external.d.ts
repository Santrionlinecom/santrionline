declare module '@supabase/supabase-js' {
  export type SupabaseClient = {
    auth: {
      getUser: (
        accessToken: string,
      ) => Promise<{ data: { user: any | null }; error: Error | null }>;
      signInWithOAuth: (config: any) => Promise<{ data: { url?: string }; error: Error | null }>;
      exchangeCodeForSession: (
        config: any,
      ) => Promise<{ data: { session: any; user: any }; error: Error | null }>;
      setSession: (session: { access_token: string; refresh_token: string }) => Promise<any>;
      signOut: () => Promise<any>;
    };
  };

  export function createClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any,
  ): SupabaseClient;
}

declare module 'drizzle-orm/d1-http' {
  export type DrizzleHttpConfig = {
    accountId: string;
    databaseId: string;
    token: string;
  };

  export function drizzle(config: DrizzleHttpConfig): any;
}

declare module 'drizzle-orm/d1-http/migrator' {
  export function migrate(db: any, options: { migrationsFolder: string }): Promise<void>;
}

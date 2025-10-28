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

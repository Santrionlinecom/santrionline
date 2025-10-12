// Fallback declarations untuk meredam error editor sementara.
// Hapus bila tidak diperlukan lagi.
declare module 'vite/client';
declare module 'vitest';
declare module '../build/server/index.js' {
  const build: unknown;
  export = build;
}

declare module '../build/server/index' {
  const build: unknown;
  export = build;
}

declare module '../build/server' {
  const build: unknown;
  export = build;
}

declare module './build/server' {
  const build: unknown;
  export = build;
}

declare module './build/server/index' {
  const build: unknown;
  export = build;
}

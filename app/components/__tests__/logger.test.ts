import { describe, it, expect } from 'vitest';
import { redactEnv, time } from '~/lib/logger';

describe('logger utils', () => {
  it('redacts sensitive keys', () => {
    const input = { API_TOKEN: 'abc', password: 'secret', normal: 'ok' };
    const out = redactEnv(input)!;
    expect(out.API_TOKEN).toBe('***');
    expect(out.password).toBe('***');
    expect(out.normal).toBe('ok');
  });

  it('time wrapper returns result sync', () => {
    const r = time('sync-op', () => 42);
    expect(r).toBe(42);
  });

  it('time wrapper returns result async', async () => {
    const r = await time('async-op', async () => 21 * 2);
    expect(r).toBe(42);
  });
});

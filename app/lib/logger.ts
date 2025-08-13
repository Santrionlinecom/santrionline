/* Simple structured logger with level filtering.
 * Usage: import { log } from '~/lib/logger'; log.info('message', { meta });
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const envLevel = (typeof process !== 'undefined' ? process.env.LOG_LEVEL : undefined) as Level | undefined;
const ACTIVE_LEVEL: Level = envLevel && LEVEL_ORDER[envLevel] ? envLevel : 'info';
const SQL_ENABLED = (typeof process !== 'undefined' ? process.env.LOG_SQL : undefined) === '1';
const SAMPLE_RATE = (() => {
  const raw = typeof process !== 'undefined' ? process.env.LOG_DEBUG_SAMPLE : undefined;
  const num = raw ? Number(raw) : NaN;
  if (!isNaN(num) && num >= 0 && num <= 1) return num;
  return 0.1; // default 10%
})();

function shouldLog(level: Level) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[ACTIVE_LEVEL]) return false;
  if (level === 'debug' && SAMPLE_RATE < 1) {
    if (Math.random() > SAMPLE_RATE) return false;
  }
  return true;
}

function base(level: Level, msg: string, meta?: unknown) {
  if (!shouldLog(level)) return;
  const entry = {
    t: new Date().toISOString(),
    level,
    msg,
    ...(meta ? { meta } : {}),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export const log = {
  debug: (m: string, meta?: unknown) => base('debug', m, meta),
  info: (m: string, meta?: unknown) => base('info', m, meta),
  warn: (m: string, meta?: unknown) => base('warn', m, meta),
  error: (m: string, meta?: unknown) => base('error', m, meta),
  sql: (m: string, meta?: unknown) => {
    if (SQL_ENABLED) base('debug', m, meta);
  },
};

export function time<T>(label: string, fn: () => Promise<T>): Promise<T>;
export function time<T>(label: string, fn: () => T): T;
export function time<T>(label: string, fn: () => T | Promise<T>): T | Promise<T> {
  const start = performance.now();
  const finish = (ok: boolean, err?: unknown) => {
    const dur = +(performance.now() - start).toFixed(2);
    if (ok) log.debug(`timer:${label}`, { ms: dur });
    else log.error(`timer:${label}`, { ms: dur, error: err instanceof Error ? err.message : err });
  };
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(r => { finish(true); return r; }).catch(e => { finish(false, e); throw e; });
    }
    finish(true);
    return result;
  } catch (e) {
    finish(false, e);
    throw e;
  }
}

export function redactEnv(env?: Record<string, unknown>) {
  if (!env) return env;
  const clone: Record<string, unknown> = {};
  for (const k of Object.keys(env)) {
    if (/token|secret|key|password/i.test(k)) clone[k] = '***'; else clone[k] = env[k];
  }
  return clone;
}

// --- PII Masking Helpers ----------------------------------------------------
const EMAIL_REGEX = /([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})/gi;
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

export function maskPII(value: string): string {
  return value
    .replace(EMAIL_REGEX, (_m, user, domain) => `${user[0]}***@${domain}`)
    .replace(UUID_REGEX, (m) => m.substring(0, 8) + '-****-****-****-' + m.substring(m.length - 12));
}

export function maskObjectPII(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskObjectPII);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[k] = maskPII(v);
    else if (typeof v === 'object') out[k] = maskObjectPII(v);
    else out[k] = v;
  }
  return out;
}

// --- Query Metrics Aggregation ----------------------------------------------
interface QueryMetric { c: number; totalMs: number; }
const queryMetrics: Record<string, QueryMetric> = {};

export function recordQuery(sql: string, ms: number) {
  const key = sql.split(/\s+/)[0].toUpperCase(); // e.g. SELECT / INSERT
  const entry = queryMetrics[key] || { c: 0, totalMs: 0 };
  entry.c += 1;
  entry.totalMs += ms;
  queryMetrics[key] = entry;
}

export function flushQueryMetrics() {
  const snapshot = Object.entries(queryMetrics).map(([k, v]) => ({ op: k, count: v.c, avgMs: +(v.totalMs / v.c).toFixed(2) }));
  if (snapshot.length) log.info('query-metrics', snapshot);
  for (const k of Object.keys(queryMetrics)) delete queryMetrics[k];
}

// Periodic flush (only if running in a long-lived worker context; safe no-op if not)
try {
  setInterval(() => flushQueryMetrics(), 60000).unref?.();
} catch { /* ignore in edge context if setInterval differs */ }

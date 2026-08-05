// src/lib/rateLimit.ts
//
// Minimal in-memory sliding-window rate limiter -- a first line of defense
// against runaway API usage on the live chat endpoint. Like storage.ts's
// in-memory fallback, this resets on server restart and isn't shared across
// serverless instances, so it's not a substitute for a real rate limiter
// (e.g. Upstash Ratelimit) at real scale -- but it stops a single abusive
// client from burning through API spend in a tight loop, which is the
// realistic risk for a small shared app like this one.

import "server-only";

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, number[]>();

/** Returns true if `key` has exceeded the allowed request rate. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

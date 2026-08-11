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

// --- Login lockout ---
//
// Separate from the generic limiter above: this only counts FAILED login
// attempts (a legitimate user retyping a password a couple times shouldn't
// get themselves locked out), keyed by source IP so an attacker can't lock
// out a real teammate's account just by guessing their email. Same
// in-memory caveat applies -- resets on restart, not shared across
// serverless instances -- but it stops a naive scripted brute-force loop,
// which is the realistic threat against a 2-account login form.

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5;

const loginFailures = new Map<string, number[]>();

/** True if `key` has hit the failed-attempt ceiling and should be blocked from trying again right now. */
export function isLoginLocked(key: string): boolean {
  const now = Date.now();
  const recent = (loginFailures.get(key) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
  return recent.length >= LOGIN_MAX_ATTEMPTS;
}

/** Records one failed login attempt for `key`. */
export function recordFailedLogin(key: string): void {
  const now = Date.now();
  const recent = (loginFailures.get(key) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
  recent.push(now);
  loginFailures.set(key, recent);
}

/** Clears failed-attempt history for `key` -- call this on a successful login. */
export function clearFailedLogins(key: string): void {
  loginFailures.delete(key);
}

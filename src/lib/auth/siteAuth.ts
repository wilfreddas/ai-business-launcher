// src/lib/auth/siteAuth.ts
//
// Real per-person login: a signed cookie proves both "this request is
// authenticated" and, just as importantly, *as which person* -- so the app
// can show "Logged in as Wilfred" instead of just a locked/unlocked state.
// Still deliberately simple: accounts live in the AUTH_USERS env var (see
// users.ts), and the cookie is a stateless HMAC rather than a server-side
// session store, so there's no database involved for 2-3 people.

import { getAuthUsers, type AuthUser } from "./users";

export const SITE_AUTH_COOKIE = "site_auth";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function signingSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.warn(
      "⚠️  AUTH_SECRET not set — using an insecure fallback signing key. Set a real AUTH_SECRET before deploying to production."
    );
  }
  return secret || "dev-only-insecure-fallback-secret";
}

async function sign(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(signingSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(signature);
}

/** Whether the login gate is active at all -- opt-in via AUTH_USERS. */
export function isAuthGateEnabled(): boolean {
  return getAuthUsers().length > 0;
}

/**
 * Builds the signed cookie value for an authenticated user's email.
 * The email is base64url-encoded before signing/storing so a "." delimiter
 * is always safe to split on, even though real email addresses contain dots.
 */
export async function buildAuthCookieValue(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const encoded = Buffer.from(normalized, "utf8").toString("base64url");
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

/** Verifies a cookie value and returns the authenticated user, or null. */
export async function getUserFromCookie(value: string | undefined): Promise<AuthUser | null> {
  if (!isAuthGateEnabled()) return null;
  if (!value) return null;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = await sign(encoded);
  if (signature !== expected) return null;

  let email: string;
  try {
    email = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }

  return getAuthUsers().find((u) => u.email.toLowerCase() === email) ?? null;
}

/** Checks whether an existing cookie value proves valid prior authentication. */
export async function isValidAuthCookie(value: string | undefined): Promise<boolean> {
  if (!isAuthGateEnabled()) return true;
  return Boolean(await getUserFromCookie(value));
}

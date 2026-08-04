// src/lib/auth/siteAuth.ts
//
// A deliberately simple, stateless shared-password gate — not a full
// accounts system. If SITE_PASSWORD isn't set, the gate is a no-op (open
// app, same as before). If it is set, every request needs a signed cookie
// proving the visitor entered that password. Uses the Web Crypto API so the
// same code works in both Middleware (Edge runtime) and Server Actions
// (Node runtime).

export const SITE_AUTH_COOKIE = "site_auth";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeToken(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode("ai-business-launcher:authenticated")
  );
  return toHex(signature);
}

/** Whether the password gate is active at all. */
export function isAuthGateEnabled(): boolean {
  return Boolean(process.env.SITE_PASSWORD);
}

/** The cookie value to set once someone enters the correct password. */
export async function getAuthCookieValue(): Promise<string | null> {
  const secret = process.env.SITE_PASSWORD;
  if (!secret) return null;
  return computeToken(secret);
}

/** Checks a submitted password against the configured one. */
export function isCorrectPassword(password: string): boolean {
  const configured = process.env.SITE_PASSWORD;
  if (!configured) return true;
  return password === configured;
}

/** Checks whether an existing cookie value proves prior authentication. */
export async function isValidAuthCookie(value: string | undefined): Promise<boolean> {
  const secret = process.env.SITE_PASSWORD;
  if (!secret) return true;
  if (!value) return false;
  const expected = await computeToken(secret);
  return value === expected;
}

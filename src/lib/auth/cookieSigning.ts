// src/lib/auth/cookieSigning.ts
//
// The stateless HMAC sign/verify primitive, extracted out of siteAuth.ts so
// the client-account and customer-account logins (features/accounts) can
// reuse the exact same signing logic and secret instead of a second copy.

export function toHex(buffer: ArrayBuffer): string {
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

export async function sign(value: string): Promise<string> {
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

/** Signs a JSON-serializable payload, returning `base64url(json).signature`. */
export async function signPayload(payload: unknown): Promise<string> {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

/** Verifies a `signPayload` cookie value and returns the decoded payload, or null. */
export async function verifyPayload<T>(value: string | undefined): Promise<T | null> {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = await sign(encoded);
  if (signature !== expected) return null;

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

// src/lib/auth/passwords.ts
//
// Password hashing for real signup-based accounts (features/accounts) --
// distinct from the internal team login (users.ts), which compares
// plaintext against AUTH_USERS because those 2-3 passwords are set directly
// by a developer in an env var, never typed into a signup form by a
// stranger. Anything a stranger can sign up with needs a real hash.
// Uses Node's built-in scrypt so no extra dependency is needed.

import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

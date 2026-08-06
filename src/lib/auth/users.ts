// src/lib/auth/users.ts
//
// Real named accounts (you + your CEO, and anyone else added later), defined
// entirely through the AUTH_USERS env var so adding a person, changing an
// email, or rotating a password is a config change, never a code change.
// Deliberately not a database table -- at a handful of people, a JSON env
// var is the right amount of infrastructure, not a shortcut.
//
// Set AUTH_USERS to a JSON array, e.g.:
// AUTH_USERS=[{"name":"Wilfred","email":"you@example.com","password":"..."},{"name":"Aaron","email":"aaron@example.com","password":"..."}]

import "server-only";

export interface AuthUser {
  name: string;
  email: string;
  password: string;
}

let cached: AuthUser[] | null = null;

export function getAuthUsers(): AuthUser[] {
  if (cached) return cached;

  const raw = process.env.AUTH_USERS;
  if (!raw) {
    cached = [];
    return cached;
  }

  try {
    const parsed = JSON.parse(raw);
    cached = Array.isArray(parsed)
      ? parsed.filter(
          (u): u is AuthUser =>
            u && typeof u.name === "string" && typeof u.email === "string" && typeof u.password === "string"
        )
      : [];
  } catch {
    console.warn("⚠️  AUTH_USERS is set but isn't valid JSON — no one can log in until it's fixed.");
    cached = [];
  }

  return cached;
}

/** Whether any accounts are configured -- the gate is opt-in, same as before. */
export function isAuthConfigured(): boolean {
  return getAuthUsers().length > 0;
}

export function findUser(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    getAuthUsers().find((u) => u.email.toLowerCase() === normalized && u.password === password) ?? null
  );
}

export function findUserByEmail(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  return getAuthUsers().find((u) => u.email.toLowerCase() === normalized) ?? null;
}

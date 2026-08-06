// src/lib/auth/session.ts
//
// Server Component-side "who's logged in" helper -- separate from
// siteAuth.ts because that file works with a raw cookie string (used from
// both proxy.ts, which reads NextRequest cookies, and Server Actions/
// Components, which read next/headers cookies() -- two different APIs for
// the same underlying cookie).

import "server-only";
import { cookies } from "next/headers";
import { SITE_AUTH_COOKIE, getUserFromCookie } from "./siteAuth";
import type { AuthUser } from "./users";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  return getUserFromCookie(store.get(SITE_AUTH_COOKIE)?.value);
}

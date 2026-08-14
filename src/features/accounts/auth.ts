// src/features/accounts/auth.ts
//
// Session cookie for client + customer logins. One cookie for both roles
// (the payload carries which role/site it's for) since a browser is only
// ever logged in as one of them at a time for a given site -- simpler than
// juggling two cookie names.

import "server-only";
import { cookies } from "next/headers";
import { signPayload, verifyPayload } from "@/lib/auth/cookieSigning";
import { getAccountById } from "./storage";
import type { AccountRole, AccountSession, SiteAccount } from "./types";

export const ACCOUNT_COOKIE = "site_account";

export async function buildAccountCookieValue(session: AccountSession): Promise<string> {
  return signPayload(session);
}

async function readSession(): Promise<AccountSession | null> {
  const store = await cookies();
  return verifyPayload<AccountSession>(store.get(ACCOUNT_COOKIE)?.value);
}

/** The logged-in account for this exact site+role, or null. Scoped so a
 * customer session for one business can't be reused to view another's
 * portal, and a client session can't double as a customer session. */
export async function getAccountSession(slug: string, role: AccountRole): Promise<SiteAccount | null> {
  const session = await readSession();
  if (!session || session.slug !== slug || session.role !== role) return null;
  return getAccountById(slug, role, session.accountId);
}

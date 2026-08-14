// src/features/accounts/types.ts
//
// Two roles, one shape: a "client" account is the business owner managing
// their own site (separate from your internal Wilfred/Aaron team login); a
// "customer" account is one of their end customers, signing up to book with
// that specific business. Both are scoped to a single site (slug) -- there's
// no cross-business identity here, matching how a customer actually thinks
// about it ("my account with this dentist"), not a platform-wide account.

export type AccountRole = "client" | "customer";

export interface SiteAccount {
  id: string;
  slug: string;
  role: AccountRole;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

/** What the signed session cookie actually stores. */
export interface AccountSession {
  accountId: string;
  slug: string;
  role: AccountRole;
}

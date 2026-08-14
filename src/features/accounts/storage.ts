// src/features/accounts/storage.ts
//
// Server-only persistence for client + customer accounts. Keyed per
// site+role (a "client" list naturally only ever holds one account -- that's
// enforced at signup, not by the storage shape, so both roles share the same
// simple list-per-key pattern rather than one being a special case).

import "server-only";
import { randomUUID } from "crypto";
import { getRedis } from "@/lib/redis";
import type { AccountRole, SiteAccount } from "./types";

const memoryAccounts = new Map<string, SiteAccount[]>();

function accountsKey(slug: string, role: AccountRole): string {
  return `accounts:${slug}:${role}`;
}

async function readAll(slug: string, role: AccountRole): Promise<SiteAccount[]> {
  const redis = getRedis();
  if (redis) {
    return (await redis.get<SiteAccount[]>(accountsKey(slug, role))) || [];
  }
  return memoryAccounts.get(accountsKey(slug, role)) || [];
}

async function writeAll(slug: string, role: AccountRole, accounts: SiteAccount[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(accountsKey(slug, role), accounts);
  } else {
    memoryAccounts.set(accountsKey(slug, role), accounts);
  }
}

export async function findAccountByEmail(
  slug: string,
  role: AccountRole,
  email: string
): Promise<SiteAccount | null> {
  const normalized = email.trim().toLowerCase();
  const all = await readAll(slug, role);
  return all.find((a) => a.email.toLowerCase() === normalized) ?? null;
}

export async function getAccountById(
  slug: string,
  role: AccountRole,
  accountId: string
): Promise<SiteAccount | null> {
  const all = await readAll(slug, role);
  return all.find((a) => a.id === accountId) ?? null;
}

/** Every customer account for a site -- e.g. for a future "customer list" view. */
export async function listAccounts(slug: string, role: AccountRole): Promise<SiteAccount[]> {
  return readAll(slug, role);
}

export async function createAccount(
  slug: string,
  role: AccountRole,
  input: { name: string; email: string; passwordHash: string }
): Promise<SiteAccount> {
  const account: SiteAccount = {
    id: randomUUID(),
    slug,
    role,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };

  const existing = await readAll(slug, role);
  await writeAll(slug, role, [...existing, account]);
  return account;
}

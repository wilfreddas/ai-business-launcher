"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth/passwords";
import { isRateLimited } from "@/lib/rateLimit";
import { ACCOUNT_COOKIE, buildAccountCookieValue } from "./auth";
import { createAccount, findAccountByEmail, listAccounts } from "./storage";
import type { AccountRole } from "./types";

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

async function setSessionCookie(slug: string, role: AccountRole, accountId: string) {
  const token = await buildAccountCookieValue({ slug, role, accountId });
  const cookieStore = await cookies();
  cookieStore.set(ACCOUNT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function signUpAction(slug: string, role: AccountRole, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const loginPath = role === "client" ? `/site/${slug}/portal/login` : `/site/${slug}/account/login`;
  const homePath = role === "client" ? `/site/${slug}/portal` : `/site/${slug}/account`;

  if (isRateLimited(`account-signup:${await getClientIp()}`)) {
    redirect(`${loginPath}?error=rate_limited`);
  }

  if (!name || !email || !password || password.length < 8) {
    redirect(`${loginPath}?error=invalid&mode=signup`);
  }

  // Only one client account per site -- the business owner, not a shared pool.
  if (role === "client" && (await listAccounts(slug, "client")).length > 0) {
    redirect(`${loginPath}?error=exists&mode=signup`);
  }

  const existing = await findAccountByEmail(slug, role, email);
  if (existing) {
    redirect(`${loginPath}?error=exists&mode=signup`);
  }

  const account = await createAccount(slug, role, { name, email, passwordHash: hashPassword(password) });
  await setSessionCookie(slug, role, account.id);
  redirect(homePath);
}

export async function logInAction(slug: string, role: AccountRole, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const loginPath = role === "client" ? `/site/${slug}/portal/login` : `/site/${slug}/account/login`;
  const homePath = role === "client" ? `/site/${slug}/portal` : `/site/${slug}/account`;

  if (isRateLimited(`account-login:${await getClientIp()}`)) {
    redirect(`${loginPath}?error=rate_limited`);
  }

  const account = await findAccountByEmail(slug, role, email);
  if (!account || !verifyPassword(password, account.passwordHash)) {
    redirect(`${loginPath}?error=invalid`);
  }

  await setSessionCookie(slug, role, account.id);
  redirect(homePath);
}

export async function logOutAction(slug: string, role: AccountRole) {
  const cookieStore = await cookies();
  cookieStore.delete(ACCOUNT_COOKIE);
  redirect(role === "client" ? `/site/${slug}/portal/login` : `/site/${slug}/account/login`);
}

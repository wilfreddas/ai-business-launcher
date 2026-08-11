"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_AUTH_COOKIE, buildAuthCookieValue } from "@/lib/auth/siteAuth";
import { findUser } from "@/lib/auth/users";
import { isLoginLocked, recordFailedLogin, clearFailedLogins } from "@/lib/rateLimit";

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/dashboard");
  const safeNext = nextPath.startsWith("/") ? nextPath : "/dashboard";

  const lockKey = `login:${await getClientIp()}`;
  if (isLoginLocked(lockKey)) {
    redirect(`/login?error=locked&next=${encodeURIComponent(safeNext)}`);
  }

  const user = findUser(email, password);
  if (!user) {
    recordFailedLogin(lockKey);
    redirect(`/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  clearFailedLogins(lockKey);

  const token = await buildAuthCookieValue(user.email);
  const cookieStore = await cookies();
  cookieStore.set(SITE_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(safeNext);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SITE_AUTH_COOKIE);
  redirect("/login");
}

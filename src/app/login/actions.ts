"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_AUTH_COOKIE, buildAuthCookieValue } from "@/lib/auth/siteAuth";
import { findUser } from "@/lib/auth/users";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/dashboard");
  const safeNext = nextPath.startsWith("/") ? nextPath : "/dashboard";

  const user = findUser(email, password);
  if (!user) {
    redirect(`/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

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

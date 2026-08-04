"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_AUTH_COOKIE, getAuthCookieValue, isCorrectPassword } from "@/lib/auth/siteAuth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/");
  const safeNext = nextPath.startsWith("/") ? nextPath : "/";

  if (!isCorrectPassword(password)) {
    redirect(`/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  const token = await getAuthCookieValue();
  if (token) {
    const cookieStore = await cookies();
    cookieStore.set(SITE_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  redirect(safeNext);
}

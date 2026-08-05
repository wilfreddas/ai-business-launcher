import { NextResponse, type NextRequest } from "next/server";
import { SITE_AUTH_COOKIE, isAuthGateEnabled, isValidAuthCookie } from "@/lib/auth/siteAuth";

// Routes that stay public even when SITE_PASSWORD is set. The password gate
// protects the internal tool (dashboard/create/edit) -- it must NOT block
// real customers from viewing a published site or using its contact form /
// live chat, or the whole "real website customers can use" point of this
// app breaks the moment the owner turns the gate on.
function isPubliclyReachable(pathname: string): boolean {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/site/") ||
    pathname.startsWith("/api/contact") ||
    pathname.startsWith("/api/site-chat")
  );
}

export async function proxy(request: NextRequest) {
  // Gate is entirely opt-in: set SITE_PASSWORD to turn it on.
  if (!isAuthGateEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (isPubliclyReachable(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SITE_AUTH_COOKIE)?.value;
  const authenticated = await isValidAuthCookie(cookie);

  if (authenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

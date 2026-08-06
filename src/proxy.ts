import { NextResponse, type NextRequest } from "next/server";
import { SITE_AUTH_COOKIE, isAuthGateEnabled, isValidAuthCookie } from "@/lib/auth/siteAuth";

// Routes that stay public even when the login gate is on. The gate protects
// the internal tool (dashboard/create/edit) -- it must NOT block the public
// marketing homepage, real customers viewing a published site, or a site's
// contact form / live chat, or the whole point of this app breaks the
// moment the gate is turned on.
function isPubliclyReachable(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/site/") ||
    pathname.startsWith("/api/contact") ||
    pathname.startsWith("/api/site-chat")
  );
}

export async function proxy(request: NextRequest) {
  // Gate is entirely opt-in: set AUTH_USERS to turn it on.
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

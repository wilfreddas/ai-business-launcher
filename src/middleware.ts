import { NextResponse, type NextRequest } from "next/server";
import { SITE_AUTH_COOKIE, isAuthGateEnabled, isValidAuthCookie } from "@/lib/auth/siteAuth";

export async function middleware(request: NextRequest) {
  // Gate is entirely opt-in: set SITE_PASSWORD to turn it on.
  if (!isAuthGateEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login")) {
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

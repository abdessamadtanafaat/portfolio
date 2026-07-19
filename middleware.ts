import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API auth routes through without check
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get("admin-session")?.value
    || request.cookies.get("__Secure-next-auth.session-token")?.value
    || request.cookies.get("next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/admin/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

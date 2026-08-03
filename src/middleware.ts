import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication (members/admins only)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/messages",
  "/notifications",
  "/settings",
  "/admin",
  "/match",
];

// Routes only for unauthenticated users (redirect to dashboard if logged in)
const AUTH_ONLY_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/join",
];

// Public routes — never redirect these regardless of auth state
// /discover, /women, /locations, /profile, /about, /safety, /privacy, /terms, /contact
// are all public by default (not in PROTECTED_ROUTES)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "pinorpinor_secret_jwt_key_2026_super_secure_99",
  });

  const isAuthenticated = !!token;

  // /register is now an alias redirect to /join — handle in the page file
  // but keep it out of auth protection

  // Authenticated users don't need to see auth-only pages
  if (AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    // Extra: admin routes require admin/moderator role
    if (pathname.startsWith("/admin")) {
      const role = token?.role as string | undefined;
      if (!role || !["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)" ],
};

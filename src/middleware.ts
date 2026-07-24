import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/messages",
  "/notifications",
  "/settings",
];

// Routes that require admin/moderator role
const ADMIN_ROUTES = ["/admin"];

// Routes that redirect authenticated users away (login, register)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check auth session
  const session = await auth();

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  // ── Rate limiting headers (simple - use Redis in production) ──
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "index, follow");

  // ── Maintenance mode check ────────────────────────────────────
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    if (!pathname.startsWith("/maintenance") && !pathname.startsWith("/api/health")) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
    return response;
  }

  // ── Redirect authenticated users away from auth pages ─────────
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // ── Protect admin routes ──────────────────────────────────────
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    if (!["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(userRole || "")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // ── Protect dashboard routes ──────────────────────────────────
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
};

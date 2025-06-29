import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`🛡️ Middleware running for: ${request.nextUrl.pathname}`);

  // Try to get token from cookies first, then from Authorization header
  let token = request.cookies.get("userToken")?.value;

  // If no cookie, check Authorization header (for API calls)
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}`);

  // Routes
  const publicRoutes = ["/login", "/signup"];
  const semiPublicRoutes = [
    "/signup/personal-info",
    "/signup/professional-info",
    "/waiting",
    "/loading",
  ];

  // routes that require authentication
  const protectedRoutes = ["/home", "/applied", "/colleges"];

  // Handle root path
  if (pathname === "/") {
    if (token) {
      console.log(
        `[Middleware] User with token at root, redirecting to /loading for status check`
      );
      return NextResponse.redirect(new URL("/loading", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle semi-public routes (require token but allow pending users - checked in Authwrapper)
  if (semiPublicRoutes.includes(pathname)) {
    if (!token) {
      console.log(
        `[Middleware] No token for semi-public route ${pathname}, redirecting to /login`
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // AuthWrapper handles the detailed status checks
    return NextResponse.next();
  }

  // Check if it's a protected route ( token and "approved" )
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      console.log(
        `[Middleware] No token for protected route ${pathname}, redirecting to /login`
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Let AuthWrapper handle the detailed status-based routing
    return NextResponse.next();
  }
  // For all other routes, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

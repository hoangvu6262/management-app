import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

// Routes that require authentication
const protectedRoutes = [
  "/",
  "/football-matches",
  "/calendar",
  "/analytics",
  "/projects",
  "/schedule",
];

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp <= currentTime;
  } catch {
    return true;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if user has valid authentication
  const hasValidToken = accessToken && !isTokenExpired(accessToken);
  const hasRefreshToken = refreshToken;

  // User is considered authenticated if they have a valid access token or a refresh token
  const isAuthenticated = hasValidToken || hasRefreshToken;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // If user is authenticated and trying to access public routes (like login)
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to login with current path as redirect parameter
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If access token is expired but refresh token exists, let the app handle refresh
  if (
    accessToken &&
    isTokenExpired(accessToken) &&
    hasRefreshToken &&
    isProtectedRoute
  ) {
    // Don't redirect, let the client-side handle token refresh
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

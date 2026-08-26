import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const session = user ? { role: user.user_metadata?.role } : null;

  // Guest-only auth pages
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthPage) {
    if (session) {
      // Redirect signed-in user away from auth pages to their role portal
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
    }
    return supabaseResponse;
  }

  // Protected Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      // Not logged in -> Redirect to sign-in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Root dashboard hit -> Redirect to specific role dashboard
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
    }

    // Role-Based Access Control (RBAC)
    if (pathname.startsWith("/dashboard/student") && session.role !== "student") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
    }
    
    if (pathname.startsWith("/dashboard/institute") && session.role !== "institute") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
    }
    
    if (pathname.startsWith("/dashboard/mentor") && session.role !== "mentor") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

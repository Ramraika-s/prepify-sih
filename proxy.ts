import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const session = user ? { role: user.app_metadata?.role || user.user_metadata?.role || "student" } : null;

  const redirectWithCookies = (url: URL) => {
    const res = NextResponse.redirect(url);
    // Forward the refreshed cookies to the redirect
    supabaseResponse.cookies.getAll().forEach((cookie: { name: string, value: string, [key: string]: any }) => {
      res.cookies.set(cookie.name, cookie.value, cookie);
    });
    return res;
  };

  // Guest-only auth pages
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthPage) {
    if (session) {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }
    return supabaseResponse;
  }

  // Protected Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return redirectWithCookies(new URL("/sign-in", request.url));
    }

    const isStudentRoute = pathname.startsWith("/dashboard/student");
    const isInstituteRoute = pathname.startsWith("/dashboard/institute");
    const isMentorRoute = pathname.startsWith("/dashboard/mentor");
    const isAdminRoute = pathname.startsWith("/dashboard/admin");

    if (isStudentRoute && session.role !== "student" && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }

    if (isInstituteRoute && session.role !== "institute" && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }

    if (isMentorRoute && session.role !== "mentor" && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }

    if (isAdminRoute && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }

    // Catch-all for generic /dashboard or any unknown dashboard sub-routes
    if (!isStudentRoute && !isInstituteRoute && !isMentorRoute && !isAdminRoute) {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

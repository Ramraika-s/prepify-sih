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
    supabaseResponse.cookies.getAll().forEach((cookie) => {
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

    if (pathname === "/dashboard") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }

    if (pathname.startsWith("/dashboard/student") && session.role !== "student" && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }
    
    if (pathname.startsWith("/dashboard/institute") && session.role !== "institute" && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }
    
    if (pathname.startsWith("/dashboard/mentor") && session.role !== "mentor" && session.role !== "admin") {
      return redirectWithCookies(new URL(`/dashboard/${session.role}`, request.url));
    }
    
    if (pathname.startsWith("/dashboard/admin") && session.role !== "admin") {
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

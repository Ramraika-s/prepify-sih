import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "prepify_super_secret_jwt_key_2026_production_grade_secure_token";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = "prepify_token";

interface TokenPayload {
  userId: string;
  email: string;
  role: "student" | "institute" | "mentor";
}

async function verifyEdgeToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const session = token ? await verifyEdgeToken(token) : null;

  // Guest-only auth pages
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthPage) {
    if (session) {
      // Redirect signed-in user away from auth pages to their role portal
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
    }
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
  ],
};

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect this page
  if (pathname === "/ask-a-question") {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        console.log("[middleware] No token found, redirecting to /auth/signin");
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    } catch (err) {
      console.error("[middleware] Token error:", err);
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ask-a-question"],
};

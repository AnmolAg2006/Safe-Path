import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // ✅ PUBLIC ROUTES (no auth required)
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/auth-hero.jpg") ||   // 👈 ALLOW IMAGE
    pathname.startsWith("/auth-visual.png") || // (optional, future)
    pathname.startsWith("/logo.svg")            // (optional)
  ) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // ❌ Not logged in → redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // ✅ Logged in → allow
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Run middleware on all routes EXCEPT Next internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

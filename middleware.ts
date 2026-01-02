import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Redirect to sign-in if not authenticated and accessing protected routes
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|logo.svg|.*\\.(?:png|jpg|jpeg|svg|webp)).*)",
  ],
}

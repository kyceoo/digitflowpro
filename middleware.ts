import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page and API routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check for session in cookies
  const session = request.cookies.get("dfp_session")?.value

  if (!session) {
    // Redirect to login if no session
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify session with API
  try {
    const verifyResponse = await fetch(new URL("/api/auth/check", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `dfp_session=${session}`,
      },
    })

    if (!verifyResponse.ok) {
      // Invalid session, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("dfp_session")
      return response
    }

    return NextResponse.next()
  } catch (error) {
    // On error, redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("dfp_session")
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

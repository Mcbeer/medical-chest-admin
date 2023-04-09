import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check the cookie, to see if we first of all have one
  // And if it's still a valid JWT
  // If not valid, then we redirect, otherwise, just go to the URL

  if (url.pathname === "/unauthorized") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "./env/server.mjs";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  console.log(request.cookies);

  if (url.pathname === "/") {
    // Check the cookie, to see if we first of all have one
    // And if it's still a valid JWT
    // If not valid, then we redirect, otherwise, just go to the URL

    const token = request.cookies.get("token");

    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const isAuthorized = await jwtVerify(
      token.value,
      new TextEncoder().encode(env.JSONWEBTOKEN_SECRET)
    );

    if (typeof isAuthorized === "string") {
      throw new Error("Thats strange");
    }

    // Cannot access index page without being authorized
    if (!isAuthorized) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
}

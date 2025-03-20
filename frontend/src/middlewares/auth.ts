import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.pathname;

  // Define o basePath
  const basePath = "/app1";

  if (!token && !url.endsWith(`${basePath}/login`)) {
    return NextResponse.redirect(new URL(`${basePath}/login`, req.url));
  }
  if (token && url.endsWith(`${basePath}/login`)) {
    return NextResponse.redirect(new URL(`${basePath}/`, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
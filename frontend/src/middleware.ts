import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redireciona chamadas para /api/auth para /slogin/auth
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newUrl.pathname.replace('/api/auth', '/slogin/auth');
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*'],
}; 
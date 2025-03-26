/**
 * Middleware to handle internationalization in Next.js App Router
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';

// Configure accepted languages
acceptLanguage.languages(['en', 'pt', 'sv']);

// Cookie name for storing locale
export const COOKIE_NAME = 'NEXT_LOCALE';

export function middleware(request: NextRequest) {
  // Get locale from cookie, URL or accept-language header
  let locale;
  
  // Check if locale is already set in cookies
  if (request.cookies.has(COOKIE_NAME)) {
    locale = acceptLanguage.get(request.cookies.get(COOKIE_NAME)?.value);
  }
  
  // If not in cookies, check the accept-language header
  if (!locale) {
    locale = acceptLanguage.get(request.headers.get('Accept-Language'));
  }
  
  // Fallback to default locale
  if (!locale) {
    locale = 'en';
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Set cookie if it's not there or different
  if (request.cookies.get(COOKIE_NAME)?.value !== locale) {
    response.cookies.set(COOKIE_NAME, locale);
  }
  
  return response;
}

// Only run middleware on specific routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 
/**
 * Cookies utility functions
 */

import { cookies } from 'next/headers';
import { getCookie as getClientCookie, setCookie, deleteCookie } from 'cookies-next';

/**
 * Get a cookie value on the server
 */
export function getRequestCookie(name: string): string | undefined {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  } catch (error) {
    console.error('Error accessing server cookies:', error);
    return undefined;
  }
}

/**
 * Fallback to client-side cookie if server cookie is not available
 * This is used when the component is rendered on the client
 */
export function getCookieValue(name: string): string | undefined {
  // Try to get from client cookies if we're on the client side
  if (typeof window !== 'undefined') {
    return getClientCookie(name) as string | undefined;
  }
  
  // Otherwise try server cookies (may fail in some contexts)
  try {
    return getRequestCookie(name);
  } catch (error) {
    return undefined;
  }
}

/**
 * Set a cookie value
 */
export function setRequestCookie(name: string, value: string, options = {}): void {
  setCookie(name, value, options);
}

/**
 * Delete a cookie
 */
export function deleteRequestCookie(name: string, options = {}): void {
  deleteCookie(name, options);
} 
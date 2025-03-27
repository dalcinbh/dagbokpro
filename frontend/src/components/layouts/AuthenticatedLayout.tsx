/**
 * Layout for authenticated pages
 * Includes navigation menu and verifies authentication
 */

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useTranslation } from '@/i18n';
import Navigation from '@/components/Navigation';

/**
 * Props for the authenticated layout component
 */
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Authenticated layout component
 * Wraps pages that require authentication
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();
  const { t, isLoading } = useTranslation(['common']);

  // Handle loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 
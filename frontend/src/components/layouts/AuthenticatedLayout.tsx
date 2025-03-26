/**
 * Layout for authenticated pages
 * Includes navigation menu and verifies authentication
 */

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import Navigation from '@/components/Navigation';

/**
 * Props for the authenticated layout component
 */
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for pages that require authentication
 * Redirects to the login page if not authenticated
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');

  // Check authentication and redirect to login if necessary
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  // Display a loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, don't render content
  if (status === 'unauthenticated') {
    return null;
  }

  // Render layout with navigation for authenticated users
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} {t('appName')} - {t('footer.allRightsReserved')}
        </div>
      </footer>
    </div>
  );
} 
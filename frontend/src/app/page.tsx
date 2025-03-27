/**
 * Root page with social login
 */
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { signInWithGoogle, signInWithGitHub, signInWithLinkedIn } from '@/lib/auth';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const { t, isLoading } = useTranslation('common');

  if (session) {
    redirect('/dashboard');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="mt-2 text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Dagbok
        </h1>
        <h2 className="text-center text-sm text-gray-600">
          {t('auth.chooseProvider')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              {t('auth.continueWithGoogle')}
            </button>

            <button
              onClick={() => signInWithGitHub()}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="mr-2"
              />
              {t('auth.continueWithGitHub')}
            </button>

            <button
              onClick={() => signInWithLinkedIn()}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={20}
                height={20}
                className="mr-2"
              />
              {t('auth.continueWithLinkedIn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
/**
 * Complete Registration Page
 * Displayed after social login if user needs to complete their profile
 */

import { Metadata } from 'next';
import CompleteRegistration from '@/components/auth/CompleteRegistration';

export const metadata: Metadata = {
  title: 'Complete Registration - Dagbok',
  description: 'Complete your profile to start using Dagbok',
};

export default function CompleteRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide additional information to complete your registration
        </p>
      </div>

      <div className="mt-8">
        <CompleteRegistration />
      </div>
    </div>
  );
} 
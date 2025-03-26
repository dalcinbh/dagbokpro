'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Authentication Error Page
 * Displays user-friendly error messages for different authentication failure scenarios
 */
export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get error parameters from URL
    if (searchParams) {
      const error = searchParams.get('error');
      setErrorType(error);

      // Set error message based on type
      switch (error) {
        case 'Configuration':
          setErrorMessage('There was a problem with the authentication server configuration.');
          break;
        case 'AccessDenied':
          setErrorMessage('Access denied. You do not have permission to log in.');
          break;
        case 'Verification':
          setErrorMessage('The verification link has expired or has already been used.');
          break;
        case 'OAuthSignin':
          setErrorMessage('Error starting the OAuth authentication flow.');
          break;
        case 'OAuthCallback':
          setErrorMessage('Error processing the authentication callback. Check your credentials.');
          break;
        case 'OAuthCreateAccount':
          setErrorMessage('Could not create an account linked to your social account.');
          break;
        case 'EmailCreateAccount':
          setErrorMessage('Could not create an account using this email.');
          break;
        case 'Callback':
          setErrorMessage('Error during authentication processing.');
          break;
        case 'OAuthAccountNotLinked':
          setErrorMessage('To confirm your identity, please sign in with the same account you used originally.');
          break;
        case 'SessionRequired':
          setErrorMessage('You must be authenticated to access this page.');
          break;
        default:
          setErrorMessage('An unknown error occurred during authentication.');
          break;
      }
    }
  }, [searchParams]);

  // Display error details for diagnostic purposes in development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            The authentication process could not be completed
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-medium text-red-800">{errorType || 'Error'}</h4>
            </div>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          </div>
          
          {isDevelopment && errorType && (
            <div className="mt-4 rounded-md bg-gray-100 p-4">
              <p className="text-xs font-mono text-gray-600">Error code: {errorType}</p>
              <p className="text-xs font-mono text-gray-600">URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Link href="/login" className="w-full h-full inline-flex items-center justify-center">Back to Login</Link>
          </Button>
          <Button>
            <Link href="/" className="w-full h-full inline-flex items-center justify-center">Home Page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 
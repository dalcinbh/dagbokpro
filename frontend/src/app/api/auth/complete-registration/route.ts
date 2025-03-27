/**
 * API Route: Complete Registration
 * Handles the completion of user registration after social login
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    
    // Send data to Django backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/complete-registration/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData, // FormData will be automatically handled
    });

    if (!response.ok) {
      const error = await response.text();
      return new NextResponse(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Complete registration error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
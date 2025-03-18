// src/components/Login.tsx

// Marks the component as client-side for interactivity
'use client';

// Imports
import Image from 'next/image';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google'; // Correctly typed TokenResponse
import axios from 'axios';

// Component
const Login = () => {
  // Handle successful Google login
  const handleGoogleLoginSuccess = async (tokenResponse: TokenResponse) => {
    try {
      const response = await axios.post(
        'https://auth.dagbok.pro/app2/api/auth/google/', // Proxy to Django backend
        { access_token: tokenResponse.access_token },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Login successful:', response.data);
      window.location.href = 'https://auth.dagbok.pro/app1'; // Redirect after login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Google login configuration
  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => console.error('Google login error:', error),
    flow: 'implicit',
    scope: 'profile email',
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-5">
      <div className="text-center">
        <Image src="/dagbok-logo.png" alt="Dagbok Logo" width={250} height={250} />
      </div>
      <h1 className="font-montserrat font-bold text-xl text-[#1E2A44]">
        Log in/Create to your Dagbok account
      </h1>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => login()}
          className="flex items-center gap-3 px-5 py-2 border border-[#E0E0E0] rounded-lg bg-white hover:shadow-md transition-shadow"
        >
          <Image src="/google-icon.png" alt="Google" width={20} height={20} />
          <span className="font-poppins text-base text-[#1E2A44]">Log in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
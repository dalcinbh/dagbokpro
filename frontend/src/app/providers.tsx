'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configura o endpoint do NextAuth no lado do cliente
    window.__NEXTAUTH = {
      basePath: '/slogin/auth'
    };
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 
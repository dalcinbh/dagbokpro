/**
 * Provedor de Autenticação com NextAuth
 * Encapsula a aplicação com o contexto de sessão
 */

'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Props para o provedor de autenticação
 */
interface NextAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Componente provedor de autenticação
 * Fornece o contexto de sessão para toda a aplicação
 */
export function NextAuthProvider({ children }: NextAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
} 
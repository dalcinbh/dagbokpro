/**
 * Layout para páginas autenticadas
 * Inclui o menu de navegação e verifica autenticação
 */

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

/**
 * Props do componente de layout autenticado
 */
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout para páginas que requerem autenticação
 * Redireciona para a página de login se não autenticado
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Verifica autenticação e redireciona para login se necessário
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  // Exibe um estado de carregamento enquanto verifica a autenticação
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza o conteúdo
  if (status === 'unauthenticated') {
    return null;
  }

  // Renderiza o layout com navegação para usuários autenticados
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Dagbok - Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
} 
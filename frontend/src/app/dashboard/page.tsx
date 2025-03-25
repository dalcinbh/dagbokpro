/**
 * Página de Dashboard
 * Exibe informações do usuário logado e estatísticas
 */

'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';

/**
 * Componente de Card estatístico
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className="mr-4 bg-indigo-100 rounded-full p-3">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

/**
 * Página principal do Dashboard
 */
export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Avatar do usuário'}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bem-vindo, {user?.name || user?.email?.split('@')[0] || 'Usuário'}!
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total de Posts"
            value="0"
            icon={
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
          />
          <StatCard
            title="Transcrições"
            value="0"
            icon={
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            title="Categorias"
            value="0"
            icon={
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/blog/novo"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mr-4 bg-indigo-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Criar Novo Post</h3>
                <p className="text-sm text-gray-500">Adicione um novo post ao blog</p>
              </div>
            </Link>
            <Link 
              href="/transcricoes"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mr-4 bg-indigo-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Nova Transcrição</h3>
                <p className="text-sm text-gray-500">Envie um texto para transcrição</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
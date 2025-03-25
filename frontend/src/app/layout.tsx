/**
 * Layout principal da aplicação
 * Configura o provedor de autenticação e os metadados
 */

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@/providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata for the application layout.
 * 
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the application.
 */
export const metadata: Metadata = {
  title: 'Dagbok - Seu Diário Digital',
  description: 'Plataforma para gerenciamento de conteúdo e transcrições',
};

/**
 * Layout raiz da aplicação
 * Configuração global aplicada a todas as páginas
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
/**
 * Layout principal da aplicação
 * Configura o provedor de autenticação e os metadados
 */

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { Providers } from './providers';
import LanguageSelector from '@/components/LanguageSelector';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import UserNav from '@/components/UserNav';

const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata for the application layout.
 * 
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the application.
 */
export const metadata: Metadata = {
  title: 'Dagbok',
  description: 'Your personal journal and resume builder',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Disable React DevTools message
            if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
              window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
            }
          `
        }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                  <CalendarDays className="h-6 w-6" />
                  <span className="font-semibold">Dagbok</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <LanguageSelector />
                  <UserNav />
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-4">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                © 2024 Dagbok. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './client-providers';

export const metadata: Metadata = {
  title: 'My Resume',
  description: 'Adriano Alves Resume',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

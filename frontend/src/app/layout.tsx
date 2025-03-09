import type { Metadata } from 'next';
//import globals.css
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
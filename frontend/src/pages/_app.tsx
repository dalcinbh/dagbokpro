/**
 * Custom Next.js App component
 * This file wraps all pages with providers and global configuration
 */

import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';
import '@/styles/globals.css';

/**
 * MyApp component - entry point for the Next.js application
 * Wraps all pages with necessary providers:
 * - next-auth SessionProvider for authentication
 * - next-themes ThemeProvider for dark/light mode
 * - next-i18next for internationalization
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp); 

/**
 * RootLayout component that defines the structure of the HTML document.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the body of the HTML document.
 * @returns {JSX.Element} The root layout component.
 */
import type { Metadata } from 'next';
import './globals.css';

/**
 * Metadata for the application layout.
 * 
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the application.
 */
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
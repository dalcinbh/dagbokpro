// frontend/src/components/Head.tsx

import Head from 'next/head'; // Import the Head component from Next.js for managing meta tags
import React from 'react';

// Define an interface for the properties of the Head component
interface HeadProps {
  title?: string; // Optional field to define the page title
  description?: string; // Optional field for the page description (SEO)
  imageUrl?: string; // Optional field for the image URL (used in social media sharing)
}

// Functional component Head that displays the page header and manages meta tags
const HeadComponent: React.FC<HeadProps> = ({ title, description, imageUrl }) => {
  const defaultTitle = "DAGBOK - Professional Resume Builder";
  const defaultDescription = "Create professional resumes quickly and easily with DAGBOK.";
  const defaultImageUrl = "https://dagbok.pro/images/default-thumbnail.png"; // Replace with the actual URL

  return (
    <>
      {/* Meta tags for SEO */}
      <Head>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph meta tags for social media sharing */}
        <meta property="og:title" content={title || defaultTitle} />
        <meta property="og:description" content={description || defaultDescription} />
        <meta property="og:image" content={imageUrl || defaultImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dagbok.pro" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || defaultTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        <meta name="twitter:image" content={imageUrl || defaultImageUrl} />
      </Head>

      {/* Visible header section on the page */}
      <header className="bg-white text-center py-8 border-b border-gray-100 shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wider">
          {title || defaultTitle}
        </h1>
      </header>
    </>
  );
};

// Export the Head component as default for use in other parts of the application
export default HeadComponent;
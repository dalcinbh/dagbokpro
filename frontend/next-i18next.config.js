/**
 * Configuration for next-i18next
 * This file sets up internationalization for the application
 */

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'sv'],
    localeDetection: true,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: { 
    useSuspense: false
  },
  // Add server side translations for getServerSideProps and getStaticProps
  serializeConfig: false
} 
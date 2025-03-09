/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    // Desativar cores modernas como oklch
    experimental: {
      optimizeUniversalDefaults: true,
    },
    corePlugins: {
      preflight: true,
    },
  };
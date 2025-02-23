/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#7C3AED',
          700: '#6D28D9',
          900: '#4C1D95',
        },
      },
    },
  },
  plugins: [],
};

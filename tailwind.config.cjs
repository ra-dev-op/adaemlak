const montserratStack = ['Montserrat', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './constants.ts',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff8e7',
          100: '#f9e6b5',
          200: '#f2d179',
          300: '#edc05f',
          400: '#EDC05F',
          500: '#E8AF36',
          600: '#C48E22',
          700: '#9f7318',
        },
        gray: {
          text: '#555555',
          light: '#f9f9f9',
          border: '#e0e0e0',
          dark: '#2d2d2d',
        },
      },
      fontFamily: {
        sans: montserratStack,
        serif: montserratStack,
        price: montserratStack,
        inter: montserratStack,
        display: montserratStack,
        mono: montserratStack,
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        premium: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

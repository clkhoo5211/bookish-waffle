/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Exact colors extracted from Figma mockups
        primary: {
          50: '#e6f7f6',
          100: '#b3e8e5',
          200: '#80d9d4',
          300: '#4dcac3',
          400: '#1abbb2',
          500: '#00a19c', // Main primary color from mockups
          600: '#00817d',
          700: '#00615e',
          800: '#00413f',
          900: '#002120',
        },
        accent: {
          50: '#fef9e7',
          100: '#fef0c2',
          200: '#fde79d',
          300: '#fcde78',
          400: '#fbd553',
          500: '#f3ba2f', // Gold accent from mockups
          600: '#d49e26',
          700: '#b5821d',
          800: '#966614',
          900: '#774a0b',
        },
        dark: {
          50: '#e8e9eb',
          100: '#b6b8bf',
          200: '#848793',
          300: '#525667',
          400: '#20253b',
          500: '#1e293c', // Dark color from mockups
          600: '#18202f',
          700: '#121722',
          800: '#0c0f15',
          900: '#060708',
        },
        background: {
          primary: '#ffffff',
          secondary: '#f1f5f9', // Light background from mockups
          tertiary: '#f5f8fb',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

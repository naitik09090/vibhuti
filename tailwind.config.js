/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#333333',
          400: '#000000',
          500: '#111111',
          600: '#000000',
          700: '#e0e0e0',
          800: '#e5e5e5',
          900: '#f0f0f0',
          950: '#f5f5f5',
        },
        charcoal: {
          50: '#000000',
          100: '#1a1a1a',
          200: '#333333',
          300: '#4d4d4d',
          400: '#666666',
          500: '#999999',
          600: '#cccccc',
          700: '#e0e0e0',
          800: '#f0f0f0',
          900: '#ffffff',
          950: '#fafafa',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        heading: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

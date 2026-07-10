/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          surface: '#1a1a1a',
          hover: '#2d2d2d'
        },
        accent: {
          purple: '#A855F7',
          purpleHover: '#9333EA'
        }
      }
    },
  },
  plugins: [],
}

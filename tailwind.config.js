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
        gold: {
          500: '#d4a853',
          600: '#b8923f',
        },
        teal: {
          400: '#2dd4bf',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
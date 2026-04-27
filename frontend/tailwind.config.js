/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#10b981',
        'brand-dark': '#1f2937',
        'brand-light': '#f3f4f6',
      }
    },
  },
  plugins: [],
}

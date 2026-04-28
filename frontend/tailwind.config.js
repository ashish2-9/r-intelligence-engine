/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        eco: {
          50:  "#f0faf0",
          100: "#dcf5dc",
          200: "#b8eab8",
          300: "#7dd87d",
          400: "#4cbe4c",
          500: "#2ea02e",
          600: "#1e7c1e",
          700: "#195f19",
          800: "#164d16",
          900: "#0f330f",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
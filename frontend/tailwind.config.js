/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      colors: {
        agri: {
          white: "#FFFFFF",
          black: "#000000",
          gray: "#6F6F6F",
          lightGray: "#F7F7F7",
          border: "#EBEBEB",
          darkBorder: "#222222",
          green: "#2D5A27",
          softGreen: "#4A7C59",
          tintGreen: "#EBF2E9",
          alert: "#C45A3C"
        }
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
      }
    },
  },
  plugins: [],
}

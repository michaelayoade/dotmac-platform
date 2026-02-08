/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html", "./static/js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        primary: {
          50: "#fefce8", 100: "#fef9c3", 200: "#fef08a",
          300: "#fde047", 400: "#facc15", 500: "#eab308",
          600: "#ca8a04", 700: "#a16207", 800: "#854d0e",
          900: "#713f12", 950: "#422006",
        },
        surface: {
          50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4",
          300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c",
          600: "#57534e", 700: "#44403c", 800: "#292524",
          900: "#1c1917", 950: "#0c0a09",
        },
        accent: {
          50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa",
          300: "#fdba74", 400: "#fb923c", 500: "#f97316",
          600: "#ea580c", 700: "#c2410c", 800: "#9a3412",
          900: "#7c2d12", 950: "#431407",
        },
      },
    },
  },
  plugins: [],
};

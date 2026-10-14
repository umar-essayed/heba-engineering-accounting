/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#D48B28",
          primaryHover: "#B8741D",
          primaryLight: "#FDF6ED",
          dark: "#1A1D20",
          charcoal: "#24292E",
          gray: "#555D67",
          border: "#E2E5E9",
          surface: "#F8F9FA",
        }
      },
      fontFamily: {
        sans: ["Cairo", "system-ui", "sans-serif"],
        display: ["'Amiri'", "'El Messiri'", "'Cairo'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        fayonka: ["'Amiri'", "serif"],
        ruqaa: ["'Aref Ruqaa'", "serif"],
      },
    },
  },
  plugins: [],
};

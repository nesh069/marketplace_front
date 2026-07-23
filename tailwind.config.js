export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 50: "#eef1f7", 100: "#d7deec", 200: "#aebed6", 400: "#3a5079", 500: "#2c3f62", 600: "#1e2a4a", 700: "#161f38", 800: "#11182e", 900: "#0d1326" },
        mustard: { 400: "#f4b942", 500: "#e8a33d", 600: "#c9862a", 700: "#9a671e" },
      },
      fontFamily: { display: ["'Space Grotesk'", "sans-serif"], body: ["'Inter'", "sans-serif"] },
    },
  },
  plugins: [],
};
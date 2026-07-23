export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 50: "#eef1f7", 100: "#d7deec", 400: "#3a5079", 600: "#1e2a4a", 700: "#161f38", 900: "#0d1326" },
        mustard: { 400: "#f4b942", 500: "#e8a33d", 600: "#c9862a" },
      },
      fontFamily: { display: ["'Space Grotesk'", "sans-serif"], body: ["'Inter'", "sans-serif"] },
    },
  },
  plugins: [],
};
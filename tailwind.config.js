/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#1E293B",
        background: "#F8FAFC",
        card: "#FFFFFF",
        border: "#E2E8F0",

        income: "#22C55E",
        expense: "#EF4444",
        savings: "#3B82F6",
        budget: "#F59E0B",
        investment: "#8B5CF6",
      },
    },
  },
  plugins: [],
};
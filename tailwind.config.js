/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*/.{js,ts,jsx,tsx}",
  ],
  theme: {
    // YE NAYI LINE ADD KI HAI - MOBILE KO DESKTOP BANA DIYA
    screens: {
      'sm': '1024px',
      'md': '1024px', 
      'lg': '1280px',
      'xl': '1536px',
      '2xl': '1536px',
    },
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

      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        card: "0 4px 10px rgba(0,0,0,0.08)",
      },

      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
// src/components/Layout.jsx
import React from "react";
import { useFinance } from "../context/FinanceContext";
import { themeStyles } from "../utils/themeStyles";

const Layout = ({ children }) => {
  const { currentTheme } = useFinance();
  const activeTheme = themeStyles[currentTheme] || themeStyles.light;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${activeTheme.bg}`}>
      {children}
    </div>
  );
};

export default Layout;
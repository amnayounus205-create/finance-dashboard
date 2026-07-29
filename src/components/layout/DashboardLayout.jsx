import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useFinance } from "../../context/FinanceContext";
import { Menu } from "lucide-react";

// Theme styles configuration mapping
const themeStyles = {
  light: {
    bg: "bg-slate-100",
    text: "text-slate-900",
  },
  dark: {
    bg: "bg-slate-900",
    text: "text-slate-100",
  },
  blue: {
    bg: "bg-blue-950",
    text: "text-blue-50",
  },
  green: {
    bg: "bg-emerald-950",
    text: "text-emerald-50",
  },
};

function DashboardLayout() {
  const { currentTheme } = useFinance();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeTheme = themeStyles[currentTheme] || themeStyles.light;

  return (
    <div className={`flex h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-300 overflow-hidden`}>
      
      {/* Mobile Backdrop Overlay (Jab mobile menu khulega toh background dark/blur ho jayega) */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar (Mobile par hidden/slide-out drawer, Desktop par normal fixed/relative) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 shrink-0 h-full
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area (Navbar + Outlet) */}
      <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden theme-${currentTheme}`}>
        
        {/* Top bar with Mobile Hamburger Trigger Button */}
        <div className="flex items-center shrink-0 border-b border-inherit/10">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden ml-4 p-2.5 rounded-xl bg-gray-200/50 dark:bg-slate-800 text-inherit hover:opacity-80 transition cursor-pointer"
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex-1">
            <Navbar />
          </div>
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useFinance } from "../../context/FinanceContext";

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
  const activeTheme = themeStyles[currentTheme] || themeStyles.light;

  return (
    <div className={`flex min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-300`}>
      <Sidebar />

      {/* Added theme class wrapper for automatic card/box styling */}
      <div className={`flex-1 flex flex-col min-w-0 theme-${currentTheme}`}>
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
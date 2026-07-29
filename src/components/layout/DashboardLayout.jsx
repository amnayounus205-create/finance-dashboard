import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useFinance } from "../../context/FinanceContext";

// Theme styles configuration mapping
const themeStyles = {
  light: {
    bg: "bg-background", // tumhare tailwind config wala color
    text: "text-secondary",
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
    // MOBILE FIRST: pehle column, md se row
    <div className={`flex flex-col md:flex-row min-h-screen ${activeTheme.bg} ${activeTheme.text} font-inter transition-colors duration-300`}>

      {/* SIDEBAR - Mobile: full width, Desktop: 64 */}
      <aside className="w-full md:w-64 md:min-h-screen bg-card border-b md:border-b-0 md:border-r border-border flex-shrink-0">
        <Sidebar />
      </aside>

      {/* RIGHT SIDE: Navbar + Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 theme-${currentTheme}`}>
        <Navbar />

        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
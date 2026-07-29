import { useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Landmark,
  User,
  LogOut,
  RefreshCw,
  Target,
  FileText,
  Users,
  History,
  CalendarDays,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFinance } from "../../context/FinanceContext";

function Sidebar() {
  const { logout } = useAuth();
  const { currentTheme } = useFinance();
  const navRef = useRef(null);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Accounts", path: "/accounts", icon: Landmark },
    { name: "Calendar", path: "/calendar", icon: CalendarDays },
    { name: "Income", path: "/income", icon: Wallet },
    { name: "Expenses", path: "/expenses", icon: Receipt },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Budgets", path: "/budgets", icon: PiggyBank },
    { name: "Recurring", path: "/recurring", icon: RefreshCw },
    { name: "Recurring Bills", path: "/recurring-bills", icon: CalendarDays },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "User Roles", path: "/users", icon: Users },
    { name: "Activity Logs", path: "/activity-logs", icon: History },
    { name: "Profile", path: "/profile", icon: User },
  ];

  // Scroll handler functions
  const scrollUp = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: -120, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: 120, behavior: "smooth" });
    }
  };

  // Theme-based styling mapping for Sidebar components
  const getSidebarStyle = () => {
    switch (currentTheme) {
      case "dark":
        return {
          aside: "bg-slate-900 border-slate-800 text-slate-100",
          border: "border-slate-800",
          hover: "hover:bg-slate-800",
          activeBg: "bg-blue-600 text-white",
          scrollBtn: "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700",
        };
      case "blue":
        return {
          aside: "bg-blue-950 border-blue-900 text-blue-50",
          border: "border-blue-900",
          hover: "hover:bg-blue-900/60",
          activeBg: "bg-blue-600 text-white",
          scrollBtn: "bg-blue-900/80 hover:bg-blue-800 text-blue-200 border-blue-800",
        };
      case "green":
        return {
          aside: "bg-emerald-950 border-emerald-900 text-emerald-50",
          border: "border-emerald-900",
          hover: "hover:bg-emerald-900/60",
          activeBg: "bg-emerald-600 text-white",
          scrollBtn: "bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-800",
        };
      case "light":
      default:
        return {
          aside: "bg-white border-gray-100 text-slate-800 shadow-sm",
          border: "border-gray-100",
          hover: "hover:bg-gray-100 text-slate-700",
          activeBg: "bg-blue-600 text-white",
          scrollBtn: "bg-gray-100/90 hover:bg-gray-200 text-gray-600 border-gray-200",
        };
    }
  };

  const sidebarStyle = getSidebarStyle();

  return (
    <aside className={`w-64 h-screen sticky top-0 border-r flex flex-col transition-colors duration-300 ${sidebarStyle.aside}`}>
      <div className={`p-6 text-2xl font-bold border-b ${sidebarStyle.border} shrink-0`}>
        💰 Finance
      </div>

      {/* Scroll Up Arrow Button */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={scrollUp}
          className={`w-full flex items-center justify-center py-1 rounded-lg border text-xs transition shadow-xs ${sidebarStyle.scrollBtn}`}
          title="Scroll Up"
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* Navigation List Container */}
      <nav ref={navRef} className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar scroll-smooth">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? sidebarStyle.activeBg
                    : sidebarStyle.hover
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Scroll Down Arrow Button */}
      <div className="px-4 pb-2 shrink-0">
        <button
          onClick={scrollDown}
          className={`w-full flex items-center justify-center py-1 rounded-lg border text-xs transition shadow-xs ${sidebarStyle.scrollBtn}`}
          title="Scroll Down"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <button
        onClick={logout}
        className="m-4 shrink-0 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl py-3 transition shadow-sm"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
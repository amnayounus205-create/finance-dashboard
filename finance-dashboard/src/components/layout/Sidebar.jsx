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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Accounts", path: "/accounts", icon: Landmark },
    { name: "Income", path: "/income", icon: Wallet },
    { name: "Expenses", path: "/expenses", icon: Receipt },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Budgets", path: "/budgets", icon: PiggyBank },
    { name: "Recurring", path: "/recurring", icon: RefreshCw },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        💰 Finance
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 rounded-lg py-3 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
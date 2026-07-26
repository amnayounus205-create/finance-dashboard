import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../../context/FinanceContext";
import GlobalSearch from "../common/GlobalSearch"; // Apne folder path ke mutabiq check kar lein

function Navbar() {
  const navigate = useNavigate();
  const { userProfile, activeNotificationsCount } = useFinance();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Finance Dashboard
          </h1>
          <p className="text-xs text-gray-400">Welcome back, {userProfile?.name || "User"}!</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all border border-gray-100 text-sm cursor-pointer"
            title="Search across app"
          >
            <Search size={18} />
            <span className="hidden sm:inline text-xs">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded">
              Ctrl+K
            </kbd>
          </button>

          {/* Notification Bell with Live Counter */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-all border border-gray-100 cursor-pointer"
            title="Notifications"
          >
            <Bell size={20} />
            {activeNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-sm">
                {activeNotificationsCount}
              </span>
            )}
          </button>

          {/* User Info Section */}
          <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {userProfile?.name?.charAt(0) || "U"}
            </div>

            <div>
              <h2 className="font-semibold text-sm text-slate-800">
                {userProfile?.name || "User"}
              </h2>

              <p className="text-xs text-gray-500">
                {userProfile?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal Render */}
      {isSearchOpen && <GlobalSearch onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

export default Navbar;
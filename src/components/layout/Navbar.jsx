import { useState, useRef, useEffect } from "react";
import { Bell, Search, Palette, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../../context/FinanceContext";
import GlobalSearch from "../common/GlobalSearch";

function Navbar() {
  const navigate = useNavigate();
  const { userProfile, activeNotificationsCount, currentTheme, setCurrentTheme } = useFinance();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme-based styling mapping for Navbar components (Har theme ke liye alag styling)
  const getNavbarStyle = () => {
    switch (currentTheme) {
      case "dark":
        return {
          header: "bg-slate-800 border-slate-700 text-slate-100 shadow-slate-900/10",
          title: "text-slate-100",
          subtitle: "text-slate-400",
          searchBtn: "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border-slate-600",
          kbd: "bg-slate-800 border-slate-600 text-slate-300",
          bellBtn: "bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600",
          divider: "border-slate-700",
          nameText: "text-slate-100",
          emailText: "text-slate-400",
        };
      case "blue":
        return {
          header: "bg-blue-900 border-blue-800 text-blue-50 shadow-blue-950/20",
          title: "text-blue-50",
          subtitle: "text-blue-200",
          searchBtn: "bg-blue-800 text-blue-200 hover:bg-blue-700 hover:text-white border-blue-700",
          kbd: "bg-blue-900 border-blue-700 text-blue-200",
          bellBtn: "bg-blue-800 text-blue-200 hover:bg-blue-700 border-blue-700",
          divider: "border-blue-800",
          nameText: "text-blue-50",
          emailText: "text-blue-200",
        };
      case "green":
        return {
          header: "bg-emerald-900 border-emerald-800 text-emerald-50 shadow-emerald-950/20",
          title: "text-emerald-50",
          subtitle: "text-emerald-200",
          searchBtn: "bg-emerald-800 text-emerald-200 hover:bg-emerald-700 hover:text-white border-emerald-700",
          kbd: "bg-emerald-900 border-emerald-700 text-emerald-200",
          bellBtn: "bg-emerald-800 text-emerald-200 hover:bg-emerald-700 border-emerald-700",
          divider: "border-emerald-800",
          nameText: "text-emerald-50",
          emailText: "text-emerald-200",
        };
      case "light":
      default:
        return {
          header: "bg-white border-gray-100 text-slate-800 shadow-sm",
          title: "text-slate-800",
          subtitle: "text-gray-400",
          searchBtn: "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-100",
          kbd: "bg-white border-gray-200 text-gray-400",
          bellBtn: "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-100",
          divider: "border-gray-100",
          nameText: "text-slate-800",
          emailText: "text-gray-500",
        };
    }
  };

  const themeStyle = getNavbarStyle();

  const themeOptions = [
    { id: "light", name: "Light Mode" },
    { id: "dark", name: "Dark Mode" },
    { id: "blue", name: "Ocean Blue" },
    { id: "green", name: "Forest Green" },
  ];

  return (
    <>
      <header className={`px-6 py-4 flex justify-between items-center sticky top-0 z-30 border-b transition-colors duration-300 ${themeStyle.header}`}>
        <div>
          <h1 className={`text-2xl font-bold ${themeStyle.title}`}>
            Finance Dashboard
          </h1>
          <p className={`text-xs ${themeStyle.subtitle}`}>Welcome back, {userProfile?.name || "User"}!</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* --- QUICK THEME SELECTOR DROPDOWN SHORTCUT --- */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs font-bold cursor-pointer ${themeStyle.searchBtn}`}
              title="Select Theme Mode"
            >
              <Palette size={16} className="text-blue-500" />
              <span className="hidden md:inline capitalize">Theme</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isThemeDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isThemeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-slate-700 mb-1">
                  Choose Theme Mode
                </div>
                {themeOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (typeof setCurrentTheme === "function") {
                        setCurrentTheme(t.id);
                      }
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-700/60 transition ${
                      currentTheme === t.id ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-700/40" : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span>{t.name}</span>
                    {currentTheme === t.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border text-sm cursor-pointer ${themeStyle.searchBtn}`}
            title="Search across app"
          >
            <Search size={18} />
            <span className="hidden sm:inline text-xs">Search...</span>
            <kbd className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded border ${themeStyle.kbd}`}>
              Ctrl+K
            </kbd>
          </button>

          {/* Notification Bell with Live Counter */}
          <button
            onClick={() => navigate("/notifications")}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all border cursor-pointer ${themeStyle.bellBtn}`}
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
          <div className={`flex items-center gap-3 border-l pl-4 ${themeStyle.divider}`}>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              {userProfile?.name?.charAt(0) || "U"}
            </div>

            <div>
              <h2 className={`font-semibold text-sm ${themeStyle.nameText}`}>
                {userProfile?.name || "User"}
              </h2>

              <p className={`text-xs ${themeStyle.emailText}`}>
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
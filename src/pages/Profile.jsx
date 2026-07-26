import { useState } from "react";
import { User, Globe, Bell, Palette, Calendar, Clock, Save } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Settings = () => {
  const { userProfile, updateProfile, currentTheme, setCurrentTheme } = useFinance?.() || {};

  const [name, setName] = useState(userProfile?.name || "John Doe");
  const [email, setEmail] = useState(userProfile?.email || "john.doe@example.com");
  const [currency, setCurrency] = useState(userProfile?.currency || "USD");
  const [dateFormat, setDateFormat] = useState(userProfile?.dateFormat || "MM/DD/YYYY");
  const [timeZone, setTimeZone] = useState(userProfile?.timeZone || "UTC");
  const [language, setLanguage] = useState(userProfile?.language || "English");
  const [notifications, setNotifications] = useState(userProfile?.notifications ?? true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({
        name,
        email,
        currency,
        dateFormat,
        timeZone,
        language,
        theme: currentTheme,
        notifications,
      });
    }
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account preferences, regional formats, appearance, and personal details.
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>Settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Information Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Personal Information</h3>
              <p className="text-xs text-gray-400">Update your name and email address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Theme / Appearance Section (Ab yahan se bhi theme select ho gi) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Appearance Theme</h3>
              <p className="text-xs text-gray-400">Select your preferred dashboard theme style</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setCurrentTheme("light")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentTheme === "light"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Light Theme
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme("dark")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentTheme === "dark"
                  ? "border-slate-500 bg-slate-700 text-white shadow-sm"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Dark Theme
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme("blue")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentTheme === "blue"
                  ? "border-blue-500 bg-blue-700 text-white shadow-sm"
                  : "border-blue-800 bg-blue-900 text-blue-200 hover:bg-blue-800"
              }`}
            >
              Blue Theme
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme("green")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentTheme === "green"
                  ? "border-emerald-500 bg-emerald-700 text-white shadow-sm"
                  : "border-emerald-800 bg-emerald-900 text-emerald-200 hover:bg-emerald-800"
              }`}
            >
              Green Theme
            </button>
          </div>
        </div>

        {/* Currency & Localization Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Preferences & Localization</h3>
              <p className="text-xs text-gray-400">Choose currency, date format, time zone, and language</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD" className="dark:bg-slate-800">USD ($)</option>
                <option value="EUR" className="dark:bg-slate-800">EUR (€)</option>
                <option value="GBP" className="dark:bg-slate-800">GBP (£)</option>
                <option value="PKR" className="dark:bg-slate-800">PKR (₨)</option>
                <option value="INR" className="dark:bg-slate-800">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Language (Dummy)</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English" className="dark:bg-slate-800">English</option>
                <option value="Spanish" className="dark:bg-slate-800">Español (Dummy)</option>
                <option value="French" className="dark:bg-slate-800">Français (Dummy)</option>
                <option value="Urdu" className="dark:bg-slate-800">اردو (Dummy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" /> Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MM/DD/YYYY" className="dark:bg-slate-800">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY" className="dark:bg-slate-800">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD" className="dark:bg-slate-800">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1">
                <Clock size={14} className="text-gray-400" /> Time Zone
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC" className="dark:bg-slate-800">UTC (Universal Time)</option>
                <option value="EST" className="dark:bg-slate-800">EST (Eastern Standard Time)</option>
                <option value="PST" className="dark:bg-slate-800">PST (Pacific Standard Time)</option>
                <option value="GMT" className="dark:bg-slate-800">GMT (Greenwich Mean Time)</option>
                <option value="PKT" className="dark:bg-slate-800">PKT (Pakistan Standard Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Notifications</h3>
              <p className="text-xs text-gray-400">Manage alerts and notifications</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Budget Alerts</p>
              <p className="text-xs text-gray-400">Receive notifications when spending exceeds 85% of budget limit</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm cursor-pointer"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
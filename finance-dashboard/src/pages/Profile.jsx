import { useState } from "react";
import { User, Globe, Bell, Shield, Save } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Settings = () => {
  const { userProfile, updateProfile } = useFinance?.() || {};

  const [name, setName] = useState(userProfile?.name || "John Doe");
  const [email, setEmail] = useState(userProfile?.email || "john.doe@example.com");
  const [currency, setCurrency] = useState(userProfile?.currency || "USD");
  const [notifications, setNotifications] = useState(userProfile?.notifications ?? true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({ name, email, currency, notifications });
    }
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account preferences, currency settings, and personal details.
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>Settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary">Personal Information</h3>
              <p className="text-xs text-gray-400">Update your name and email address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Currency & Localization Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary">Preferences</h3>
              <p className="text-xs text-gray-400">Choose your preferred currency symbol</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="PKR">PKR (₨)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        {/* Notifications & Security Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary">Notifications</h3>
              <p className="text-xs text-gray-400">Manage alerts and notifications</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Budget Alerts</p>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
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
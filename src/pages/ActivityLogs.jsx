import { useState, useMemo } from "react";
import { History, Search, Trash2, ShieldAlert, PlusCircle, MinusCircle, RefreshCw, Flag, LogIn, X } from "lucide-react";

const ActivityLogs = () => {
  // Local storage se logs fetch karna
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("finance_activity_logs");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, action: "Login History", description: "User session started successfully.", time: "2026-07-23 09:15 AM", type: "login" },
      { id: 2, action: "Added Income", description: "Added monthly salary of $3,500.", time: "2026-07-22 04:20 PM", type: "income" },
      { id: 3, action: "Created Goal", description: "Created a new savings goal: 'New Laptop'.", time: "2026-07-21 02:10 PM", type: "goal" }
    ];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filter logs based on search query and type
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.time.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || log.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [logs, searchQuery, filterType]);

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem("finance_activity_logs");
  };

  // Helper function to return respective icons
  const getLogIcon = (type) => {
    switch (type) {
      case "income": return <PlusCircle size={16} className="text-emerald-600" />;
      case "expense": return <MinusCircle size={16} className="text-rose-600" />;
      case "budget": return <RefreshCw size={16} className="text-blue-600" />;
      case "goal": return <Flag size={16} className="text-amber-600" />;
      case "login": return <LogIn size={16} className="text-purple-600" />;
      default: return <History size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Activity Logs</h1>
          <p className="text-gray-500 mt-1">
            Track every action, security event, and system change in real-time.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition"
          >
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div className="w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="all">All Activities</option>
            <option value="income">Added Income</option>
            <option value="expense">Deleted/Added Expense</option>
            <option value="budget">Updated Budget</option>
            <option value="goal">Created Goal</option>
            <option value="login">Login History</option>
          </select>
        </div>

      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Action Type</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-gray-400 text-xs">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-secondary flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                        {getLogIcon(log.type)}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{log.action}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-xs">
                      {log.description}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-400 text-xs font-medium">
                      {log.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ActivityLogs;
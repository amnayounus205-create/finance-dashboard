import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Target, 
  CalendarClock, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Activity,
  Palette,
  RotateCcw,
  RotateCw,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  Check
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useFinance } from "../context/FinanceContext";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// Default Cards Configuration for Customization
const defaultCardsConfig = [
  { id: "overview", title: "Top Overview Cards", visible: true },
  { id: "charts", title: "Charts Section", visible: true },
  { id: "transactions", title: "Recent Transactions", visible: true },
  { id: "upcoming_bills", title: "Upcoming Bills", visible: true },
];

// --- DASHBOARD CUSTOMIZER MODAL COMPONENT ---
function DashboardCustomizer({ cardsConfig, setCardsConfig, onClose }) {
  const [localConfig, setLocalConfig] = useState(cardsConfig);

  const toggleVisibility = (id) => {
    setLocalConfig((prev) =>
      prev.map((card) => (card.id === id ? { ...card, visible: !card.visible } : card))
    );
  };

  const moveCard = (index, direction) => {
    const newConfig = [...localConfig];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newConfig.length) return;

    const temp = newConfig[index];
    newConfig[index] = newConfig[targetIndex];
    newConfig[targetIndex] = temp;

    setLocalConfig(newConfig);
  };

  const handleSave = () => {
    setCardsConfig(localConfig);
    localStorage.setItem("dashboard_cards_config", JSON.stringify(localConfig));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Customize Dashboard</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cards ki visibility toggle karein aur upar/neeche move karke apna layout set karein.
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {localConfig.map((card, index) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-gray-400 cursor-grab" />
                <span className="text-sm font-medium">{card.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveCard(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveCard(index, "down")}
                  disabled={index === localConfig.length - 1}
                  className="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 text-xs"
                >
                  ▼
                </button>

                <button
                  onClick={() => toggleVisibility(card.id)}
                  className={`p-1.5 rounded-lg transition ${
                    card.visible ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" : "text-gray-400 bg-gray-200 dark:bg-slate-600"
                  }`}
                >
                  {card.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <Check size={14} /> Save Layout
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { 
    transactions = [], 
    budgets = [], 
    goals = [], 
    recurring = [], 
    totalIncome = 0, 
    totalExpense = 0, 
    totalBalance = 0, 
    userProfile,
    undo,
    redo,
    canUndo,
    canRedo
  } = useFinance();

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  // --- THEME CUSTOMIZATION STATE ---
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("app_theme", currentTheme);
  }, [currentTheme]);

  // --- DASHBOARD LAYOUT CONFIG STATE ---
  const [cardsConfig, setCardsConfig] = useState(() => {
    const saved = localStorage.getItem("dashboard_cards_config");
    return saved ? JSON.parse(saved) : defaultCardsConfig;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Theme configuration styles map
  const themeStyles = {
    light: {
      bg: "bg-gray-50 text-slate-800",
      card: "bg-white border-gray-100 text-slate-800",
      accent: "text-blue-600",
    },
    dark: {
      bg: "bg-slate-900 text-slate-100",
      card: "bg-slate-800 border-slate-700 text-slate-100",
      accent: "text-blue-400",
    },
    blue: {
      bg: "bg-blue-950 text-blue-50",
      card: "bg-blue-900 border-blue-800 text-blue-50",
      accent: "text-blue-300",
    },
    green: {
      bg: "bg-emerald-950 text-emerald-50",
      card: "bg-emerald-900 border-emerald-800 text-emerald-50",
      accent: "text-emerald-300",
    }
  };

  const activeTheme = themeStyles[currentTheme] || themeStyles.light;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // 1. Month-over-Month Comparison & Trends
  const { currentMonthIncome, currentMonthExpense, lastMonthIncome, lastMonthExpense } = useMemo(() => {
    let currInc = 0, currExp = 0, lastInc = 0, lastExp = 0;

    transactions.forEach(tx => {
      if (!tx.date) return;
      const txDate = new Date(tx.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();
      const amount = Number(tx.amount || 0);

      if (txMonth === currentMonth && txYear === currentYear) {
        if (tx.type === "Income") currInc += amount;
        if (tx.type === "Expense") currExp += amount;
      } else if (
        (txMonth === currentMonth - 1 && txYear === currentYear) || 
        (currentMonth === 0 && txMonth === 11 && txYear === currentYear - 1)
      ) {
        if (tx.type === "Income") lastInc += amount;
        if (tx.type === "Expense") lastExp += amount;
      }
    });

    return {
      currentMonthIncome: currInc,
      currentMonthExpense: currExp,
      lastMonthIncome: lastInc,
      lastMonthExpense: lastExp,
    };
  }, [transactions, currentMonth, currentYear]);

  // 2. Bar Chart Data
  const comparisonBarData = useMemo(() => [
    { name: "Last Month", Income: lastMonthIncome, Expense: lastMonthExpense },
    { name: "Current Month", Income: currentMonthIncome, Expense: currentMonthExpense },
  ], [lastMonthIncome, lastMonthExpense, currentMonthIncome, currentMonthExpense]);

  // 3. Pie Chart Data
  const pieChartData = useMemo(() => {
    const categoryMap = {};
    transactions
      .filter(tx => tx.type === "Expense")
      .forEach(tx => {
        const cat = tx.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(tx.amount || 0);
      });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);
  
  const upcomingBills = useMemo(() => {
    const today = new Date();
    return (recurring || []).filter(item => {
      const checkDate = item.nextRunDate || item.nextDate;
      if (!checkDate || item.type !== "Expense") return false;
      const diffDays = Math.ceil((new Date(checkDate) - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).slice(0, 4);
  }, [recurring]);

  // Render individual sections based on configuration order and visibility
  const renderDashboardSection = (sectionId) => {
    switch (sectionId) {
      case "overview":
        return (
          <div key="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between ${activeTheme.card}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Balance</p>
                <h3 className="text-2xl font-bold mt-1">{currencySymbol}{totalBalance.toLocaleString()}</h3>
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1 mt-2">
                  <TrendingUp size={14} /> Overall Net Worth
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Wallet size={28} />
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between ${activeTheme.card}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Income</p>
                <h3 className="text-2xl font-bold text-emerald-500 mt-1">{currencySymbol}{totalIncome.toLocaleString()}</h3>
                <span className="text-xs opacity-60 font-semibold flex items-center gap-1 mt-2">
                  <ArrowUpRight size={14} className="text-emerald-500" /> Inflows recorded
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ArrowUpRight size={28} />
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between ${activeTheme.card}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Expenses</p>
                <h3 className="text-2xl font-bold text-rose-500 mt-1">{currencySymbol}{totalExpense.toLocaleString()}</h3>
                <span className="text-xs opacity-60 font-semibold flex items-center gap-1 mt-2">
                  <ArrowDownLeft size={14} className="text-rose-500" /> Outflows recorded
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <ArrowDownLeft size={28} />
              </div>
            </div>
          </div>
        );

      case "charts":
        return (
          <div key="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-6 rounded-2xl shadow-sm border ${activeTheme.card}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Monthly Comparison Chart</h3>
                  <p className="text-xs opacity-60">Income vs Expenses Bar Comparison</p>
                </div>
                <Calendar size={20} className={activeTheme.accent} />
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip formatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm border ${activeTheme.card}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Category Breakdown Chart</h3>
                  <p className="text-xs opacity-60">Expense distribution share</p>
                </div>
                <Activity size={20} className="text-emerald-500" />
              </div>
              <div className="h-72 w-full flex items-center justify-center">
                {pieChartData.length === 0 ? (
                  <p className="text-xs opacity-60">No expense category data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        fontSize={11}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        );

      case "transactions":
        return (
          <div key="transactions" className={`p-6 rounded-2xl shadow-sm border ${activeTheme.card}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Recent Transactions</h3>
                <p className="text-xs opacity-60">Your latest financial activity</p>
              </div>
              <Link to="/transactions" className={`text-xs font-bold flex items-center gap-1 ${activeTheme.accent}`}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-sm opacity-60 text-center py-6">No recent transactions found.</p>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:opacity-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${tx.type === "Income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                        {tx.type === "Income" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{tx.title || tx.source || "Transaction"}</h4>
                        <p className="text-xs opacity-60">{tx.category || "General"} • {tx.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}>
                      {tx.type === "Income" ? "+" : "-"}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "upcoming_bills":
        return (
          <div key="upcoming_bills" className={`p-6 rounded-2xl shadow-sm border ${activeTheme.card}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Upcoming Bills</h3>
                <p className="text-xs opacity-60">Due in the next 7 days</p>
              </div>
              <Link to="/recurring" className={`text-xs font-bold ${activeTheme.accent}`}>View All</Link>
            </div>
            <div className="space-y-3">
              {upcomingBills.length === 0 ? (
                <div className="text-center py-6 opacity-60 text-xs">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-1" />
                  No upcoming bills due soon.
                </div>
              ) : (
                upcomingBills.map((bill) => (
                  <div key={bill.id} className="p-3 bg-amber-500/15 border border-amber-500/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <CalendarClock size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{bill.title || bill.category}</h4>
                        <p className="text-[10px] opacity-60">Due: {bill.nextRunDate}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-500">-{currencySymbol}{Number(bill.amount).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${activeTheme.bg}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- THEME CUSTOMIZER, DASHBOARD CUSTOMIZER & UNDO/REDO HEADER BAR --- */}
        <div className={`p-4 rounded-2xl shadow-sm border flex flex-wrap items-center justify-between gap-4 ${activeTheme.card}`}>
          <div className="flex items-center gap-6 flex-wrap">
            {/* Theme Customization */}
            <div className="flex items-center gap-2">
              <Palette size={20} className={activeTheme.accent} />
              <span className="text-sm font-bold">Theme:</span>
              <div className="flex items-center gap-1.5 ml-2">
                <button 
                  onClick={() => setCurrentTheme("light")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${currentTheme === "light" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-slate-700 hover:bg-gray-200"}`}
                >
                  Light
                </button>
                <button 
                  onClick={() => setCurrentTheme("dark")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${currentTheme === "dark" ? "bg-slate-700 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  Dark
                </button>
                <button 
                  onClick={() => setCurrentTheme("blue")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${currentTheme === "blue" ? "bg-blue-700 text-white shadow" : "bg-blue-900 text-blue-200 hover:bg-blue-800"}`}
                >
                  Blue
                </button>
                <button 
                  onClick={() => setCurrentTheme("green")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${currentTheme === "green" ? "bg-emerald-700 text-white shadow" : "bg-emerald-900 text-emerald-200 hover:bg-emerald-800"}`}
                >
                  Green
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Customize Dashboard Button */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm hover:opacity-90 transition-all"
            >
              <Settings size={14} className={activeTheme.accent} /> Customize Layout
            </button>

            {/* Undo / Redo Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={undo}
                disabled={!canUndo}
                title="Undo Action"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <RotateCcw size={14} /> Undo
              </button>
              <button 
                onClick={redo}
                disabled={!canRedo}
                title="Redo Action"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Redo <RotateCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC RENDERED SECTIONS BASED ON CONFIG --- */}
        <div className="space-y-8">
          {cardsConfig.map((card) => {
            if (!card.visible) return null;
            return renderDashboardSection(card.id);
          })}
        </div>

      </div>

      {/* --- CUSTOMIZER MODAL --- */}
      {isCustomizerOpen && (
        <DashboardCustomizer
          cardsConfig={cardsConfig}
          setCardsConfig={setCardsConfig}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
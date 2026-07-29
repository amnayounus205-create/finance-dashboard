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
  RotateCcw,
  RotateCw,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  Clock,
  LogIn,
  LogOut,
  User,
  CreditCard,
  FileText,
  RefreshCw,
  Edit3,
  Trash2,
  DollarSign,
  Plus,
  PieChart as PieIcon,
  X
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
  { id: "timeline", title: "Recent Activity Timeline", visible: true },
];

// Activity Icon Helper
const getActivityIcon = (type, action) => {
  switch (type) {
    case "login":
    case "logout":
      return <LogIn size={16} className="text-emerald-500" />;
    case "transaction":
      return <DollarSign size={16} className="text-blue-500" />;
    case "budget":
      return <Edit3 size={16} className="text-amber-500" />;
    case "goal":
      return <Target size={16} className="text-purple-500" />;
    case "account":
      return <CreditCard size={16} className="text-indigo-500" />;
    case "invoice":
      return <FileText size={16} className="text-teal-500" />;
    case "profile":
      return <User size={16} className="text-pink-500" />;
    case "system":
      return <RefreshCw size={16} className="text-cyan-500" />;
    default:
      if (action?.includes("Deleted")) return <Trash2 size={16} className="text-rose-500" />;
      return <Clock size={16} className="text-gray-400" />;
  }
};

// --- QUICK ACTION MODAL COMPONENT (Direct Form Popup) ---
function QuickActionModal({ type, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: type === "Income"? "Salary" : "Food",
    date: new Date().toISOString().split("T")[0],
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    period: "Monthly"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return;

    if (type === "Income" || type === "Expense") {
      onSave("transaction", {
        id: Date.now().toString(),
        title: formData.title || (type === "Income"? "Income" : "Expense"),
        amount: Number(formData.amount),
        type: type,
        category: formData.category,
        date: formData.date
      });
    } else if (type === "Budget") {
      onSave("budget", {
        id: Date.now().toString(),
        category: formData.category,
        limit: Number(formData.amount),
        period: formData.period
      });
    } else if (type === "Goal") {
      onSave("goal", {
        id: Date.now().toString(),
        title: formData.title || "New Goal",
        targetAmount: Number(formData.targetAmount || formData.amount),
        currentAmount: Number(formData.currentAmount || 0),
        deadline: formData.deadline || formData.date
      });
    }
    onClose();
  };

  const titles = {
    Income: "Add New Income",
    Expense: "Add New Expense",
    Budget: "Create Budget Limit",
    Goal: "Add Financial Goal"
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 border-border">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-lg font-bold">{titles[type]}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(type === "Income" || type === "Expense" || type === "Goal") && (
            <div>
              <label className="block text-xs font-semibold mb-1 opacity-70">Title / Source Name</label>
              <input
                type="text"
                required
                placeholder={type === "Goal"? "e.g., Buy Laptop" : "e.g., Freelance / Grocery"}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 opacity-70">
              {type === "Goal"? "Target Amount" : type === "Budget"? "Budget Limit Amount" : "Amount"}
            </label>
            <input
              type="number"
              required
              step="any"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {(type === "Income" || type === "Expense" || type === "Budget") && (
            <div>
              <label className="block text-xs font-semibold mb-1 opacity-70">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {type === "Income"? (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Food">Food & Dining</option>
                    <option value="Bills">Utilities & Bills</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="General">General</option>
                  </>
                )}
              </select>
            </div>
          )}

          {type === "Goal" && (
            <div>
              <label className="block text-xs font-semibold mb-1 opacity-70">Target Deadline</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {(type === "Income" || type === "Expense") && (
            <div>
              <label className="block text-xs font-semibold mb-1 opacity-70">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold opacity-70 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:opacity-90 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              Save {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- DASHBOARD CUSTOMIZER MODAL COMPONENT ---
function DashboardCustomizer({ cardsConfig, setCardsConfig, onClose }) {
  const [localConfig, setLocalConfig] = useState(cardsConfig);

  const toggleVisibility = (id) => {
    setLocalConfig((prev) =>
      prev.map((card) => (card.id === id? {...card, visible:!card.visible } : card))
    );
  };

  const moveCard = (index, direction) => {
    const newConfig = [...localConfig];
    const targetIndex = direction === "up"? index - 1 : index + 1;

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
      <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Customize Dashboard</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <p className="text-xs opacity-60">
          Cards ki visibility toggle karein aur upar/neeche move karke apna layout set karein.
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {localConfig.map((card, index) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3 bg-background border-border rounded-xl"
            >
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-gray-400 cursor-grab" />
                <span className="text-sm font-medium">{card.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveCard(index, "up")}
                  disabled={index === 0}
                  className="p-1 opacity-60 hover:bg-gray-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveCard(index, "down")}
                  disabled={index === localConfig.length - 1}
                  className="p-1 opacity-60 hover:bg-gray-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 text-xs"
                >
                  ▼
                </button>

                <button
                  onClick={() => toggleVisibility(card.id)}
                  className={`p-1.5 rounded-lg transition ${
                    card.visible? "text-income bg-income/10" : "opacity-40 bg-gray-200 dark:bg-slate-600"
                  }`}
                >
                  {card.visible? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold opacity-70 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:opacity-90 text-white text-xs font-semibold rounded-xl transition shadow-sm"
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
    recurring = [],
    totalIncome = 0,
    totalExpense = 0,
    totalBalance = 0,
    userProfile,
    activityLogs = [],
    undo,
    redo,
    canUndo,
    canRedo,
    addTransaction,
    addBudget,
    addGoal
  } = useFinance();

  const currencySymbol = userProfile?.currency === "EUR"? "€" : userProfile?.currency === "GBP"? "£" : userProfile?.currency === "PKR"? "₨" : userProfile?.currency === "INR"? "₹" : "$";

  // --- DASHBOARD LAYOUT CONFIG STATE ---
  const [cardsConfig, setCardsConfig] = useState(() => {
    const saved = localStorage.getItem("dashboard_cards_config");
    return saved? JSON.parse(saved) : defaultCardsConfig;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // --- QUICK ACTIONS FAB & MODAL STATE ---
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);

  // Handle direct save from modal
  const handleQuickSave = (targetType, data) => {
    if (targetType === "transaction" && typeof addTransaction === "function") {
      addTransaction(data);
    } else if (targetType === "budget" && typeof addBudget === "function") {
      addBudget(data);
    } else if (targetType === "goal" && typeof addGoal === "function") {
      addGoal(data);
    }
  };

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
      if (!checkDate || item.type!== "Expense") return false;
      const diffDays = Math.ceil((new Date(checkDate) - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).slice(0, 4);
  }, [recurring]);

  // Render individual sections based on configuration order and visibility
  const renderDashboardSection = (sectionId) => {
    switch (sectionId) {
      case "overview":
        return (
          // YEH LINE CHANGE KI: md:grid-cols-3 -> sm:grid-cols-2 lg:grid-cols-3
          <div key="overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Balance</p>
                <h3 className="text-2xl font-bold mt-1">{currencySymbol}{totalBalance.toLocaleString()}</h3>
                <span className="text-xs text-income font-semibold flex items-center gap-1 mt-2">
                  <TrendingUp size={14} /> Overall Net Worth
                </span>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Wallet size={24} />
              </div>
            </div>

            <div className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Income</p>
                <h3 className="text-2xl font-bold text-income mt-1">{currencySymbol}{totalIncome.toLocaleString()}</h3>
                <span className="text-xs opacity-60 font-semibold flex items-center gap-1 mt-2">
                  <ArrowUpRight size={14} className="text-income" /> Inflows recorded
                </span>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-income/10 text-income flex items-center justify-center">
                <ArrowUpRight size={24} />
              </div>
            </div>

            <div className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Expenses</p>
                <h3 className="text-2xl font-bold text-expense mt-1">{currencySymbol}{totalExpense.toLocaleString()}</h3>
                <span className="text-xs opacity-60 font-semibold flex items-center gap-1 mt-2">
                  <ArrowDownLeft size={14} className="text-expense" /> Outflows recorded
                </span>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-expense/10 text-expense flex items-center justify-center">
                <ArrowDownLeft size={24} />
              </div>
            </div>
          </div>
        );

      case "charts":
        return (
          // YEH LINE CHANGE KI: lg:grid-cols-2
          <div key="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Monthly Comparison Chart</h3>
                  <p className="text-xs opacity-60">Income vs Expenses Bar Comparison</p>
                </div>
                <Calendar size={20} className="text-primary" />
              </div>
              <div className="h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip formatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    <Bar dataKey="Income" fill="#22C55E" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Category Breakdown Chart</h3>
                  <p className="text-xs opacity-60">Expense distribution share</p>
                </div>
                <Activity size={20} className="text-income" />
              </div>
              <div className="h-64 md:h-72 w-full flex items-center justify-center">
                {pieChartData.length === 0? (
                  <p className="text-xs opacity-60">No expense category data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        fontSize={10}
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
          <div key="transactions" className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Recent Transactions</h3>
                <p className="text-xs opacity-60">Your latest financial activity</p>
              </div>
              <Link to="/transactions" className="text-xs font-bold flex items-center gap-1 text-primary">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentTransactions.length === 0? (
                <p className="text-sm opacity-60 text-center py-6">No recent transactions found.</p>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${tx.type === "Income"? "bg-income/10 text-income" : "bg-expense/10 text-expense"}`}>
                        {tx.type === "Income"? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{tx.title || tx.source || "Transaction"}</h4>
                        <p className="text-xs opacity-60">{tx.category || "General"} • {tx.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === "Income"? "text-income" : "text-expense"}`}>
                      {tx.type === "Income"? "+" : "-"}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "upcoming_bills":
        return (
          <div key="upcoming_bills" className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Upcoming Bills</h3>
                <p className="text-xs opacity-60">Due in the next 7 days</p>
              </div>
              <Link to="/recurring" className="text-xs font-bold text-primary">View All</Link>
            </div>
            <div className="space-y-3">
              {upcomingBills.length === 0? (
                <div className="text-center py-6 opacity-60 text-xs">
                  <CheckCircle2 size={24} className="mx-auto text-income mb-1" />
                  No upcoming bills due soon.
                </div>
              ) : (
                upcomingBills.map((bill) => (
                  <div key={bill.id} className="p-3 bg-budget/15 border-budget/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-budget/20 text-budget flex items-center justify-center shrink-0">
                        <CalendarClock size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{bill.title || bill.category}</h4>
                        <p className="text-[10px] opacity-60">Due: {bill.nextRunDate}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-expense">-{currencySymbol}{Number(bill.amount).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "timeline":
        return (
          <div key="timeline" className="p-4 md:p-6 rounded-card shadow-card border bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Recent Activity Timeline</h3>
                <p className="text-xs opacity-60">Track your recent actions & system logs</p>
              </div>
              <span className="text-xs opacity-60 font-semibold">{activityLogs.length} Events</span>
            </div>

            {activityLogs.length === 0? (
              <p className="text-xs opacity-60 text-center py-6">No recent activity recorded yet.</p>
            ) : (
              <div className="relative border-l border-border ml-3 space-y-6 py-2">
                {activityLogs.slice(0, 10).map((item) => (
                  <div key={item.id} className="relative pl-6 group">
                    <div className="absolute -left-3.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-background border-border shadow-xs transition group-hover:scale-110">
                      {getActivityIcon(item.type, item.action)}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold">{item.action}</p>
                        <p className="text-xs opacity-60 mt-0.5">{item.description}</p>
                      </div>
                      <span className="text-[10px] opacity-50 mt-1 sm:mt-0 font-medium">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300 relative bg-background text-secondary">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* --- DASHBOARD CUSTOMIZER & UNDO/REDO HEADER BAR --- */}
        <div className="p-4 rounded-card shadow-card border bg-card border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <h2 className="text-base font-bold">Dashboard Overview</h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-background border border-border shadow-sm hover:opacity-90 transition-all"
            >
              <Settings size={14} className="text-primary" /> Customize Layout
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                title="Undo Action"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-investment text-white shadow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <RotateCcw size={14} /> Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                title="Redo Action"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-investment text-white shadow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Redo <RotateCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC RENDERED SECTIONS BASED ON CONFIG --- */}
        <div className="space-y-6 md:space-y-8">
          {cardsConfig.map((card) => {
            if (!card.visible) return null;
            return renderDashboardSection(card.id);
          })}
        </div>

      </div>

      {/* --- FLOATING QUICK ACTIONS (FAB) --- */}
      <div className="fixed bottom-6 right-6 z-40 flex-col items-end gap-3">
        {isFabOpen && (
          <div className="flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              onClick={() => { setActiveModalType("Income"); setIsFabOpen(false); }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-income hover:opacity-90 text-white rounded-2xl shadow-lg text-xs font-bold transition-all transform hover:scale-105"
            >
              <span>Add Income</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowUpRight size={14} />
              </div>
            </button>

            <button
              onClick={() => { setActiveModalType("Expense"); setIsFabOpen(false); }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-expense hover:opacity-90 text-white rounded-2xl shadow-lg text-xs font-bold transition-all transform hover:scale-105"
            >
              <span>Add Expense</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowDownLeft size={14} />
              </div>
            </button>

            <button
              onClick={() => { setActiveModalType("Budget"); setIsFabOpen(false); }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-budget hover:opacity-90 text-white rounded-2xl shadow-lg text-xs font-bold transition-all transform hover:scale-105"
            >
              <span>Create Budget</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <PieIcon size={14} />
              </div>
            </button>

            <button
              onClick={() => { setActiveModalType("Goal"); setIsFabOpen(false); }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-investment hover:opacity-90 text-white rounded-2xl shadow-lg text-xs font-bold transition-all transform hover:scale-105"
            >
              <span>Add Goal</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <Target size={14} />
              </div>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-2xl bg-primary hover:opacity-90 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
            isFabOpen? "rotate-45" : ""
          }`}
          title="Quick Actions"
        >
          <Plus size={26} />
        </button>
      </div>

      {/* --- DIRECT FORM MODAL POPUP --- */}
      {activeModalType && (
        <QuickActionModal
          type={activeModalType}
          onClose={() => setActiveModalType(null)}
          onSave={handleQuickSave}
        />
      )}

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
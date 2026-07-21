import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Filter } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Reports = () => {
  const { incomes = [], expenses = [] } = useFinance();
  
  // Dynamic filter states
  const [reportType, setReportType] = useState("monthly"); // daily, weekly, monthly, yearly, custom
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("expense"); // expense or income

  // Dynamic timeframe check logic
  const isWithinTimeframe = (dateStr) => {
    if (!dateStr) return false;
    const itemDate = new Date(dateStr);
    const today = new Date();

    if (reportType === "daily") {
      return itemDate.toDateString() === today.toDateString();
    }
    if (reportType === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return itemDate >= oneWeekAgo && itemDate <= today;
    }
    if (reportType === "monthly") {
      return dateStr.startsWith(selectedMonth);
    }
    if (reportType === "yearly") {
      const currentYear = today.getFullYear().toString();
      return dateStr.startsWith(currentYear);
    }
    if (reportType === "custom") {
      if (!startDate || !endDate) return true;
      return dateStr >= startDate && dateStr <= endDate;
    }
    return true;
  };

  // Filtered Data
  const filteredIncomes = useMemo(() => {
    return incomes.filter((inc) => isWithinTimeframe(inc.date));
  }, [incomes, reportType, selectedMonth, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => isWithinTimeframe(exp.date));
  }, [expenses, reportType, selectedMonth, startDate, endDate]);

  // Calculations
  const totalIncome = filteredIncomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalExpense = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const netProfitLoss = totalIncome - totalExpense;
  const savings = netProfitLoss > 0 ? netProfitLoss : 0;

  // Breakdown for Expenses by Category
  const expenseCategoryBreakdown = useMemo(() => {
    const spendingMap = {};
    filteredExpenses.forEach((exp) => {
      const cat = exp.category || "Other";
      spendingMap[cat] = (spendingMap[cat] || 0) + Number(exp.amount || 0);
    });

    return Object.entries(spendingMap).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  // Breakdown for Income Sources / Categories
  const incomeCategoryBreakdown = useMemo(() => {
    const incomeMap = {};
    filteredIncomes.forEach((inc) => {
      const cat = inc.category || "Other";
      incomeMap[cat] = (incomeMap[cat] || 0) + Number(inc.amount || 0);
    });

    return Object.entries(incomeMap).sort((a, b) => b[1] - a[1]);
  }, [filteredIncomes]);

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Financial Reports</h1>
          <p className="text-gray-500 mt-1">
            Dynamically analyze your revenue streams and spending habits.
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-1">
          {["daily", "weekly", "monthly", "yearly", "custom"].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                reportType === type
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Filter Controls Sub-bar */}
      {reportType === "monthly" && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Calendar size={18} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Select Month:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      )}

      {reportType === "custom" && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Income</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">+${totalIncome.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Expenses</p>
            <h2 className="mt-2 text-2xl font-bold text-red-500">-${totalExpense.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Net Profit / Loss</p>
            <h2 className={`mt-2 text-2xl font-bold ${netProfitLoss >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {netProfitLoss >= 0 ? `$${netProfitLoss.toFixed(2)}` : `-$${Math.abs(netProfitLoss).toFixed(2)}`}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Estimated Savings</p>
            <h2 className="mt-2 text-2xl font-bold text-secondary">${savings.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Filter size={22} />
          </div>
        </div>
      </div>

      {/* Category Breakdowns Section with Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <PieChart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary">Category Breakdown</h3>
              <p className="text-xs text-gray-400">Inspect income sources vs expense categories</p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab("expense")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "expense" ? "bg-white text-secondary shadow-sm" : "text-gray-500"
              }`}
            >
              Expense Categories
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "income" ? "bg-white text-secondary shadow-sm" : "text-gray-500"
              }`}
            >
              Income Sources
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "expense" ? (
          expenseCategoryBreakdown.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-400 text-sm">No expense records found for this timeframe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenseCategoryBreakdown.map(([category, amount], index) => {
                const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-secondary flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-xs flex items-center justify-center text-gray-500 font-bold">
                          {index + 1}
                        </span>
                        {category}
                      </span>
                      <span className="font-bold text-secondary">
                        ${amount.toFixed(2)} <span className="text-xs text-gray-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          incomeCategoryBreakdown.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-400 text-sm">No income records found for this timeframe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomeCategoryBreakdown.map(([category, amount], index) => {
                const percentage = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-secondary flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-xs flex items-center justify-center text-gray-500 font-bold">
                          {index + 1}
                        </span>
                        {category}
                      </span>
                      <span className="font-bold text-secondary">
                        +${amount.toFixed(2)} <span className="text-xs text-gray-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Reports;
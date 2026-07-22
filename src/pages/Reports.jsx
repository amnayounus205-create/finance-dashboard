import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Filter, Landmark, FileText, Target, Download, FileSpreadsheet, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Reports = () => {
  const { incomes = [], expenses = [], accounts = [], goals = [], invoices = [], userProfile } = useFinance();
  
  // Dynamic filter states
  const [reportType, setReportType] = useState("monthly"); // daily, weekly, monthly, yearly, custom
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("expense"); // expense or income

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

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

  // Monthly Comparison Calculations (Current Selected Month vs Previous Month)
  const prevMonthStr = useMemo(() => {
    if (!selectedMonth) return "";
    const [year, month] = selectedMonth.split("-").map(Number);
    const prevDate = new Date(year, month - 2, 1);
    return prevDate.toISOString().slice(0, 7);
  }, [selectedMonth]);

  const prevMonthIncome = useMemo(() => {
    return incomes.filter(inc => inc.date && inc.date.startsWith(prevMonthStr))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [incomes, prevMonthStr]);

  const prevMonthExpense = useMemo(() => {
    return expenses.filter(exp => exp.date && exp.date.startsWith(prevMonthStr))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses, prevMonthStr]);

  const incomeChangePercent = prevMonthIncome > 0 ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100 : 0;
  const expenseChangePercent = prevMonthExpense > 0 ? ((totalExpense - prevMonthExpense) / prevMonthExpense) * 100 : 0;

  // Yearly Comparison Calculations (Current Year vs Previous Year)
  const currentYearStr = new Date().getFullYear().toString();
  const prevYearStr = (new Date().getFullYear() - 1).toString();

  const currentYearExpense = useMemo(() => {
    return expenses.filter(exp => exp.date && exp.date.startsWith(currentYearStr))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses, currentYearStr]);

  const prevYearExpense = useMemo(() => {
    return expenses.filter(exp => exp.date && exp.date.startsWith(prevYearStr))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses, prevYearStr]);

  const yearlyExpenseChangePercent = prevYearExpense > 0 ? ((currentYearExpense - prevYearExpense) / prevYearExpense) * 100 : 0;

  // Invoices & Goals Calculations
  const totalInvoicesAmount = invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const paidInvoicesAmount = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + Number(inv.amount), 0);
  const unpaidInvoicesAmount = invoices.filter(inv => inv.status === "Unpaid").reduce((acc, inv) => acc + Number(inv.amount), 0);

  const totalGoalTarget = goals.reduce((acc, g) => acc + Number(g.targetAmount), 0);
  const totalGoalCurrent = goals.reduce((acc, g) => acc + Number(g.currentAmount), 0);

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

  // Highest Expense & Income
  const highestExpense = expenseCategoryBreakdown.length > 0 ? expenseCategoryBreakdown[0] : ["N/A", 0];
  const highestIncome = incomeCategoryBreakdown.length > 0 ? incomeCategoryBreakdown[0] : ["N/A", 0];

  // Export handlers
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Type,Category,Amount,Date"]
      .concat(filteredExpenses.map(e => `Expense,${e.category},${e.amount},${e.date}`))
      .concat(filteredIncomes.map(i => `Income,${i.category},${i.amount},${i.date}`))
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    window.print(); // Triggers browser print dialog which can save as PDF cleanly
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header with Export Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Advanced Financial Reports</h1>
          <p className="text-gray-500 mt-1">
            Deep insights, comparative analytics, and exportable financial summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-secondary rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-1 w-fit">
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
            <h2 className="mt-2 text-2xl font-bold text-green-600">+{currencySymbol}{totalIncome.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Expenses</p>
            <h2 className="mt-2 text-2xl font-bold text-red-500">-{currencySymbol}{totalExpense.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Net Profit</p>
            <h2 className={`mt-2 text-2xl font-bold ${netProfitLoss >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {netProfitLoss >= 0 ? `${currencySymbol}${netProfitLoss.toFixed(2)}` : `-${currencySymbol}${Math.abs(netProfitLoss).toFixed(2)}`}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Estimated Savings</p>
            <h2 className="mt-2 text-2xl font-bold text-secondary">{currencySymbol}{savings.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Filter size={22} />
          </div>
        </div>
      </div>

      {/* Comparative Insights Grid (Monthly & Yearly Comparison + Highest Metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Comparison Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Calendar size={20} className="text-blue-600" />
            <h3 className="font-bold text-secondary text-lg">Monthly Comparison</h3>
          </div>
          <p className="text-xs text-gray-400">Comparing current selection ({selectedMonth}) with previous month.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase">Income vs Prev</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-secondary">{currencySymbol}{totalIncome.toFixed(0)}</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${incomeChangePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {incomeChangePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {incomeChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase">Expense vs Prev</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-secondary">{currencySymbol}{totalExpense.toFixed(0)}</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${expenseChangePercent <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {expenseChangePercent <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                  {expenseChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Comparison Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <TrendingUp size={20} className="text-purple-600" />
            <h3 className="font-bold text-secondary text-lg">Yearly Comparison ({currentYearStr})</h3>
          </div>
          <p className="text-xs text-gray-400">Comparing total yearly expenses against last year ({prevYearStr}).</p>
          <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase">Current Year Expenses</span>
              <h4 className="text-xl font-bold text-secondary mt-1">{currencySymbol}{currentYearExpense.toLocaleString()}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-400 uppercase">YoY Growth</span>
              <h4 className={`text-sm font-bold mt-1 flex items-center justify-end gap-1 ${yearlyExpenseChangePercent <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {yearlyExpenseChangePercent.toFixed(1)}% vs {prevYearStr}
              </h4>
            </div>
          </div>
        </div>

      </div>

      {/* Highest Categories Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase">Highest Expense Category</span>
            <h3 className="text-xl font-bold text-secondary mt-0.5">{highestExpense[0]}</h3>
            <span className="text-xs font-semibold text-red-500">{currencySymbol}{Number(highestExpense[1]).toFixed(2)} spent</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase">Highest Income Source</span>
            <h3 className="text-xl font-bold text-secondary mt-0.5">{highestIncome[0]}</h3>
            <span className="text-xs font-semibold text-emerald-600">+{currencySymbol}{Number(highestIncome[1]).toFixed(2)} earned</span>
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
                        {currencySymbol}{amount.toFixed(2)} <span className="text-xs text-gray-400 font-normal">({percentage}%)</span>
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
                        +{currencySymbol}{amount.toFixed(2)} <span className="text-xs text-gray-400 font-normal">({percentage}%)</span>
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

      {/* Additional Overview Sections (Accounts, Invoices, Goals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Accounts Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Landmark size={20} className="text-blue-600" />
            <h3 className="font-bold text-secondary text-lg">Accounts Breakdown</h3>
          </div>
          <div className="space-y-3">
            {accounts.length === 0 ? (
              <p className="text-sm text-gray-400">No accounts found.</p>
            ) : (
              accounts.map((acc) => (
                <div key={acc.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50/50">
                  <div>
                    <h4 className="font-semibold text-sm text-secondary">{acc.name}</h4>
                    <span className="text-xs text-gray-400">{acc.type}</span>
                  </div>
                  <span className={`font-bold text-sm ${Number(acc.balance) < 0 ? "text-red-600" : "text-secondary"}`}>
                    {currencySymbol}{Number(acc.balance).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoices Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <FileText size={20} className="text-indigo-600" />
            <h3 className="font-bold text-secondary text-lg">Invoices Overview</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-[10px] font-semibold text-emerald-600 uppercase">Paid</span>
              <h4 className="text-base font-bold text-emerald-700 mt-1">{currencySymbol}{paidInvoicesAmount.toLocaleString()}</h4>
              <span className="text-[10px] text-gray-400">{invoices.filter(i => i.status === "Paid").length} invoices</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <span className="text-[10px] font-semibold text-amber-600 uppercase">Unpaid</span>
              <h4 className="text-base font-bold text-amber-700 mt-1">{currencySymbol}{unpaidInvoicesAmount.toLocaleString()}</h4>
              <span className="text-[10px] text-gray-400">{invoices.filter(i => i.status === "Unpaid").length} invoices</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100 font-semibold text-secondary">
            <span>Total Invoiced:</span>
            <span>{currencySymbol}{totalInvoicesAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Savings Goals Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Target size={20} className="text-emerald-600" />
            <h3 className="font-bold text-secondary text-lg">Savings Goals</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Saved:</span>
              <span className="font-bold text-secondary">{currencySymbol}{totalGoalCurrent.toLocaleString()} / {currencySymbol}{totalGoalTarget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalGoalTarget > 0 ? Math.min(Math.round((totalGoalCurrent / totalGoalTarget) * 100), 100) : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 text-right">
              {totalGoalTarget > 0 ? Math.min(Math.round((totalGoalCurrent / totalGoalTarget) * 100), 100) : 0}% achieved
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const CalendarModule = () => {
  const { incomes = [], expenses = [], addIncome, addExpense, categories = [], userProfile } = useFinance();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding transaction from calendar
  const [txType, setTxType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  // Month navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate days for the current month grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    const daysArray = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDateNum = prevTotalDays - i;
      const prevMonthNum = month === 0 ? 12 : month;
      const prevYearNum = month === 0 ? year - 1 : year;
      const formattedDate = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}-${String(prevDateNum).padStart(2, '0')}`;
      daysArray.push({ dateStr: formattedDate, dayNum: prevDateNum, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      daysArray.push({ dateStr: formattedDate, dayNum: i, isCurrentMonth: true });
    }

    // Next month padding days to complete 35 or 42 grid
    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthNum = month === 2 ? 1 : month + 2;
      const nextYearNum = month === 11 ? year + 1 : year;
      const formattedDate = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      daysArray.push({ dateStr: formattedDate, dayNum: i, isCurrentMonth: false });
    }

    return daysArray;
  }, [year, month]);

  // Map transactions by date string for fast lookup
  const transactionsByDate = useMemo(() => {
    const map = {};
    
    incomes.forEach(inc => {
      if (!inc.date) return;
      if (!map[inc.date]) map[inc.date] = { incomes: [], expenses: [] };
      map[inc.date].incomes.push(inc);
    });

    expenses.forEach(exp => {
      if (!exp.date) return;
      if (!map[exp.date]) map[exp.date] = { incomes: [], expenses: [] };
      map[exp.date].expenses.push(exp);
    });

    return map;
  }, [incomes, expenses]);

  // Handle opening modal for a specific date
  const handleDayClick = (dateStr) => {
    setSelectedDateStr(dateStr);
    setAmount("");
    setDescription("");
    setCategory("");
    setIsModalOpen(true);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!amount || !selectedDateStr) return;

    const newTx = {
      id: Date.now().toString(),
      amount: Number(amount),
      category: category || (txType === "income" ? "Salary" : "General"),
      date: selectedDateStr,
      description: description || "Added via Calendar",
    };

    if (txType === "income") {
      addIncome(newTx);
    } else {
      addExpense(newTx);
    }

    setIsModalOpen(false);
  };

  // Get transactions for selected date detail view
  const selectedDayData = selectedDateStr ? transactionsByDate[selectedDateStr] || { incomes: [], expenses: [] } : { incomes: [], expenses: [] };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Financial Calendar</h1>
          <p className="text-gray-500 mt-1">Track daily income, expenses, and upcoming bill due dates.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-secondary text-base min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-50/70 border-b border-gray-100 text-center py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-[1px]">
          {calendarDays.map((dayObj, index) => {
            const dayData = transactionsByDate[dayObj.dateStr] || { incomes: [], expenses: [] };
            const totalInc = dayData.incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const totalExp = dayData.expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const hasBillDue = dayData.expenses.some(e => e.isBill || e.category === "Bills" || e.category === "Utilities");
            const isToday = new Date().toISOString().slice(0, 10) === dayObj.dateStr;

            return (
              <div
                key={index}
                onClick={() => handleDayClick(dayObj.dateStr)}
                className={`min-h-[110px] bg-white p-2.5 flex flex-col justify-between cursor-pointer transition hover:bg-blue-50/30 relative group ${
                  !dayObj.isCurrentMonth ? "opacity-40 bg-gray-50/50" : ""
                } ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}>
                    {dayObj.dayNum}
                  </span>

                  {/* Bill Due Badge Highlight */}
                  {hasBillDue && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-md flex items-center gap-1">
                      ⚠️ Bill Due
                    </span>
                  )}
                </div>

                {/* Day Summary Badges */}
                <div className="space-y-1 mt-2">
                  {totalInc > 0 && (
                    <div className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold truncate flex items-center justify-between">
                      <span>+{currencySymbol}{totalInc}</span>
                      <ArrowUpRight size={10} />
                    </div>
                  )}
                  {totalExp > 0 && (
                    <div className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md font-semibold truncate flex items-center justify-between">
                      <span>-{currencySymbol}{totalExp}</span>
                      <ArrowDownRight size={10} />
                    </div>
                  )}
                </div>

                {/* Hover Add Button Indicator */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition bg-blue-600 text-white p-1 rounded-lg shadow-sm">
                  <Plus size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Modal / Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-secondary">Date: {selectedDateStr}</h3>
                <p className="text-xs text-gray-400 mt-0.5">View transactions or add new for this date.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
            </div>

            {/* Existing Transactions List for this date */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase">Existing Records</h4>
              {selectedDayData.incomes.length === 0 && selectedDayData.expenses.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No transactions recorded on this date.</p>
              ) : (
                <>
                  {selectedDayData.incomes.map(inc => (
                    <div key={inc.id} className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                      <span className="font-semibold text-secondary">{inc.category} ({inc.description || 'Income'})</span>
                      <span className="font-bold text-emerald-600">+{currencySymbol}{inc.amount}</span>
                    </div>
                  ))}
                  {selectedDayData.expenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                      <span className="font-semibold text-secondary">{exp.category} ({exp.description || 'Expense'})</span>
                      <span className="font-bold text-rose-600">-{currencySymbol}{exp.amount}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Add Transaction Form for this date */}
            <form onSubmit={handleAddTransaction} className="space-y-4 pt-4 border-t">
              <h4 className="text-xs font-bold text-secondary uppercase">Add Transaction on {selectedDateStr}</h4>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTxType("expense")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                    txType === "expense" ? "bg-rose-600 text-white shadow-sm" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("income")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                    txType === "income" ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  Income
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Food, Bills"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Optional note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModule;
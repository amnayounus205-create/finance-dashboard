import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, Trash2, Edit2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Transactions = () => {
  const { incomes = [], expenses = [], deleteIncome, deleteExpense, updateIncome, updateExpense } = useFinance();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, income, expense
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, amount-desc, amount-asc

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });

  // Combine Incomes and Expenses into a unified transaction list
  const allTransactions = useMemo(() => {
    const formattedIncomes = incomes.map((item) => ({ ...item, type: "income" }));
    const formattedExpenses = expenses.map((item) => ({ ...item, type: "expense" }));
    return [...formattedIncomes, [...formattedExpenses]].flat();
  }, [incomes, expenses]);

  // Filter and Sort Logic
  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((item) => {
        // Type Filter
        if (typeFilter !== "all" && item.type !== typeFilter) return false;

        // Category Filter
        if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

        // Search Query (title, source, or notes)
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || item.source || "").toLowerCase().includes(query);
        const notesMatch = (item.notes || "").toLowerCase().includes(query);
        if (searchQuery && !titleMatch && !notesMatch) return false;

        // Date Range Filter
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
        if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sortBy === "amount-desc") return Number(b.amount) - Number(a.amount);
        if (sortBy === "amount-asc") return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [allTransactions, typeFilter, categoryFilter, searchQuery, startDate, endDate, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (deleteModal.type === "income") {
      deleteIncome(deleteModal.id);
    } else {
      deleteExpense(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, id: null, type: null });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary">Transactions History</h1>
        <p className="text-gray-500 mt-1">
          Search, filter, and manage all your income and expense records.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, source, notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type & Sort Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Transaction</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-secondary">
                      {tx.title || tx.source || "Untitled"}
                      {tx.notes && <p className="text-xs text-gray-400 font-normal mt-0.5">{tx.notes}</p>}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {tx.category || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">{tx.date}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          tx.type === "income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-bold ${
                        tx.type === "income" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}${Number(tx.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: tx.id, type: tx.type })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing page <span className="font-semibold text-secondary">{currentPage}</span> of{" "}
              <span className="font-semibold text-secondary">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-secondary">Delete Transaction</h2>
            
            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this transaction? This will also update your total balance.
            </p>

            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, id: null, type: null })}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 text-sm transition"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 text-sm transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
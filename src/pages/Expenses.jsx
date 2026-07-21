import { useState } from "react";
import { Plus, Search, TrendingDown, DollarSign, CreditCard, Edit2, Trash2, AlertTriangle } from "lucide-react";
import ExpenseModal from "../components/expenses/ExpenseModal";
import { useFinance } from "../context/FinanceContext";

const Expenses = () => {
  const { expenses = [], addExpense, updateExpense, deleteExpense } = useFinance();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Modal state for delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleFormSubmit = (data) => {
    if (editingExpense) {
      updateExpense({ ...editingExpense, ...data, amount: Number(data.amount) });
    } else {
      addExpense({ ...data, id: Date.now(), amount: Number(data.amount) });
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Expense Management</h1>
          <p className="text-gray-500 mt-1">
            Track, analyze, and manage all your outgoing expenses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm gap-2"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Expenses</p>
            <h2 className="mt-2 text-2xl font-bold text-red-500">
              -${totalExpenseAmount.toFixed(2)}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Records</p>
            <h2 className="mt-2 text-2xl font-bold text-secondary">{expenses.length}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Categories Tracked</p>
            <h2 className="mt-2 text-2xl font-bold text-secondary">
              {new Set(expenses.map(e => e.category)).size}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm">No expense records available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Payment Method</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-secondary">
                      {expense.title}
                      {expense.notes && (
                        <p className="text-xs text-gray-400 font-normal truncate max-w-xs">
                          {expense.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{expense.paymentMethod}</td>
                    <td className="py-4 px-6 text-gray-500">{expense.date}</td>
                    <td className="py-4 px-6 font-bold text-red-500">
                      -${Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(expense.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
      />

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-secondary">Delete Expense</h2>
            
            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this expense record? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 text-sm transition"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => {
                  deleteExpense(deleteId);
                  setDeleteId(null);
                }}
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

export default Expenses;
import React, { useState, useMemo } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Download, 
  Tag, 
  Search,
  AlertTriangle,
  X
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";

function Transactions() {
  const { 
    transactions = [], 
    setTransactions, 
    deleteTransaction, 
    updateTransactionCategory, 
    bulkDeleteTransactions, 
    bulkUpdateCategory,
    userProfile 
  } = useFinance();

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  // --- STATES ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Target Category for Bulk Update
  const [targetCategory, setTargetCategory] = useState("General");

  // --- MODAL TOGGLES ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // --- FILTER TRANSACTIONS ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = (tx.title || tx.source || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, selectedCategory]);

  // --- SELECT ALL / DESELECT ALL ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredTransactions.map(tx => tx.id));
    } else {
      setSelectedIds([]);
    }
  };

  // --- TOGGLE SINGLE SELECTION ---
  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- OPEN CATEGORY MODAL SAFELY ---
  const openCategoryModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedIds.length === 0) return;
    setIsCategoryModalOpen(true);
  };

  // --- OPEN DELETE MODAL SAFELY ---
  const openDeleteModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  // --- EXECUTE BULK CATEGORY UPDATE ---
  const confirmBulkCategoryChange = () => {
    if (selectedIds.length === 0) return;

    const updatedTransactions = transactions.map(tx => {
      if (selectedIds.includes(tx.id)) {
        return { ...tx, category: targetCategory };
      }
      return tx;
    });

    if (typeof setTransactions === "function") {
      setTransactions(updatedTransactions);
    }

    if (typeof bulkUpdateCategory === "function") {
      bulkUpdateCategory(selectedIds, targetCategory);
    }

    localStorage.setItem("finance_transactions", JSON.stringify(updatedTransactions));

    setSelectedIds([]);
    setIsCategoryModalOpen(false);
  };

  // --- EXECUTE BULK DELETE ---
  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) return;

    if (typeof bulkDeleteTransactions === "function") {
      bulkDeleteTransactions(selectedIds);
    } else {
      const updatedTransactions = transactions.filter(tx => !selectedIds.includes(tx.id));
      if (typeof setTransactions === "function") {
        setTransactions(updatedTransactions);
      }
      localStorage.setItem("finance_transactions", JSON.stringify(updatedTransactions));
    }
    
    setSelectedIds([]);
    setIsDeleteModalOpen(false);
  };

  // --- BULK EXPORT (CSV) ---
  const handleBulkExport = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const itemsToExport = transactions.filter(tx => selectedIds.includes(tx.id));
    if (itemsToExport.length === 0) return;

    const headers = ["ID", "Title/Source", "Type", "Category", "Amount", "Date"];
    const csvRows = [
      headers.join(","),
      ...itemsToExport.map(tx => [
        tx.id,
        `"${tx.title || tx.source || "N/A"}"`,
        tx.type,
        `"${tx.category || "General"}"`,
        tx.amount,
        tx.date
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Transactions Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aapki tamaam income aur expenses ki list.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* --- BULK ACTIONS ACTION BAR --- */}
        {selectedIds.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md relative z-30">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg">
                {selectedIds.length} Selected
              </span>
              <span className="text-xs font-medium text-blue-900 dark:text-blue-200">
                Bulk actions available:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Update Category Button */}
              <button
                type="button"
                onClick={openCategoryModal}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow cursor-pointer"
              >
                <Tag size={14} /> Update Category
              </button>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleBulkExport}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow cursor-pointer"
              >
                <Download size={14} /> Export CSV
              </button>

              {/* Delete Selected Button */}
              <button
                type="button"
                onClick={openDeleteModal}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition shadow cursor-pointer"
              >
                <Trash2 size={14} /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-slate-900/50">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredTransactions.length > 0 && selectedIds.length === filteredTransactions.length}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Transaction</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      Koi transactions nahi mili.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isSelected = selectedIds.includes(tx.id);
                    return (
                      <tr 
                        key={tx.id} 
                        className={`hover:bg-gray-50/80 dark:hover:bg-slate-700/45 transition-colors ${isSelected ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(tx.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${tx.type === "Income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                            {tx.type === "Income" ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100 block">
                              {tx.title || tx.source || "Transaction"}
                            </span>
                            <span className="text-[10px] text-gray-400">{tx.type}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-600 dark:text-gray-300">
                          {tx.category || "General"}
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">
                          {tx.date}
                        </td>
                        <td className={`p-4 text-right font-bold ${tx.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}>
                          {tx.type === "Income" ? "+" : "-"}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- CATEGORY UPDATE MODAL --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Tag size={20} />
              </div>
              <button 
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Update Category ({selectedIds.length} Items)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select a new category for the selected transactions:
              </p>
            </div>

            <div>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Food">Food & Dining</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Salary">Salary</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkCategoryChange}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow cursor-pointer"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button 
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Delete Selected Items?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Aap {selectedIds.length} selected transactions ko delete karne ja rahe hain. Yeh action undo nahi kiya ja sakega.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition shadow cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
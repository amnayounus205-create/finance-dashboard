import { useState } from "react";
import { RefreshCw, Plus, Trash2, Edit2, Calendar, AlertTriangle } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import RecurringForm from "../components/RecurringForm";
import toast from "react-hot-toast";

const Recurring = () => {
  const { recurring = [], deleteRecurring, accounts = [], userProfile } = useFinance();
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // Delete confirmation modal state

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  const getAccountName = (accountId) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc ? acc.name : "Unknown Account";
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowForm(!showForm);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Recurring Transactions</h1>
          <p className="text-gray-500 mt-1">Automate your regular bills, subscriptions, and income streams.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
        >
          <Plus size={18} />
          {showForm && !editingItem ? "Close Form" : "Add Recurring Rule"}
        </button>
      </div>

      {/* Form Toggle (Add / Edit) */}
      {showForm && (
        <RecurringForm
          editingItem={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Recurring List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recurring.length === 0 ? (
          <div className="col-span-full bg-white p-10 rounded-2xl border border-gray-100 text-center space-y-3">
            <RefreshCw size={40} className="mx-auto text-gray-300 animate-spin-slow" />
            <h3 className="font-bold text-secondary text-lg">No recurring transactions found</h3>
            <p className="text-gray-400 text-sm">Add a rule above to automate your future transactions.</p>
          </div>
        ) : (
          recurring.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === "Income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    <RefreshCw size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-base">{item.title}</h4>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md mt-0.5 font-medium">
                      {item.frequency}
                    </span>
                  </div>
                </div>

                {/* Actions (Edit & Delete) */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="Edit Rule"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete Rule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-50 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Account:</span>
                  <span className="font-medium text-secondary">{getAccountName(item.accountId)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Next Run:</span>
                  <span className="font-medium text-secondary flex items-center gap-1">
                    <Calendar size={14} /> {item.nextRunDate}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-400 uppercase font-semibold">Amount</span>
                <span className={`text-xl font-bold ${item.type === "Income" ? "text-emerald-600" : "text-red-600"}`}>
                  {item.type === "Income" ? "+" : "-"}{currencySymbol}{Number(item.amount).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Special Delete Confirmation Modal Box */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-secondary">Delete Recurring Rule</h2>
            
            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this recurring rule? Automatic generation for this rule will stop immediately. This action cannot be undone.
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
                  deleteRecurring(deleteId);
                  toast.success("Recurring rule deleted successfully!");
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

export default Recurring;
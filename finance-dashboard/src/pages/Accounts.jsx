import { useState } from "react";
import { Wallet, Landmark, CreditCard, Plus, Trash2, Edit2, AlertTriangle } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import toast from "react-hot-toast";

const Accounts = () => {
  const { accounts = [], addAccount, updateAccount, deleteAccount, userProfile } = useFinance();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  // Form States
  const [name, setName] = useState("");
  const [type, setType] = useState("Bank");
  const [balance, setBalance] = useState("");

  // Delete Confirmation Modal State
  const [deleteId, setDeleteId] = useState(null);

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setName("");
    setType("Bank");
    setBalance("");
    setIsOpen(true);
  };

  const handleEdit = (acc) => {
    setEditingAccount(acc);
    setName(acc.name);
    setType(acc.type);
    setBalance(acc.balance);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || balance === "") {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingAccount) {
      // UPDATE Operation
      updateAccount({
        ...editingAccount,
        name,
        type,
        balance: parseFloat(balance),
      });
      toast.success("Account updated successfully!");
    } else {
      // CREATE Operation
      const newAccount = {
        id: Date.now().toString(),
        name,
        type,
        balance: parseFloat(balance),
      };
      addAccount(newAccount);
      toast.success("Account added successfully!");
    }

    setName("");
    setBalance("");
    setEditingAccount(null);
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "Cash":
        return <Wallet size={24} className="text-emerald-600" />;
      case "Credit":
        return <CreditCard size={24} className="text-amber-600" />;
      default:
        return <Landmark size={24} className="text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Multi-Account Management</h1>
          <p className="text-gray-500 mt-1">Manage your cash wallets, bank accounts, and credit cards.</p>
        </div>
        <button
          onClick={() => (isOpen ? setIsOpen(false) : handleOpenAdd())}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
        >
          <Plus size={18} />
          {isOpen ? "Cancel" : "Add New Account"}
        </button>
      </div>

      {/* Add / Edit Account Form Modal / Box */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-secondary">
            {editingAccount ? "Edit Account" : "Add New Account"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Account Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Savings Account"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bank">Bank Account</option>
                <option value="Cash">Cash Wallet</option>
                <option value="Credit">Credit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Balance</label>
              <input
                type="number"
                step="any"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              {editingAccount ? "Update Account" : "Save Account"}
            </button>
          </div>
        </form>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 relative group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                  {getIcon(acc.type)}
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-base">{acc.name}</h4>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md mt-0.5">
                    {acc.type}
                  </span>
                </div>
              </div>
              
              {/* Actions (Edit & Delete) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(acc)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                  title="Edit Account"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(acc.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Delete Account"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-400 uppercase font-semibold">Balance</span>
              <span className={`text-xl font-bold ${acc.balance < 0 ? "text-red-600" : "text-secondary"}`}>
                {currencySymbol}{Number(acc.balance).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
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
            
            <h2 className="text-xl font-bold text-secondary">Delete Account</h2>
            
            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this account? All associated financial data tied directly to this will be unlinked. This action cannot be undone.
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
                  deleteAccount(deleteId);
                  toast.success("Account deleted successfully!");
                  setDeleteId(null);
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-700 hover:bg-red-700 text-sm transition shadow-sm"
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

export default Accounts;
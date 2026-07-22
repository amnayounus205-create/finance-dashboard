import { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import toast from "react-hot-toast";

const RecurringForm = ({ editingItem, onClose }) => {
  const { addRecurring, updateRecurring, accounts = [] } = useFinance();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [frequency, setFrequency] = useState("Monthly");
  const [category, setCategory] = useState("Bills");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  // Agar editingItem mojood hai toh form ko pre-fill kar do
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title || "");
      setAmount(editingItem.amount || "");
      setType(editingItem.type || "Expense");
      setFrequency(editingItem.frequency || "Monthly");
      setCategory(editingItem.category || "Bills");
      setAccountId(editingItem.accountId || accounts[0]?.id || "");
      setStartDate(editingItem.nextRunDate || new Date().toISOString().split("T")[0]);
    }
  }, [editingItem, accounts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !accountId) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingItem) {
      // UPDATE Operation
      updateRecurring({
        ...editingItem,
        title,
        amount: parseFloat(amount),
        type,
        frequency,
        category,
        accountId,
        nextRunDate: startDate,
      });
      toast.success("Recurring rule updated successfully!");
    } else {
      // CREATE Operation
      const newRecurring = {
        id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
        type,
        frequency,
        category,
        accountId,
        nextRunDate: startDate,
      };
      addRecurring(newRecurring);
      toast.success("Recurring transaction scheduled successfully!");
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-bold text-secondary">
        {editingItem ? "Edit Recurring Transaction" : "Setup Recurring Transaction"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title / Source</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Netflix, Salary, Rent"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Amount</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start / Next Run Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          {editingItem ? "Update Rule" : "Save Recurring Rule"}
        </button>
      </div>
    </form>
  );
};

export default RecurringForm;
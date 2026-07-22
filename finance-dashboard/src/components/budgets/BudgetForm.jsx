import { useState, useEffect } from "react";

const BudgetForm = ({ onSubmit, initialData, onCancel }) => {
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    if (initialData) {
      setCategory(initialData.category || "Food");
      setLimit(initialData.limit || "");
      setMonth(initialData.month || currentMonth);
    } else {
      setCategory("Food");
      setLimit("");
      setMonth(currentMonth);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category, limit, month });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="Overall / General">Overall / General</option>
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

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Monthly Limit ($)</label>
        <input
          type="number"
          required
          step="0.01"
          placeholder="e.g. 500"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Month</label>
        <input
          type="month"
          required
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-sm"
        >
          {initialData ? "Update Budget" : "Save Budget"}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
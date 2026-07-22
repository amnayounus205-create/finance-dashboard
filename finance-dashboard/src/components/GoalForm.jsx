import { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import toast from "react-hot-toast";

const GoalForm = ({ editingItem, onClose }) => {
  const { addGoal, updateGoal } = useFinance();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title || "");
      setTargetAmount(editingItem.targetAmount || "");
      setCurrentAmount(editingItem.currentAmount || "");
      setDeadline(editingItem.deadline || "");
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) {
      toast.error("Please fill required fields");
      return;
    }

    const tAmount = parseFloat(targetAmount);
    const cAmount = parseFloat(currentAmount || 0);

    const goalData = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      title,
      targetAmount: tAmount,
      currentAmount: cAmount,
      deadline: deadline || "No deadline",
      isCompleted: cAmount >= tAmount,
    };

    if (editingItem) {
      updateGoal(goalData);
      toast.success("Goal updated successfully!");
    } else {
      addGoal(goalData);
      toast.success("Saving goal created successfully!");
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-bold text-secondary">
        {editingItem ? "Edit Saving Goal" : "Create Saving Goal"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Laptop, Emergency Fund"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Amount</label>
          <input
            type="number"
            step="any"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Initial / Current Saved Amount</label>
          <input
            type="number"
            step="any"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
          {editingItem ? "Update Goal" : "Save Goal"}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
import { Edit2, Trash2 } from "lucide-react";

const BudgetCard = ({ budget, spent = 0, onEdit, onDelete }) => {
  const limit = Number(budget.limit || 0);
  const remaining = limit - spent;
  const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;

  let progressColor = "bg-blue-600";
  if (percentage > 85) progressColor = "bg-red-500";
  else if (percentage > 60) progressColor = "bg-amber-500";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 font-semibold text-xs rounded-full">
            {budget.category}
          </span>
          <p className="text-xs text-gray-400 mt-1">Month: {budget.month}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-xs text-gray-400 uppercase font-medium">Limit</p>
          <h2 className="text-xl font-bold text-secondary">${limit.toFixed(2)}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-medium">Spent</p>
          <h2 className="text-xl font-bold text-red-500">${spent.toFixed(2)}</h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-gray-500">Usage: {percentage}%</span>
          <span className={remaining < 0 ? "text-red-500 font-bold" : "text-green-600"}>
            Remaining: ${remaining.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
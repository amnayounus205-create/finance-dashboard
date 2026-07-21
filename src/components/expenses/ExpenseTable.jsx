import { Edit2, Trash2 } from "lucide-react";

const ExpenseTable = ({ expenses = [], onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
        <p className="text-gray-500 text-sm">No expense records available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            {expenses.map((expense) => (
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
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(expense);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(expense.id); // Yeh Expenses.jsx ke deleteId ko trigger karega
                    }}
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
    </div>
  );
};

export default ExpenseTable;
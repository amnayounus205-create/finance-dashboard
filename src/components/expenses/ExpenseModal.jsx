import ExpenseForm from "./ExpenseForm";

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary">
            {initialData ? "Edit Expense" : "Add New Expense"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <ExpenseForm
            onSubmit={onSubmit}
            initialData={initialData}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
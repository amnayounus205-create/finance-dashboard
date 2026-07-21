import IncomeForm from "./IncomeForm";

const IncomeModal = ({ open, onClose, income }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
  <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl my-8">
    
    {/* Header */}
    <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white rounded-t-2xl">
      <h2 className="text-2xl font-bold text-secondary">
        {income ? "Edit Income" : "Add Income"}
      </h2>

      <button
        onClick={onClose}
        className="text-3xl font-bold text-gray-500 hover:text-red-500"
      >
        ×
      </button>
    </div>

    {/* Body */}
    <div className="max-h-[75vh] overflow-y-auto p-6">
      <IncomeForm
        income={income}
        onClose={onClose}
      />
    </div>

  </div>
</div>
  );
};

export default IncomeModal;
import IncomeForm from "./IncomeForm";

const IncomeModal = ({
  open,
  onClose,
  income,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-bold">
            {income ? "Edit Income" : "Add Income"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="p-6">

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
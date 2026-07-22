import { useForm } from "react-hook-form";
import { useFinance } from "../../context/FinanceContext";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Healthcare",
  "Entertainment",
  "Education",
  "Other",
];

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Bank Transfer",
  "JazzCash / EasyPaisa",
  "Other",
];

const ExpenseForm = ({ onSubmit, initialData = null, onCancel }) => {
  const { accounts = [] } = useFinance();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      amount: "",
      category: "Food",
      paymentMethod: "Cash",
      accountId: accounts[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Expense Title */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">
          Expense Title
        </label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          placeholder="e.g., Grocery Shopping"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
          })}
          placeholder="0.00"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Category & Payment Method Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            Payment Method
          </label>
          <select
            {...register("paymentMethod", { required: "Payment Method is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Selection */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">
          Deduct from Account
        </label>
        <select
          {...register("accountId", { required: "Account is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.type}) - Balance: ${acc.balance}
            </option>
          ))}
        </select>
        {errors.accountId && (
          <p className="text-red-500 text-xs mt-1">{errors.accountId.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">
          Date
        </label>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register("notes")}
          rows="3"
          placeholder="Add any extra details..."
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          {initialData ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
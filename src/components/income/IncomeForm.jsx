import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

import { useFinance } from "../../context/FinanceContext";

const categories = [
  "Salary",
  "Freelancing",
  "Business",
  "Investments",
  "Other",
];

const IncomeForm = ({ income, onClose }) => {
  const { addIncome, updateIncome, accounts = [] } = useFinance();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      source: "",
      amount: "",
      category: "",
      accountId: accounts[0]?.id || "",
      date: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (income) {
      reset(income);
    }
  }, [income, reset]);

  const onSubmit = (data) => {
    const newIncome = {
      id: income ? income.id : uuid(),
      source: data.source,
      amount: Number(data.amount),
      category: data.category,
      accountId: data.accountId,
      date: data.date,
      notes: data.notes,
    };

    if (income) {
      updateIncome(newIncome);
      toast.success("Income updated successfully");
    } else {
      addIncome(newIncome);
      toast.success("Income added successfully");
    }

    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Income Source */}
      <div>
        <label className="block mb-2 font-medium">Income Source</label>
        <input
          type="text"
          placeholder="Salary"
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          {...register("source", {
            required: "Income source is required",
          })}
        />
        <p className="text-red-500 text-sm mt-1">{errors.source?.message}</p>
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-2 font-medium">Amount</label>
        <input
          type="number"
          placeholder="5000"
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          {...register("amount", {
            required: "Amount is required",
            min: {
              value: 1,
              message: "Amount must be greater than 0",
            },
          })}
        />
        <p className="text-red-500 text-sm mt-1">{errors.amount?.message}</p>
      </div>

      {/* Category & Account Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select Category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm mt-1">{errors.category?.message}</p>
        </div>

        <div>
          <label className="block mb-2 font-medium">Account</label>
          <select
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            {...register("accountId", {
              required: "Account is required",
            })}
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm mt-1">{errors.accountId?.message}</p>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block mb-2 font-medium">Date</label>
        <input
          type="date"
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          {...register("date", {
            required: "Date is required",
          })}
        />
        <p className="text-red-500 text-sm mt-1">{errors.date?.message}</p>
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-2 font-medium">Notes</label>
        <textarea
          rows="3"
          placeholder="Optional notes..."
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          {...register("notes")}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {income ? "Update Income" : "Save Income"}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
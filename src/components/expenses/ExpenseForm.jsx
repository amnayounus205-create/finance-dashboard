import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFinance } from "../../context/FinanceContext";
import { Upload, FileText, Trash2, Tag as TagIcon } from "lucide-react";

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
  const { accounts = [], tags = [] } = useFinance();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      amount: "",
      category: "Food",
      paymentMethod: "Cash",
      tag: tags[0]?.name || "",
      accountId: accounts[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      attachment: null,
    },
  });

  const attachment = watch("attachment");

  // --- File Upload Handler ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("attachment", {
        name: file.name,
        type: file.type,
        data: reader.result, // Base64 encoding for preview and storage
      });
    };
    reader.readAsDataURL(file);
  };

  // --- Delete Attachment Handler ---
  const handleDeleteAttachment = () => {
    setValue("attachment", null);
  };

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

      {/* Tag Selection */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1 flex items-center gap-1.5">
          <TagIcon size={16} /> Tag
        </label>
        <select
          {...register("tag")}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select Tag</option>
          {tags.map((t) => (
            <option key={t.id || t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
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
          rows="2"
          placeholder="Add any extra details..."
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Attachment Support Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary">
          Receipt Attachment (Image / PDF)
        </label>

        {!attachment ? (
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-4 pb-5">
              <Upload size={20} className="mb-2 text-gray-400" />
              <p className="mb-1 text-xs text-gray-500">
                <span className="font-semibold">Click to upload receipt</span>
              </p>
              <p className="text-[10px] text-gray-400">PNG, JPG or PDF</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 overflow-hidden">
              {attachment.type?.includes("image") ? (
                <img
                  src={attachment.data}
                  alt="Receipt Preview"
                  className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText size={20} />
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {attachment.name}
                </p>
                <p className="text-[10px] text-emerald-600">Attached successfully</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteAttachment}
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
              title="Delete attachment"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
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
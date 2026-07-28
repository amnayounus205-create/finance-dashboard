import React, { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import Button from "../common/Button";
import { Upload, FileText, Trash2 } from "lucide-react";

const IncomeForm = ({ income, onClose }) => {
  const { addIncome, updateIncome, tags, accounts, currencySymbol } = useFinance();

  const [formData, setFormData] = useState({
    source: income?.source || "",
    category: income?.category || "",
    tag: income?.tag || tags[0]?.name || "",
    amount: income?.amount || "",
    date: income?.date || new Date().toISOString().split("T")[0],
    accountId: income?.accountId || accounts[0]?.id || "",
    notes: income?.notes || "",
    attachment: income?.attachment || null, // <-- Attachment State Added
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- File Upload Handler ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        attachment: {
          name: file.name,
          type: file.type,
          data: reader.result, // Base64 encoding for preview and local saving
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // --- Delete Attachment Handler ---
  const handleDeleteAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachment: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.source || !formData.amount) {
      setError("Please fill in all required fields (Source and Amount).");
      return;
    }

    const payload = {
      ...formData,
      id: income ? income.id : Date.now().toString(),
      amount: Number(formData.amount),
    };

    if (income) {
      updateIncome(payload);
    } else {
      addIncome(payload);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
          {error}
        </div>
      )}

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Source <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="source"
          value={formData.source}
          onChange={handleChange}
          placeholder="e.g. Salary, Freelance, Client X"
          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Job, Project"
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Tag Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Tag
          </label>
          <select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
          >
            {tags.map((t) => (
              <option key={t.id || t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Amount ({currencySymbol}) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="any"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Account selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Deposit Account
        </label>
        <select
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.type})
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          rows="2"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional remarks..."
          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* --- 7. Attachment Support Section --- */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Receipt Attachment (Image / PDF)
        </label>

        {!formData.attachment ? (
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-gray-50/50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
            <div className="flex flex-col items-center justify-center pt-4 pb-5">
              <Upload size={20} className="mb-2 text-gray-400" />
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
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
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl">
            <div className="flex items-center gap-3 overflow-hidden">
              {formData.attachment.type?.includes("image") ? (
                <img
                  src={formData.attachment.data}
                  alt="Receipt Preview"
                  className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-slate-700"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg">
                  <FileText size={20} />
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {formData.attachment.name}
                </p>
                <p className="text-[10px] text-emerald-600">Attached successfully</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteAttachment}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition"
              title="Delete attachment"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
          {income ? "Update Income" : "Save Income"}
        </Button>
      </div>
    </form>
  );
};

export default IncomeForm;
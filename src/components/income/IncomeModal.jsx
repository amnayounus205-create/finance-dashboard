import React from "react";
import { X } from "lucide-react";
import IncomeForm from "./IncomeForm";

const IncomeModal = ({ open, onClose, income }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-800 shadow-2xl my-8 border border-gray-100 dark:border-slate-700 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 px-6 py-4 sticky top-0 bg-white dark:bg-slate-800 rounded-t-2xl z-10">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {income ? "Edit Income" : "Add Income"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer"
          >
            <X size={18} />
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
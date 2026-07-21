import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onCancel,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden transform scale-100 transition-all">
        <div className="p-6 sm:p-8">
          {/* Icon Header */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center shadow-inner">
              <AlertTriangle size={32} className="text-red-600 animate-pulse" />
            </div>
          </div>

          {/* Title & Message */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-secondary">
            {title}
          </h2>

          <p className="mt-3 text-center text-gray-500 text-sm sm:text-base leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:scale-95 transition-all text-sm"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-sm shadow-red-200 active:scale-95 transition-all text-sm"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
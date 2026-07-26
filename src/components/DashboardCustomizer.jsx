import React, { useState } from "react";
import { Eye, EyeOff, GripVertical, Check } from "lucide-react";

const DashboardCustomizer = ({ cardsConfig, setCardsConfig, onClose }) => {
  const [localConfig, setLocalConfig] = useState(cardsConfig);

  // Toggle card visibility
  const toggleVisibility = (id) => {
    setLocalConfig((prev) =>
      prev.map((card) => (card.id === id ? { ...card, visible: !card.visible } : card))
    );
  };

  // Move card up/down for reordering
  const moveCard = (index, direction) => {
    const newConfig = [...localConfig];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newConfig.length) return;

    // Swap items
    const temp = newConfig[index];
    newConfig[index] = newConfig[targetIndex];
    newConfig[targetIndex] = temp;

    setLocalConfig(newConfig);
  };

  // Save changes to parent & Local Storage
  const handleSave = () => {
    setCardsConfig(localConfig);
    localStorage.setItem("dashboard_cards_config", JSON.stringify(localConfig));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-secondary">Customize Dashboard</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <p className="text-xs text-gray-500">
          Cards ki visibility toggle karein aur upar/neeche move karke apna layout set karein.
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {localConfig.map((card, index) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-gray-400 cursor-grab" />
                <span className="text-sm font-medium text-slate-800">{card.title}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                <button
                  onClick={() => moveCard(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveCard(index, "down")}
                  disabled={index === localConfig.length - 1}
                  className="p-1 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                >
                  ▼
                </button>

                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleVisibility(card.id)}
                  className={`p-1.5 rounded-lg transition ${
                    card.visible ? "text-emerald-600 bg-emerald-50" : "text-gray-400 bg-gray-200"
                  }`}
                >
                  {card.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <Check size={14} /> Save Layout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomizer;
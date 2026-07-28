// --- DASHBOARD CUSTOMIZER MODAL COMPONENT ---
function DashboardCustomizer({ cardsConfig, setCardsConfig, onClose }) {
  const [localConfig, setLocalConfig] = useState(cardsConfig);

  const toggleVisibility = (id) => {
    setLocalConfig((prev) =>
      prev.map((card) => (card.id === id ? { ...card, visible: !card.visible } : card))
    );
  };

  const moveCard = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localConfig.length) return;

    const updatedConfig = [...localConfig];
    const [movedItem] = updatedConfig.splice(index, 1);
    updatedConfig.splice(newIndex, 0, movedItem);

    setLocalConfig(updatedConfig);
  };

  const handleSave = () => {
    setCardsConfig(localConfig);
    localStorage.setItem("dashboard_cards_config", JSON.stringify(localConfig));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Customize Dashboard</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cards ki position oopar ya neeche karne ke liye arrows ka istemal karein, aur ankh (eye) icon se show/hide karein.
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {localConfig.map((card, index) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-1 text-gray-400">
                  <GripVertical size={16} />
                </div>
                <span className="text-sm font-medium">{card.title}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Move Up */}
                <button
                  onClick={() => moveCard(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 rounded-lg transition"
                  title="Move Up"
                >
                  ▲
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveCard(index, "down")}
                  disabled={index === localConfig.length - 1}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 rounded-lg transition"
                  title="Move Down"
                >
                  ▼
                </button>

                <div className="h-4 w-[1px] bg-gray-200 dark:bg-slate-600 mx-1"></div>

                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleVisibility(card.id)}
                  className={`p-1.5 rounded-lg transition ${
                    card.visible ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" : "text-gray-400 bg-gray-200 dark:bg-slate-600"
                  }`}
                  title={card.visible ? "Hide Card" : "Show Card"}
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
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition"
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
}
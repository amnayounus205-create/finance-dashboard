import { useState } from "react";
import { Target, Plus, Trophy, Trash2, Edit2, PlusCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import GoalForm from "../components/GoalForm";
import toast from "react-hot-toast";

const Goals = () => {
  const { goals = [], deleteGoal, contributeToGoal, userProfile } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [contributeGoal, setContributeGoal] = useState(null);
  const [contribAmount, setContribAmount] = useState("");

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  const handleContribute = (e) => {
    e.preventDefault();
    if (!contribAmount || isNaN(contribAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }
    contributeToGoal(contributeGoal.id, parseFloat(contribAmount));
    toast.success(`Successfully added ${currencySymbol}${contribAmount} to ${contributeGoal.title}!`);
    setContributeGoal(null);
    setContribAmount("");
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Savings & Financial Goals</h1>
          <p className="text-gray-500 mt-1">Set targets, track savings progress, and achieve your financial dreams.</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
        >
          <Plus size={18} />
          {showForm && !editingItem ? "Close Form" : "Create New Goal"}
        </button>
      </div>

      {showForm && (
        <GoalForm
          editingItem={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full bg-white p-10 rounded-2xl border border-gray-100 text-center space-y-3">
            <Target size={40} className="mx-auto text-gray-300" />
            <h3 className="font-bold text-secondary text-lg">No savings goals found</h3>
            <p className="text-gray-400 text-sm">Create your first goal above to start tracking your savings.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-5 relative">
                {/* Top Section */}
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                        {isCompleted ? <Trophy size={22} /> : <Target size={22} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary text-base">{goal.title}</h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full mt-1 ${isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {isCompleted ? <CheckCircle2 size={12} /> : null}
                          {isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(goal);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
                        title="Edit Goal"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(goal.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
                        title="Delete Goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Stats & Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-secondary">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-blue-600"}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 pt-1 font-medium">
                    <span>{currencySymbol}{Number(goal.currentAmount).toLocaleString()}</span>
                    <span>Target: {currencySymbol}{Number(goal.targetAmount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Footer / Contribute Button */}
                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Deadline: <span className="font-medium text-secondary">{goal.deadline}</span></span>
                  {!isCompleted && (
                    <button
                      onClick={() => setContributeGoal(goal)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl text-xs transition"
                    >
                      <PlusCircle size={14} /> Add Funds
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contribute Modal */}
      {contributeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <form onSubmit={handleContribute} className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary">Add Funds to "{contributeGoal.title}"</h3>
            <p className="text-xs text-gray-500">Enter the amount you want to deposit toward this savings goal.</p>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Deposit Amount</label>
              <input
                type="number"
                step="any"
                value={contribAmount}
                onChange={(e) => setContribAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setContributeGoal(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-secondary">Delete Saving Goal</h2>
            <p className="text-gray-500 text-sm">Are you sure you want to delete this goal? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteGoal(deleteId);
                  toast.success("Goal deleted successfully!");
                  setDeleteId(null);
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 text-sm shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
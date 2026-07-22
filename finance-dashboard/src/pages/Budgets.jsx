import { useState } from "react";
import { Plus, Target, AlertTriangle } from "lucide-react";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetForm from "../components/budgets/BudgetForm";
import { useFinance } from "../context/FinanceContext";

const Budgets = () => {
  const { budgets = [], expenses = [], addBudget, updateBudget, deleteBudget } = useFinance();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // Delete confirmation state

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = (data) => {
    if (editingBudget) {
      updateBudget({ ...editingBudget, ...data, limit: Number(data.limit) });
    } else {
      addBudget({ ...data, id: Date.now(), limit: Number(data.limit) });
    }
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  // Open Edit Modal
  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  // Helper to calculate total spent per category for the budget's month
  const getSpentForCategory = (category, month) => {
    return expenses
      .filter((exp) => {
        const matchesCategory = category === "Overall / General" || exp.category === category;
        const matchesMonth = exp.date && exp.date.startsWith(month);
        return matchesCategory && matchesMonth;
      })
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Budget Management</h1>
          <p className="text-gray-500 mt-1">
            Set and monitor monthly spending limits to stay on track.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm gap-2"
        >
          <Plus size={18} />
          Create Budget
        </button>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Target size={24} />
          </div>
          <h3 className="text-lg font-bold text-secondary">No Budgets Set</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Create your first monthly budget category to start tracking your spending progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const spent = getSpentForCategory(budget.category, budget.month);
            return (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={spent}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            );
          })}
        </div>
      )}

      {/* Modal for Add/Edit Budget */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-center">
              <h3 className="text-lg font-bold text-secondary">
                {editingBudget ? "Edit Budget Limit" : "Create New Budget"}
              </h3>
            </div>
            <div className="p-6">
              <BudgetForm
                onSubmit={handleFormSubmit}
                initialData={editingBudget}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-secondary">Delete Budget</h2>
            
            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this monthly budget limit? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 text-sm transition"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => {
                  deleteBudget(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 text-sm transition shadow-sm"
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

export default Budgets;
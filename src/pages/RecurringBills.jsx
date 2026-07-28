import { useState, useMemo } from "react";
import { Plus, Calendar, Clock, AlertCircle, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const RecurringBills = () => {
  const { recurringBills = [], currencySymbol, addRecurringBill, updateRecurringBill, deleteRecurringBill } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Monthly"); // Monthly, Weekly, Yearly
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Bills");

  const handleOpenAdd = () => {
    setEditingBill(null);
    setName("");
    setAmount("");
    setFrequency("Monthly");
    setDueDate(new Date().toISOString().slice(0, 10));
    setCategory("Bills");
    setIsModalOpen(true);
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setName(bill.name);
    setAmount(bill.amount);
    setFrequency(bill.frequency);
    setDueDate(bill.dueDate);
    setCategory(bill.category);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const billData = {
      id: editingBill ? editingBill.id : Date.now(),
      name,
      amount: Number(amount),
      frequency,
      dueDate,
      category,
    };

    if (editingBill) {
      updateRecurringBill(billData);
    } else {
      addRecurringBill(billData);
    }

    setIsModalOpen(false);
  };

  // Helper to calculate days remaining until due date
  const getDaysRemaining = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sort bills by upcoming due date
  const sortedBills = useMemo(() => {
    return [...recurringBills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [recurringBills]);

  // Upcoming bills (due in next 7 days or overdue)
  const upcomingWidgetBills = useMemo(() => {
    return sortedBills.filter((bill) => {
      const days = getDaysRemaining(bill.dueDate);
      return days <= 7; // overdue or due within a week
    });
  }, [sortedBills]);

  const totalMonthlyRecurring = useMemo(() => {
    return recurringBills.reduce((sum, bill) => {
      let monthlyAmount = Number(bill.amount || 0);
      if (bill.frequency === "Weekly") monthlyAmount *= 4.33;
      if (bill.frequency === "Yearly") monthlyAmount /= 12;
      return sum + monthlyAmount;
    }, 0);
  }, [recurringBills]);

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Recurring Bills</h1>
          <p className="text-gray-500 mt-1">
            Manage your subscription services, utilities, and scheduled payments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm gap-2"
        >
          <Plus size={18} />
          Add Recurring Bill
        </button>
      </div>

      {/* Upcoming Bills Widget */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upcoming Bills Radar</h2>
              <p className="text-xs text-blue-200">Bills due in the next 7 days or requiring immediate attention</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-blue-300 uppercase font-semibold">Est. Monthly Total</span>
            <p className="text-xl font-extrabold">{currencySymbol}{totalMonthlyRecurring.toFixed(2)}</p>
          </div>
        </div>

        {upcomingWidgetBills.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <p className="text-sm text-blue-200">No upcoming bills due in the next 7 days. You're all caught up! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingWidgetBills.map((bill) => {
              const daysLeft = getDaysRemaining(bill.dueDate);
              let badgeBg = "bg-amber-500/20 text-amber-300 border-amber-500/30";
              let badgeText = `Due in ${daysLeft} days`;

              if (daysLeft < 0) {
                badgeBg = "bg-red-500/20 text-red-300 border-red-500/30";
                badgeText = `Overdue by ${Math.abs(daysLeft)} days`;
              } else if (daysLeft === 0) {
                badgeBg = "bg-rose-500/20 text-rose-300 border-rose-500/30";
                badgeText = "Due Today!";
              }

              return (
                <div key={bill.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeBg}`}>
                      {badgeText}
                    </span>
                    <h3 className="font-bold text-white text-base">{bill.name}</h3>
                    <p className="text-xs text-blue-200">{bill.frequency} • {bill.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-white">
                      {currencySymbol}{Number(bill.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Recurring Bills Table / Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary">All Active Scheduled Bills</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
            {recurringBills.length} Total
          </span>
        </div>

        {sortedBills.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Calendar size={24} />
            </div>
            <h4 className="text-base font-bold text-secondary">No Recurring Bills Added</h4>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Add your regular monthly subscriptions or utility bills to track them effortlessly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Bill Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Frequency</th>
                  <th className="py-4 px-6">Next Due Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sortedBills.map((bill) => {
                  const daysLeft = getDaysRemaining(bill.dueDate);
                  return (
                    <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-secondary">
                        {bill.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {bill.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 capitalize font-medium">{bill.frequency}</td>
                      <td className="py-4 px-6 text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>{bill.dueDate}</span>
                          {daysLeft <= 3 && daysLeft >= 0 && (
                            <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-md font-semibold">
                              Due Soon
                            </span>
                          )}
                          {daysLeft < 0 && (
                            <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-md font-semibold">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-secondary">
                        {currencySymbol}{Number(bill.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(bill)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(bill.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-xl font-bold text-secondary text-center">
              {editingBill ? "Edit Recurring Bill" : "Add Recurring Bill"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix Subscription, Electricity Bill"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Bills">Bills</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm transition shadow-sm"
                >
                  {editingBill ? "Update Bill" : "Save Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-secondary">Delete Recurring Bill</h2>
            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this scheduled bill? This action cannot be undone.
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
                  deleteRecurringBill(deleteId);
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

export default RecurringBills;
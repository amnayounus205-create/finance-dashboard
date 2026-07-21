import { useMemo, useState } from "react";
import { Pencil, Trash2, ArrowUpDown, Receipt } from "lucide-react";
import toast from "react-hot-toast";

import { useFinance } from "../../context/FinanceContext";
import ConfirmModal from "../common/ConfirmModal";

const IncomeTable = ({ incomes, onEdit }) => {
  const { deleteIncome } = useFinance();

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteIncome(selectedId);
    toast.success("Income record deleted");
    setOpenDelete(false);
    setSelectedId(null);
  };

  const handleCancel = () => {
    setOpenDelete(false);
    setSelectedId(null);
  };

  const sortedIncomes = useMemo(() => {
    const data = [...incomes];

    switch (sortBy) {
      case "newest":
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return data.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "highest":
        return data.sort((a, b) => Number(b.amount) - Number(a.amount));
      case "lowest":
        return data.sort((a, b) => Number(a.amount) - Number(b.amount));
      default:
        return data;
    }
  }, [incomes, sortBy]);

  if (!sortedIncomes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-gray-100 p-4 text-gray-400">
          <Receipt size={36} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No income entries found
        </h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          We couldn't find any income matching your search criteria. Try adjusting your filter or adding a new record.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Table Sorting Control */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase text-gray-400 tracking-wider">
          Showing {sortedIncomes.length} {sortedIncomes.length === 1 ? "entry" : "entries"}
        </span>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={15} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="highest">Sort by: Highest Amount</option>
            <option value="lowest">Sort by: Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3.5">Source & Notes</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5 text-right">Amount</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {sortedIncomes.map((income) => (
              <tr
                key={income.id}
                className="transition hover:bg-gray-50/80"
              >
                {/* Source & Notes */}
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">
                    {income.source}
                  </div>
                  {income.notes && (
                    <div className="mt-0.5 text-xs text-gray-400 truncate max-w-xs">
                      {income.notes}
                    </div>
                  )}
                </td>

                {/* Category Badge */}
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {income.category}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                  +${Number(income.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                {/* Date */}
                <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                  {new Date(income.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Action Controls */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(income)}
                      title="Edit Income"
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(income.id)}
                      title="Delete Income"
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={openDelete}
        title="Delete Income Record"
        message="Are you sure you want to delete this income record? This action cannot be undone."
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default IncomeTable;
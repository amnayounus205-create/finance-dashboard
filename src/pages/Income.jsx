import { useMemo, useState } from "react";
import {
  Plus,
  DollarSign,
  Wallet,
  BarChart3,
  Download,
  Search,
  X,
  TrendingUp
} from "lucide-react";

import { useFinance } from "../context/FinanceContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import IncomeModal from "../components/income/IncomeModal";
import IncomeTable from "../components/income/IncomeTable";

const Income = () => {
  const { incomes } = useFinance();

  const [open, setOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    setSelectedIncome(null);
    setOpen(true);
  };

  const handleEdit = (income) => {
    setSelectedIncome(income);
    setOpen(true);
  };

  const filteredIncome = useMemo(() => {
    if (!search.trim()) return incomes;
    const query = search.toLowerCase();
    return incomes.filter((item) => {
      const text = `${item.source} ${item.category} ${item.notes || ""}`.toLowerCase();
      return text.includes(query);
    });
  }, [search, incomes]);

  const totalIncome = useMemo(
    () => filteredIncome.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filteredIncome]
  );

  const averageIncome = useMemo(
    () => (filteredIncome.length > 0 ? totalIncome / filteredIncome.length : 0),
    [filteredIncome, totalIncome]
  );

  const highestIncome = useMemo(
    () => (filteredIncome.length > 0 ? Math.max(...filteredIncome.map((i) => Number(i.amount || 0))) : 0),
    [filteredIncome]
  );

  const exportCSV = () => {
    if (!filteredIncome.length) return;

    const headers = ["Source", "Category", "Amount", "Date", "Notes"];
    const rows = filteredIncome.map((item) => [
      `"${item.source || ""}"`,
      `"${item.category || ""}"`,
      item.amount,
      item.date,
      `"${item.notes || ""}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `income-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Income Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track, filter, and export all your incoming cash flows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={exportCSV}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
          >
            <Plus size={18} />
            <span>Add Income</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Income */}
        <Card className="relative overflow-hidden p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Income
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        {/* Total Entries */}
        <Card className="relative overflow-hidden p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Records
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {filteredIncome.length}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Wallet size={24} />
            </div>
          </div>
        </Card>

        {/* Average Income */}
        <Card className="relative overflow-hidden p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Average Entry
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-purple-600 sm:text-3xl">
                ${averageIncome.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <BarChart3 size={24} />
            </div>
          </div>
        </Card>

        {/* Highest Income */}
        <Card className="relative overflow-hidden p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Highest Single
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-amber-600 sm:text-3xl">
                ${highestIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Table Container with Integrated Search Bar */}
      <Card className="overflow-hidden border border-gray-200 bg-white shadow-xs">
        {/* Search Bar Header */}
        <div className="border-b border-gray-100 p-4">
          <div className="relative max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by source, category, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Table Render */}
        <div className="p-4">
          <IncomeTable incomes={filteredIncome} onEdit={handleEdit} />
        </div>
      </Card>

      {/* Income Modal for Add / Edit */}
      <IncomeModal
        open={open}
        onClose={() => setOpen(false)}
        income={selectedIncome}
      />
    </div>
  );
};

export default Income;
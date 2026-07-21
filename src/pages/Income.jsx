import { useState } from "react";
import { Plus } from "lucide-react";

import { useFinance } from "../context/FinanceContext";

import Button from "../components/common/Button";
import Card from "../components/common/Card";

import IncomeModal from "../components/income/IncomeModal";
import IncomeTable from "../components/income/IncomeTable";

const Income = () => {
  const { incomes } = useFinance();

  const [open, setOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const handleAdd = () => {
    setSelectedIncome(null);
    setOpen(true);
  };

  const handleEdit = (income) => {
    setSelectedIncome(income);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">
            Income Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all your income sources.
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus size={18} />
          <span>Add Income</span>
        </Button>
      </div>

      <Card>
        <IncomeTable
          incomes={incomes}
          onEdit={handleEdit}
        />
      </Card>

      <IncomeModal
        open={open}
        onClose={() => setOpen(false)}
        income={selectedIncome}
      />
    </div>
  );
};

export default Income;
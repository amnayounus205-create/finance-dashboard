import {
  Wallet,
  TrendingUp,
  CreditCard,
  Target,
  DollarSign,
} from "lucide-react";

import SummaryCard from "./SummaryCard";
import { useFinance } from "../../context/FinanceContext";

const DashboardCards = () => {
  const {
    totalBalance,
    totalIncome,
    totalExpense,
    remainingBudget,
    monthlySavings,
  } = useFinance();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <SummaryCard
        title="Total Balance"
        value={totalBalance}
        icon={<Wallet size={20} />}
        color="bg-emerald-50 text-emerald-600"
      />

      <SummaryCard
        title="Total Income"
        value={totalIncome}
        icon={<TrendingUp size={20} />}
        color="bg-green-50 text-green-600"
      />

      <SummaryCard
        title="Total Expenses"
        value={totalExpense}
        icon={<CreditCard size={20} />}
        color="bg-rose-50 text-rose-600"
      />

      <SummaryCard
        title="Remaining Budget"
        value={remainingBudget}
        icon={<Target size={20} />}
        color="bg-amber-50 text-amber-600"
      />

      <SummaryCard
        title="Monthly Savings"
        value={monthlySavings}
        icon={<DollarSign size={20} />}
        color="bg-blue-50 text-blue-600"
      />
    </div>
  );
};

export default DashboardCards;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

      <SummaryCard
        title="Total Balance"
        value={totalBalance}
        icon={<Wallet size={30} />}
        color="bg-primary"
      />

      <SummaryCard
        title="Total Income"
        value={totalIncome}
        icon={<TrendingUp size={30} />}
        color="bg-income"
      />

      <SummaryCard
        title="Total Expenses"
        value={totalExpense}
        icon={<CreditCard size={30} />}
        color="bg-expense"
      />

      <SummaryCard
        title="Remaining Budget"
        value={remainingBudget}
        icon={<Target size={30} />}
        color="bg-budget"
      />

      <SummaryCard
        title="Monthly Savings"
        value={monthlySavings}
        icon={<DollarSign size={30} />}
        color="bg-savings"
      />

    </div>
  );
};

export default DashboardCards;
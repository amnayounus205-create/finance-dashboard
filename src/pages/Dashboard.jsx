import Card from "../components/common/Card";
import { useFinance } from "../context/FinanceContext";

function Dashboard() {
  const {
    totalBalance,
    totalIncome,
    totalExpense,
    remainingBudget,
    monthlySavings,
  } = useFinance();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <Card
          title="Total Balance"
          value={totalBalance}
          color="#2563EB"
        />

        <Card
          title="Total Income"
          value={totalIncome}
          color="#22C55E"
        />

        <Card
          title="Total Expenses"
          value={totalExpense}
          color="#EF4444"
        />

        <Card
          title="Remaining Budget"
          value={remainingBudget}
          color="#F59E0B"
        />

        <Card
          title="Monthly Savings"
          value={monthlySavings}
          color="#3B82F6"
        />

      </div>
    </div>
  );
}

export default Dashboard;
import Card from "../common/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";

const IncomeExpenseBarChart = () => {
  const { totalIncome, totalExpense } = useFinance();

  const data = [
    {
      name: "Finance",
      Income: totalIncome,
      Expense: totalExpense,
    },
  ];

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-5">
        Income vs Expenses
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="Income"
            fill="#22C55E"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="Expense"
            fill="#EF4444"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IncomeExpenseBarChart;
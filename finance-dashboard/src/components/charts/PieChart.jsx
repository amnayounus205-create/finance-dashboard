import Card from "../common/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#EC4899",
];

const ExpensePieChart = () => {
  const { expenses } = useFinance();

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-5">
        Expense by Category
      </h2>

      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No expense data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={110}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default ExpensePieChart;
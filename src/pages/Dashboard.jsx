import DashboardCards from "../components/dashboard/DashboardCards";
import IncomeExpenseBarChart from "../components/charts/BarChart";
import ExpensePieChart from "../components/charts/PieChart";

const Dashboard = () => {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-secondary">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Here's an overview of your finances.
        </p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <IncomeExpenseBarChart />

        <ExpensePieChart />

      </div>

    </div>
  );
};

export default Dashboard;
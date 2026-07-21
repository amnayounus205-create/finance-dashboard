import DashboardCards from "../components/dashboard/DashboardCards";
import IncomeExpenseBarChart from "../components/charts/BarChart";
import ExpensePieChart from "../components/charts/PieChart";

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s a quick overview of your finances.
        </p>
      </div>

      {/* Summary Cards */}
      <DashboardCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <IncomeExpenseBarChart />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <ExpensePieChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
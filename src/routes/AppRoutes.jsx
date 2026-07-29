import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import ErrorBoundary from "../components/common/ErrorBoundary";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// 🚀 Lazy Loaded Pages (Code Splitting)
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Income = lazy(() => import("../pages/Income"));
const Expenses = lazy(() => import("../pages/Expenses"));
const Transactions = lazy(() => import("../pages/Transactions"));
const Budgets = lazy(() => import("../pages/Budgets"));
const Reports = lazy(() => import("../pages/Reports"));
const RecurringBills = lazy(() => import("../pages/RecurringBills"));
const Profile = lazy(() => import("../pages/Profile"));
const Accounts = lazy(() => import("../pages/Accounts"));
const Recurring = lazy(() => import("../pages/Recurring"));
const Goals = lazy(() => import("../pages/Goals"));
const Invoices = lazy(() => import("../pages/Invoices"));
const Notifications = lazy(() => import("../pages/Notifications"));
const UsersPage = lazy(() => import("../pages/Users"));
const ActivityLogs = lazy(() => import("../pages/ActivityLogs"));
const CalendarModule = lazy(() => import("../pages/Calendar"));

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/recurring" element={<Recurring />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/recurring-bills" element={<RecurringBills />} />
              <Route path="/calendar" element={<CalendarModule />} />
              <Route path="/activity-logs" element={<ActivityLogs />} />
            </Route>
          </Route>

          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default AppRoutes;
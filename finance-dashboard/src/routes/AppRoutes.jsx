import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Income from "../pages/Income";
import Expenses from "../pages/Expenses";
import Transactions from "../pages/Transactions";
import Budgets from "../pages/Budgets";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import Accounts from "../pages/Accounts";
import Recurring from "../pages/Recurring";
import Goals from "../pages/Goals";
import Invoices from "../pages/Invoices";
import Notifications from "../pages/Notifications"; // <-- 1. Import Notifications Page

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

function AppRoutes() {
  return (
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
          <Route path="/notifications" element={<Notifications />} /> {/* <-- 2. Add Route Here */}
        </Route>
      </Route>

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
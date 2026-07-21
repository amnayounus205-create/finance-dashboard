import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user } = useAuth();

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If logged in, render nested routes
  return <Outlet />;
}

export default ProtectedRoute;
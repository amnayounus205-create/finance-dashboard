import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2">{user?.email}</p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
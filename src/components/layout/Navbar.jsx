import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-slate-800">
        Finance Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0)}
        </div>

        <div>
          <h2 className="font-semibold">
            {user?.name}
          </h2>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
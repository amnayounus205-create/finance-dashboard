import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) return;

    login(email);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Finance Dashboard
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border rounded-lg p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("financeUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email) => {
    const userData = {
      id: Date.now(),
      name: "Finance User",
      email,
    };

    setUser(userData);

    localStorage.setItem("financeUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("financeUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("financeUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email) => {
    const userData = {
      email,
      name: "Finance User",
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
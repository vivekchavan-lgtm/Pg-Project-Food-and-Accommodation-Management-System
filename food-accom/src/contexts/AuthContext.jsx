import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Initialize headers immediately if user exists
const initializeAuthHeader = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }
  }
};

initializeAuthHeader();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync header on user change
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Header handled by useEffect
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Header handled by useEffect via user change
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

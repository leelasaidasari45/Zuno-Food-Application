// src/context/AuthContext.jsx
// Global state for the logged-in user.
// Any component in the app can read the user and token from here.

import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

// Step 1: Create the context object
const AuthContext = createContext();

// Step 2: Create the Provider - wraps the whole app
// "children" = all the components inside <AuthProvider>
export const AuthProvider = ({ children }) => {
  // Try to load existing user from localStorage (so they stay logged in on refresh)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Verify and sync latest user profile & role from the database on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          // Token expired or invalid - let user log in again
        });
    }
  }, []);

  // login: saves user + token to state AND localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // logout: clears everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // The value object is what all child components can access
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook - makes it easy to use auth in any component
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  return useContext(AuthContext);
};

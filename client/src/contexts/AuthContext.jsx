import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for authentication on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated by making a request to the profile endpoint
      // The cookie will be automatically included with withCredentials: true
      // Skip auto-redirect for this auth check request
      const response = await api.get("/users/profile", {
        skipAuthRedirect: true,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    // No need to store token in localStorage as it's now in HTTP-only cookies
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear the HTTP-only cookie
      await api.post("/users/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = {
    isAuthenticated,
    loading: isLoading,
    user,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

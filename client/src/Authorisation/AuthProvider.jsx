/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext({
  isAuthenticated: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (token, user, name, profilePicture) => {
    localStorage.setItem("token", token);
    localStorage.setItem("loggedInUser", name);
    localStorage.setItem(
      "profilePicture",
      profilePicture ||
        "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
    );
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    // Set admin status based on user role
    setIsAdmin(user.role === "admin");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("profilePicture");
    setToken("");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "https://odoohackathon-h2x5.onrender.com/api/auth/verify",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            // Check if user is admin based on role
            setIsAdmin(response.data.user.role === "admin");
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      } else {
        logout();
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    // Update admin status when user data changes
    if (user) {
      setIsAdmin(user.role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("uniplus_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem("uniplus_user");
      }
    }
    setLoading(false);
  }, []);

  // ✅ FIXED: login function (Mock-based)
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      if (email && password) {
        const isAdminUser = email.includes("admin"); // ✅ Check if admin
        const userData = {
          id: "user123",
          name: email.split("@")[0],
          email,
          role: isAdminUser ? "admin" : "user",
        };

        setUser(userData);
        localStorage.setItem("uniplus_user", JSON.stringify(userData));

        console.log("User logged in:", userData); // ✅ Debugging
        return userData;
      } else {
        throw new Error("Email and password are required");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: signup function (Mock-based)
  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      if (name && email && password) {
        const isAdminUser = email.includes("admin");
        const userData = {
          id: `user_${Date.now()}`,
          name,
          email,
          role: isAdminUser ? "admin" : "user",
        };

        setUser(userData);
        localStorage.setItem("uniplus_user", JSON.stringify(userData));

        console.log("User signed up:", userData); // ✅ Debugging
        return userData;
      } else {
        throw new Error("Name, email, and password are required");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("uniplus_user");
    console.log("User logged out"); // ✅ Debugging
  };

  // ✅ Context value with admin check
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toLowerCase() === "admin", // ✅ Ensures case consistency
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

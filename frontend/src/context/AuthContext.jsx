import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const currentUser = await auth.me();
        setUser(currentUser);
        localStorage.setItem("userId", currentUser.id);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //Login
  const login = async ({ identifier, password }) => {
    const data = await auth.login({ identifier, password });

    const token = data?.accessToken || data?.AccessToken;
    const userData = data?.user || data?.User;

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    if (userData) {
      setUser(userData);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return data;
  };

  //Verify 2fa
  const verify2fa = async ({ loginAttemptId, code }) => {
    const data = await auth.verify2fa({ loginAttemptId, code });

    const token = data?.accessToken || data?.AccessToken;
    const userData = data?.user || data?.User;

    if (token) localStorage.setItem("accessToken", token);

    if (userData) {
      setUser(userData);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    localStorage.removeItem("loginAttemptId");

    return data;
  };

  // Resend 2FA
  const resend2fa = async ({ loginAttemptId }) => {
    return await auth.resend2fa({ loginAttemptId });
  };

  // Register
  const register = async ({ name, username, email, password, confirmPassword }) => {
    const data = await auth.register({
      name,
      username,
      email,
      password,
      confirmPassword,
    });

    const token = data?.accessToken || data?.AccessToken;
    const userData = data?.user || data?.User;

    if (token && userData) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { autoLoggedIn: true };
    }

    return { autoLoggedIn: false };
  };

  // Logout
  const logout = async () => {
    try {
      await auth.logout();
    } catch {
      // ignore
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("loginAttemptId");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      verify2fa,
      resend2fa,
      register,
      logout,
    }),
    [user, loading, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
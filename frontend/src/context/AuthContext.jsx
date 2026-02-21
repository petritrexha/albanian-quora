import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrating, setHydrating] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  // hydrate user on refresh (if token exists)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Development helper: allow auto-login if DEV_AUTO_LOGIN=1 and devUser is set in localStorage
      const devAuto = localStorage.getItem("DEV_AUTO_LOGIN");
      if (devAuto === "1") {
        try {
          const dev = JSON.parse(localStorage.getItem("devUser") || "null");
          if (dev) {
            setUser(dev);
            setHydrating(false);
            return;
          }
        } catch { }
      }

      setHydrating(false);
      return;
    }

    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setHydrating(false);
      }
    })();
  }, []);

const login = async ({ identifier, password }) => {
  const data = await auth.login({ emailOrUsername: identifier, password });

  const token = data?.accessToken || data?.token;
  if (token) localStorage.setItem("accessToken", token);

  if (data?.user) setUser(data.user);

  return data?.user;
};

  const register = async ({ name, username, email, password, confirmPassword }) => {
  const data = await auth.register({ name, username, email, password, confirmPassword });

  if (data?.accessToken && data?.user) {
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return { autoLoggedIn: true };
  }

  return { autoLoggedIn: false };
};

  const logout = async () => {
    await auth.logout();
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      hydrating,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
    }),
    [user, hydrating, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrating, setHydrating] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  // Restore user on refresh if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setHydrating(false);
      return;
    }

    (async () => {
      try {
        const currentUser = await auth.me();
        setUser(currentUser);
        localStorage.setItem("userId", currentUser.id);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        setUser(null);
      } finally {
        setHydrating(false);
      }
    })();
  }, []);

  const login = async ({ identifier, password }) => {
  const data = await auth.login({
    identifier,
    password,
  });

  const token = data?.accessToken || data?.token;

  if (token) {
    localStorage.setItem("accessToken", token);
  }

  if (data?.user) {
    setUser(data.user);
    localStorage.setItem("userId", data.user.id);
  }

  return data?.user;
};

  const register = async ({
    name,
    username,
    email,
    password,
    confirmPassword,
  }) => {
    const data = await auth.register({
      name,
      username,
      email,
      password,
      confirmPassword,
    });

    if (data?.accessToken && data?.user) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.user.id);
      setUser(data.user);
      return { autoLoggedIn: true };
    }

    return { autoLoggedIn: false };
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch {
      // ignore errors
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

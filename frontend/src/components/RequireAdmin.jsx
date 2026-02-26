import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null;

  // If no user exists, redirect to login
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  
  // Robust check: 
  // 1. Checks if role is 1 (Integer from C# Enum)
  // 2. Checks if role is "Admin" or "admin" (String)
  const isAdmin = 
    user?.role === 1 || 
    user?.role === "Admin" || 
    user?.role?.toString().toLowerCase() === "admin";
  
  if (!isAdmin) {
    console.warn("Aksesi u refuzua: Përdoruesi nuk është Admin", user);
    return <Navigate to="/" replace />;
  }
  
  return children;
}

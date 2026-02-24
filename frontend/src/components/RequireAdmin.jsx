import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { isAuthenticated, hydrating, user } = useAuth();
  const loc = useLocation();

  if (hydrating) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (user?.role !== "Admin" && user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { isAuthenticated, hydrating } = useAuth();
  const loc = useLocation();

  if (hydrating) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

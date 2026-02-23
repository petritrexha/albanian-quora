import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BookmarkProvider } from "./context/BookmarkContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";
import AdminDashboard from "./pages/AdminDashboard";
import RequireAdmin from "./components/RequireAdmin";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [showAskModal, setShowAskModal] = useState(false);
  const { isAuthenticated, hydrating } = useAuth();

  const withNavbar = (Component) => (
    <>
      <Navbar onOpenAskModal={() => setShowAskModal(true)} />
      {Component}
    </>
  );

  if (hydrating) {
    return null;
  }

  const ProtectedRoute = ({ element }) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;

  return (
    <BookmarkProvider>
      <Routes>
        {/* Public routes WITHOUT navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Routes WITH navbar */}
        <Route
          path="/"
          element={withNavbar(
            <Home
              showAskModal={showAskModal}
              setShowAskModal={setShowAskModal}
            />
          )}
        />

        <Route
          path="/profile"
          element={withNavbar(<ProtectedRoute element={<Profile />} />)}
        />

        <Route
          path="/question/:id"
          element={withNavbar(<QuestionDetails />)}
        />

        <Route
          path="/saved"
          element={withNavbar(<Bookmarks />)}
        />

        <Route
          path="/admin"
          element={withNavbar(
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          )}
        />

        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BookmarkProvider>
  );
}

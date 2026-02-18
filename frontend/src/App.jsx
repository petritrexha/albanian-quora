import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BookmarkProvider } from "./context/BookmarkContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  const [showAskModal, setShowAskModal] = useState(false);

  return (
    <BookmarkProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* App Layout Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar onOpenAskModal={() => setShowAskModal(true)} />
              <Home
                showAskModal={showAskModal}
                setShowAskModal={setShowAskModal}
              />
            </>
          }
        />

        <Route
          path="/question/:id"
          element={
            <>
              <Navbar onOpenAskModal={() => setShowAskModal(true)} />
              <QuestionDetails />
            </>
          }
        />

        <Route
          path="/saved"
          element={
            <>
              <Navbar onOpenAskModal={() => setShowAskModal(true)} />
              <Bookmarks />
            </>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BookmarkProvider>
  );
}

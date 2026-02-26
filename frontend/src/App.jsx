import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BookmarkProvider } from "./context/BookmarkContext";
import { ThemeProvider } from "./context/ThemeContext"; 
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import CategoryPage from "./pages/CategoryPage";
import AskModal from "./components/AskModal";
import { createQuestion } from "./services/questionService";

// Pages
import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const { loading } = useAuth();
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [refreshHome, setRefreshHome] = useState(false);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      await createQuestion({
        title: newQuestion,
        description: newQuestion,
        categoryId: selectedCategory || 1,
      });
      setNewQuestion("");
      setShowAskModal(false);
      setRefreshHome((prev) => !prev);
    } catch (err) {
      console.error("Failed to create question:", err);
    }
  };

  return (
    <ThemeProvider>
      <BookmarkProvider>
        <div className="min-h-screen bg-[var(--bg-light)] text-[var(--text-main)] transition-colors duration-300">
          {loading ? (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
              <p className="text-[var(--text-light)] font-medium animate-pulse">
                Duke u ngarkuar...
              </p>
            </div>
          ) : (
            <>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Main App Routes with Layout */}
                <Route path="/" element={
                  <Layout onOpenAskModal={() => setShowAskModal(true)} onCategorySelect={setSelectedCategory}>
                    <Home selectedCategory={selectedCategory} refreshTrigger={refreshHome} />
                  </Layout>
                } />

                <Route path="/question/:id" element={
                  <Layout onOpenAskModal={() => setShowAskModal(true)}>
                    <QuestionDetails />
                  </Layout>
                } />

                <Route path="/saved" element={
                  <Layout onOpenAskModal={() => setShowAskModal(true)}>
                    <Bookmarks />
                  </Layout>
                } />

                <Route path="/category/:id" element={
                  <Layout onOpenAskModal={() => setShowAskModal(true)}>
                    <CategoryPage />
                  </Layout>
                } />

                <Route path="/search" element={
                  <Layout onOpenAskModal={() => setShowAskModal(true)}>
                    <SearchPage />
                  </Layout>
                } />

                <Route path="/profile" element={
                  <RequireAuth>
                    <Layout onOpenAskModal={() => setShowAskModal(true)}>
                      <Profile />
                    </Layout>
                  </RequireAuth>
                } />

                <Route path="/admin" element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Ask Modal Overlay */}
              {showAskModal && (
                <div 
                  className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" 
                  onClick={() => setShowAskModal(false)}
                >
                  <div className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <AskModal
                      newQuestion={newQuestion}
                      setNewQuestion={setNewQuestion}
                      handlePostQuestion={handlePostQuestion}
                      onClose={() => setShowAskModal(false)}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </BookmarkProvider>
    </ThemeProvider>
  );
}
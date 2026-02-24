import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BookmarkProvider } from "./context/BookmarkContext";
import Layout from "./components/Layout";
import CategoryPage from "./pages/CategoryPage";
import AskModal from "./components/AskModal";
import { createQuestion } from "./services/questionService";

import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";
import SearchPage from "./pages/SearchPage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
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
    // The div below handles the #root { min-height: 100vh } requirement
    <div className="min-h-screen">
      <BookmarkProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/"
            element={
              <Layout
                onOpenAskModal={() => setShowAskModal(true)}
                onCategorySelect={setSelectedCategory}
              >
                <Home
                  selectedCategory={selectedCategory}
                  refreshTrigger={refreshHome}
                />
              </Layout>
            }
          />

          <Route
            path="/question/:id"
            element={
              <Layout onOpenAskModal={() => setShowAskModal(true)}>
                <QuestionDetails />
              </Layout>
            }
          />

          <Route
            path="/saved"
            element={
              <Layout onOpenAskModal={() => setShowAskModal(true)}>
                <Bookmarks />
              </Layout>
            }
          />

          <Route
            path="/category/:id"
            element={
              <Layout onOpenAskModal={() => setShowAskModal(true)}>
                <CategoryPage />
              </Layout>
            }
          />

          <Route
            path="/search"
            element={
              <Layout onOpenAskModal={() => setShowAskModal(true)}>
                <SearchPage />
              </Layout>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* --- MODAL SECTION CONVERTED TO TAILWIND --- */}
        {showAskModal && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAskModal(false)}
          >
            <div
              className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AskModal
                newQuestion={newQuestion}
                setNewQuestion={setNewQuestion}
                handlePostQuestion={handlePostQuestion}
              />
            </div>
          </div>
        )}
      </BookmarkProvider>
    </div>
  );
}


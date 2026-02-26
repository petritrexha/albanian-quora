import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load bookmarks when user logs in
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setBookmarkedQuestions([]);
      setBookmarkedAnswers([]); // ✅ FIXED
      return;
    }

    let mounted = true;

    const loadBookmarks = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/api/bookmarks/user/${userId}`);
        const bookmarks = res.data || [];

        const questions = await Promise.all(
          bookmarks.map(async (b) => {
            try {
              const qRes = await api.get(`/api/questions/${b.questionId}`);
              return { ...qRes.data, _bookmarkId: b.id };
            } catch {
              return {
                id: b.questionId,
                title: b.questionTitle || "",
                _bookmarkId: b.id,
              };
            }
          })
        );

        if (mounted) {
          setBookmarkedQuestions(questions);
        }
      } catch (error) {
        console.error("Failed to load bookmarks", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBookmarks();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, userId]);

  // ✅ FIXED VERSION (NO STALE STATE)
  const toggleQuestionBookmark = useCallback(
    async (question) => {
      if (!isAuthenticated) {
        alert("Please log in to save bookmarks.");
        return { success: false };
      }

      setBookmarkedQuestions((prev) => {
        const existing = prev.find((q) => q.id === question.id);

        if (existing) {
          // Remove locally (optimistic)
          api
            .delete(`/api/bookmarks/${existing._bookmarkId}`)
            .catch((err) =>
              console.error("Failed to remove bookmark", err)
            );

          return prev.filter((q) => q.id !== question.id);
        } else {
          // Add locally (optimistic)
          api
            .post(`/api/bookmarks`, {
              userId,
              questionId: question.id,
            })
            .then((res) => {
              const bookmark = res.data;

              setBookmarkedQuestions((current) =>
                current.map((q) =>
                  q.id === question.id
                    ? { ...q, _bookmarkId: bookmark.id }
                    : q
                )
              );
            })
            .catch((err) =>
              console.error("Failed to add bookmark", err)
            );

          return [{ ...question }, ...prev];
        }
      });

      return { success: true };
    },
    [isAuthenticated, userId]
  );

  const toggleAnswerBookmark = useCallback((answer, questionTitle) => {
    setBookmarkedAnswers((prev) => {
      const exists = prev.find((a) => a.id === answer.id);

      if (exists) {
        return prev.filter((a) => a.id !== answer.id);
      }

      return [
        ...prev,
        { ...answer, questionTitle, bookmarkedAt: Date.now() },
      ];
    });
  }, []);

  const isQuestionBookmarked = useCallback(
    (id) => bookmarkedQuestions.some((q) => q.id === id),
    [bookmarkedQuestions]
  );

  const isAnswerBookmarked = useCallback(
    (id) => bookmarkedAnswers.some((a) => a.id === id),
    [bookmarkedAnswers]
  );

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedQuestions,
        bookmarkedAnswers,
        toggleQuestionBookmark,
        toggleAnswerBookmark,
        isQuestionBookmarked,
        isAnswerBookmarked,
        loading,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarks must be used within BookmarkProvider");
  }

  return context;
}

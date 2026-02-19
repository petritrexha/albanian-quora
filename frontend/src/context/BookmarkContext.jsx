import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id || (Number(localStorage.getItem("userId")) || null);

    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
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
                            return { id: b.questionId, title: b.questionTitle || "", _bookmarkId: b.id };
                        }
                    })
                );

                if (!mounted) return;
                setBookmarkedQuestions(questions);
            } catch (e) {
                console.error("Failed to load bookmarks", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (userId) load();
        return () => (mounted = false);
    }, [userId]);
    const toggleQuestionBookmark = useCallback(async (question) => {
        if (!isAuthenticated) {
            // Prevent guests from triggering the API
            alert("Please log in to save bookmarks.");
            return { success: false, message: "Not authenticated" };
        }

        const prev = bookmarkedQuestions;
        const exists = prev.find((q) => q.id === question.id);

        if (exists) {
            // Optimistically remove
            setBookmarkedQuestions((p) => p.filter((q) => q.id !== question.id));
            try {
                if (exists._bookmarkId) {
                    await api.delete(`/api/bookmarks/${exists._bookmarkId}`);
                } else {
                    // Fallback: try to find the bookmark by user+question and delete via check endpoint
                    // nothing to do here as backend requires id to delete
                }
                return { success: true };
            } catch (e) {
                // Revert
                setBookmarkedQuestions(prev);
                console.error("Failed to delete bookmark", e);
                alert("Could not remove bookmark, try again.");
                return { success: false, message: e?.message };
            }
        } else {
            // Optimistically add
            setBookmarkedQuestions((p) => [{ ...question, _bookmarkId: null, optimistic: true }, ...p]);
            try {
                const res = await api.post(`/api/bookmarks`, { userId, questionId: question.id });
                const b = res.data;
                // replace optimistic entry with real data (and include bookmark id)
                setBookmarkedQuestions((p) =>
                    p.map((q) => (q.id === question.id ? { ...q, _bookmarkId: b.id, optimistic: false } : q))
                );
                return { success: true, bookmark: b };
            } catch (e) {
                // Revert optimistic add
                setBookmarkedQuestions(prev);
                console.error("Failed to create bookmark", e);
                alert("Could not save bookmark, try again.");
                return { success: false, message: e?.message };
            }
        }
    }, [bookmarkedQuestions, userId, isAuthenticated]);

    const toggleAnswerBookmark = useCallback((answer, questionTitle) => {
        setBookmarkedAnswers((prev) => {
            const exists = prev.find((a) => a.id === answer.id);
            if (exists) {
                return prev.filter((a) => a.id !== answer.id);
            }
            return [...prev, { ...answer, questionTitle, bookmarkedAt: Date.now() }];
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
        throw new Error("useBookmarks must be used within a BookmarkProvider");
    }
    return context;
}

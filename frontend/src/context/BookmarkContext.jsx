import { createContext, useContext, useState, useCallback } from "react";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]);

    const toggleQuestionBookmark = useCallback((question) => {
        setBookmarkedQuestions((prev) => {
            const exists = prev.find((q) => q.id === question.id);
            if (exists) {
                return prev.filter((q) => q.id !== question.id);
            }
            return [...prev, { ...question, bookmarkedAt: Date.now() }];
        });
    }, []);

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

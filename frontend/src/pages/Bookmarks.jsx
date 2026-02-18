import { useState } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import { FaBookmark, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";

const Bookmarks = () => {
    const {
        bookmarkedQuestions,
        bookmarkedAnswers,
        toggleQuestionBookmark,
        toggleAnswerBookmark,
    } = useBookmarks();

    const [activeTab, setActiveTab] = useState("questions");

    const totalCount = bookmarkedQuestions.length + bookmarkedAnswers.length;

    return (
        <div className="max-w-[900px] mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <FaBookmark className="text-primary text-xl" />
                <h1 className="text-2xl font-bold text-text-main">
                    Bookmark-et e mia
                </h1>
                <span className="bg-accent text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {totalCount} gjithsej
                </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 max-w-md">
                <button
                    onClick={() => setActiveTab("questions")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "questions"
                            ? "bg-white text-primary shadow-sm"
                            : "text-text-light hover:text-text-main"
                        }`}
                >
                    Pyetjet ({bookmarkedQuestions.length})
                </button>
                <button
                    onClick={() => setActiveTab("answers")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "answers"
                            ? "bg-white text-primary shadow-sm"
                            : "text-text-light hover:text-text-main"
                        }`}
                >
                    Përgjigjet ({bookmarkedAnswers.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === "questions" && (
                <div className="flex flex-col gap-4">
                    {bookmarkedQuestions.length === 0 ? (
                        <EmptyState
                            message="Nuk keni pyetje të ruajtura."
                            sub="Kliko ikonën e bookmark-it në ndonjë pyetje për ta ruajtur këtu."
                        />
                    ) : (
                        bookmarkedQuestions.map((question) => (
                            <BookmarkedQuestionCard
                                key={question.id}
                                question={question}
                                onRemove={() => toggleQuestionBookmark(question)}
                            />
                        ))
                    )}
                </div>
            )}

            {activeTab === "answers" && (
                <div className="flex flex-col gap-4">
                    {bookmarkedAnswers.length === 0 ? (
                        <EmptyState
                            message="Nuk keni përgjigje të ruajtura."
                            sub="Kliko ikonën e bookmark-it në ndonjë përgjigje për ta ruajtur këtu."
                        />
                    ) : (
                        bookmarkedAnswers.map((answer) => (
                            <BookmarkedAnswerCard
                                key={answer.id}
                                answer={answer}
                                onRemove={() => toggleAnswerBookmark(answer)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

/* ── Bookmarked Question Card ── */
const BookmarkedQuestionCard = ({ question, onRemove }) => {
    return (
        <div className="bg-white border border-border rounded-xl p-4 flex gap-4 transition-all duration-200 hover:shadow-md group">
            {/* Votes */}
            <div className="flex flex-col items-center min-w-[50px] gap-1.5 text-text-light">
                <FaArrowUp className="text-lg" />
                <span className="font-semibold text-text-main text-sm">
                    {question.votes}
                </span>
                <FaArrowDown className="text-lg" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/question/${question.id}`}
                    className="text-base font-semibold text-text-main hover:text-primary hover:underline transition-colors duration-200 block truncate"
                >
                    {question.title}
                </Link>
                <p className="text-sm text-text-light mt-1 line-clamp-2">
                    {question.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-text-light">
                    <span>{question.views} shikime</span>
                    <span>•</span>
                    <span>{question.answers} përgjigje</span>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="self-start p-2 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Hiq nga bookmark-et"
            >
                <FaTrash className="text-sm" />
            </button>
        </div>
    );
};

/* ── Bookmarked Answer Card ── */
const BookmarkedAnswerCard = ({ answer, onRemove }) => {
    return (
        <div className="bg-white border border-border rounded-xl p-4 flex gap-4 transition-all duration-200 hover:shadow-md group">
            {/* Votes */}
            <div className="flex flex-col items-center min-w-[50px] gap-1.5 text-text-light">
                <FaArrowUp className="text-lg" />
                <span className="font-semibold text-text-main text-sm">
                    {answer.votes}
                </span>
                <FaArrowDown className="text-lg" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {answer.questionTitle && (
                    <p className="text-xs text-text-light mb-1.5">
                        Nga pyetja:{" "}
                        <span className="font-medium text-primary">
                            {answer.questionTitle}
                        </span>
                    </p>
                )}

                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                        {answer.author[0]}
                    </div>
                    <span className="text-sm font-semibold text-text-main">
                        {answer.author}
                    </span>
                </div>

                <p className="text-sm text-text-light line-clamp-3">
                    {answer.content}
                </p>
            </div>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="self-start p-2 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Hiq nga bookmark-et"
            >
                <FaTrash className="text-sm" />
            </button>
        </div>
    );
};

/* ── Empty State ── */
const EmptyState = ({ message, sub }) => {
    return (
        <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                <FaBookmark className="text-2xl text-primary" />
            </div>
            <p className="text-lg font-semibold text-text-main mb-1">{message}</p>
            <p className="text-sm text-text-light">{sub}</p>
        </div>
    );
};

export default Bookmarks;

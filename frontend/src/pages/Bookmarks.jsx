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

  const qCount = bookmarkedQuestions?.length || 0;
  const aCount = bookmarkedAnswers?.length || 0;
  const totalCount = qCount + aCount;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* HEADER */}
      <div className="mb-8 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all duration-300
                      bg-white border border-slate-200
                      dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FaBookmark />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Bookmark-et e mia
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Pyetje dhe përgjigje të ruajtura
            </p>
          </div>
        </div>

        <div className="bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold px-3 py-1 rounded-full">
          {totalCount} gjithsej
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "questions"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Pyetjet ({qCount})
        </button>

        <button
          onClick={() => setActiveTab("answers")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "answers"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Përgjigjet ({aCount})
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-5">
        {activeTab === "questions" ? (
          qCount === 0 ? (
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
          )
        ) : aCount === 0 ? (
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
    </div>
  );
};

/* ───────── QUESTION CARD ───────── */

const BookmarkedQuestionCard = ({ question, onRemove }) => (
  <div className="rounded-2xl p-5 flex gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                  bg-white border border-slate-200
                  dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 dark:border-slate-700/50">

    {/* Votes */}
    <div className="flex flex-col items-center justify-center min-w-[60px] 
                    bg-slate-50 dark:bg-slate-700/50 rounded-xl py-3 text-slate-500 dark:text-slate-400">
      <FaArrowUp />
      <span className="font-semibold text-slate-800 dark:text-white">
        {question.votes}
      </span>
      <FaArrowDown />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <Link
        to={`/question/${question.id}`}
        className="text-base font-semibold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        {question.title}
      </Link>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
        {question.content}
      </p>

      <div className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex gap-2">
        <span>{question.views} shikime</span>
        <span>•</span>
        <span>{question.answers} përgjigje</span>
      </div>
    </div>

    {/* Remove */}
    <button
      onClick={(e) => {
        e.preventDefault();
        onRemove();
      }}
      className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition"
    >
      <FaTrash />
    </button>
  </div>
);

/* ───────── ANSWER CARD ───────── */

const BookmarkedAnswerCard = ({ answer, onRemove }) => (
  <div className="rounded-2xl p-5 flex gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                  bg-white border border-slate-200
                  dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 dark:border-slate-700/50">

    {/* Votes */}
    <div className="flex flex-col items-center justify-center min-w-[60px] 
                    bg-slate-50 dark:bg-slate-700/50 rounded-xl py-3 text-slate-500 dark:text-slate-400">
      <FaArrowUp />
      <span className="font-semibold text-slate-800 dark:text-white">
        {answer.votes}
      </span>
      <FaArrowDown />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      {answer.questionTitle && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
          Nga pyetja:{" "}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {answer.questionTitle}
          </span>
        </p>
      )}

      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
        {answer.content}
      </p>
    </div>

    {/* Remove */}
    <button
      onClick={(e) => {
        e.preventDefault();
        onRemove();
      }}
      className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition"
    >
      <FaTrash />
    </button>
  </div>
);

/* ───────── EMPTY STATE ───────── */

const EmptyState = ({ message, sub }) => (
  <div className="py-16 text-center rounded-2xl transition-all
                  border border-dashed border-slate-200 bg-white/50
                  dark:border-slate-700 dark:bg-slate-800/50">
    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
      <FaBookmark />
    </div>
    <p className="font-semibold text-slate-700 dark:text-slate-200">{message}</p>
    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{sub}</p>
  </div>
);

export default Bookmarks;
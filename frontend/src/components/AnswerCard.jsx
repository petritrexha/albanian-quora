import { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaStar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import ReportModal from "./ReportModal";

const AnswerCard = ({ answer, onUpvote, onDownvote, questionTitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAnswerBookmarked, toggleAnswerBookmark } = useBookmarks();
  const [showReport, setShowReport] = useState(false);

  const bookmarked = isAnswerBookmarked(answer.id);
  const authorName = answer.authorName || "Unknown";
  const avatarLetter = authorName.charAt(0).toUpperCase();

  // 🔥 Highlight logic (vetëm stil)
  const isTopAnswer = answer.votes >= 5; 

  return (
    <div
      className={`relative flex gap-5 p-6 rounded-2xl border transition-all duration-300
        ${
          isTopAnswer
            ? "bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-blue-400 shadow-md"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1"
        }`}
    >

      {/* ⭐ Top badge */}
      {isTopAnswer && (
        <div className="absolute top-3 right-3 text-yellow-500 text-xs flex items-center gap-1 font-semibold">
          <FaStar />
          Top
        </div>
      )}

      {/* Votes */}
      <div className="flex flex-col items-center justify-center gap-2 
                      bg-slate-50 dark:bg-slate-800 
                      rounded-xl px-3 py-4 min-w-[60px]
                      text-slate-500 dark:text-slate-400">

        <button
          className="text-lg hover:text-green-600 transition transform hover:scale-110"
          onClick={() => onUpvote(answer.id)}
        >
          <FaArrowUp />
        </button>

        <span
          className={`font-bold ${
            isTopAnswer
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-800 dark:text-white"
          }`}
        >
          {answer.votes}
        </span>

        <button
          className="text-lg hover:text-red-600 transition transform hover:scale-110"
          onClick={() => onDownvote(answer.id)}
        >
          <FaArrowDown />
        </button>
      </div>

      {/* Main */}
      <div className="flex-1">

        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center
              ${
                isTopAnswer
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                  : "bg-gradient-to-br from-slate-500 to-slate-700"
              }
              text-white font-semibold shadow-sm`}
          >
            {avatarLetter}
          </div>

          <span className="font-semibold text-slate-800 dark:text-white text-sm">
            {authorName}
          </span>
        </div>

        {/* Content */}
        <p
          className={`leading-relaxed text-sm ${
            isTopAnswer
              ? "text-slate-800 dark:text-slate-200"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {answer.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center">

        <button
          onClick={() => {
            if (!user) {
              navigate("/login");
              return;
            }
            toggleAnswerBookmark(answer, questionTitle);
          }}
          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
            bookmarked
              ? "text-blue-600"
              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
          }`}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>

        <button
          onClick={() => {
            if (!user) {
              navigate("/login");
              return;
            }
            setShowReport(true);
          }}
          className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition transform hover:scale-110"
        >
          <FaFlag />
        </button>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetType="Answer"
        targetId={answer.id}
      />
    </div>
  );
};

export default AnswerCard;
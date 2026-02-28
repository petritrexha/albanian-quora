import { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaStar
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import ReportModal from "./ReportModal";

const QuestionCard = ({ question, onUpvote, onDownvote }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isQuestionBookmarked, toggleQuestionBookmark } = useBookmarks();
  const [showReport, setShowReport] = useState(false);

  const bookmarked = isQuestionBookmarked(question.id);

  // 🔥 Highlight nëse ka shumë vota
  const isHot = question.votes >= 10;

  return (
    <div
      className={`relative flex gap-6 p-6 rounded-2xl border transition-all duration-300 cursor-pointer
        ${
          isHot
            ? "bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 border-orange-300 shadow-md"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1"
        }`}
      onClick={() =>
        navigate(`/question/${question.id}`, { state: { question } })
      }
    >

      {/* 🔥 HOT Badge */}
      {isHot && (
        <div className="absolute top-4 right-4 text-xs font-semibold text-orange-600 flex items-center gap-1">
          <FaStar />
          Hot
        </div>
      )}

      {/* Votes */}
      <div className="flex flex-col items-center justify-center gap-2 
                      bg-slate-50 dark:bg-slate-800 
                      rounded-xl px-3 py-4 min-w-[60px]
                      text-slate-500 dark:text-slate-400">

        <button
          className="text-lg hover:text-green-600 transition transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onUpvote?.(question.id);
          }}
        >
          <FaArrowUp />
        </button>

        <span
          className={`font-bold ${
            isHot
              ? "text-orange-600"
              : "text-slate-800 dark:text-white"
          }`}
        >
          {question.votes}
        </span>

        <button
          className="text-lg hover:text-red-600 transition transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onDownvote?.(question.id);
          }}
        >
          <FaArrowDown />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">

        <h3 className="text-lg font-semibold mb-2 
                       text-slate-800 dark:text-white
                       transition group-hover:text-blue-600">
          {question.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
          {question.content || question.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{question.views} shikime</span>
          <span>•</span>
          <span>{question.answerCount || 0} përgjigje</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mt-2">
          {/* Tags */}
          {question.tags && question.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tagName) => (
                <Link
                  key={tagName}
                  to={`/?tag=${encodeURIComponent(tagName)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-2 py-0.5 rounded-full transition-colors
                             bg-blue-50 text-blue-600 hover:bg-blue-100
                             dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
                >
                  {tagName}
                </Link>
              ))}
            </div>
          ) : (
            <div />
          )}
          
          {/* Username */}
          {question.username && (
            <div className="flex items-center gap-2 text-xs whitespace-nowrap">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-800
                              text-white flex items-center justify-center text-[10px] font-semibold">
                {question.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-300">{question.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center">

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              navigate("/login");
              return;
            }
            toggleQuestionBookmark(question);
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
          onClick={(e) => {
            e.stopPropagation();
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
        targetType="Question"
        targetId={question.id}
      />
    </div>
  );
};

export default QuestionCard;
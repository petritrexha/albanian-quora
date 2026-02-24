import { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import ReportModal from "./ReportModal";

const QuestionCard = ({ question, onUpvote, onDownvote }) => {
  const navigate = useNavigate();
  const { isQuestionBookmarked, toggleQuestionBookmark } = useBookmarks();
  const [showReport, setShowReport] = useState(false);

  const bookmarked = isQuestionBookmarked(question.id) || Boolean(question.isBookmarked);

  return (
    <div
      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-4 flex gap-[18px] transition-shadow duration-200 ease-in hover:shadow-[0_8px_22px_rgba(0,0,0,0.06)] cursor-pointer group"
      onClick={() => navigate(`/question/${question.id}`, { state: { question } })}
    >
      {/* Votes Section */}
      <div className="flex flex-col items-center min-w-[50px] gap-1.5 text-[var(--text-light)]">
        <button
          className="bg-transparent border-none cursor-pointer text-[18px] text-[var(--text-light)] transition-colors duration-150 hover:text-[#16a34a]"
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(question.id);
          }}
        >
          <FaArrowUp />
        </button>

        <span className="font-semibold text-[var(--text-main)] text-[15px]">
          {question.votes}
        </span>

        <button
          className="bg-transparent border-none cursor-pointer text-[18px] text-[var(--text-light)] transition-colors duration-150 hover:text-[#dc2626]"
          onClick={(e) => {
            e.stopPropagation();
            onDownvote(question.id);
          }}
        >
          <FaArrowDown />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] mb-1.5 leading-[1.3] font-bold group-hover:underline">
          {question.title}
        </h3>
        <p className="text-[14px] text-[var(--text-light)] mb-2.5 leading-[1.4] line-clamp-3">
          {question.content || question.description}
        </p>

        <div className="flex items-center gap-2 text-[13px] text-[var(--text-light)]">
          <span>{question.views} shikime</span>
          <span>•</span>
          <span>{question.answerCount || 0} përgjigje</span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleQuestionBookmark(question);
          }}
          className={`bg-transparent border-none cursor-pointer p-1.5 rounded-lg transition-all duration-150 
            ${bookmarked 
              ? "text-[var(--primary)]" 
              : "text-[var(--text-light)] hover:bg-[var(--accent)] hover:text-[var(--primary)]"
            }`}
          title={bookmarked ? "Hiq nga bookmark" : "Shto në bookmark"}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowReport(true);
          }}
          className="bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-[var(--text-light)] transition-all duration-150 hover:bg-[var(--accent)] hover:text-[var(--primary)]"
          title="Raporto pyetjen"
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



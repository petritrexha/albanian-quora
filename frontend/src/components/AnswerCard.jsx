import { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
} from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import ReportModal from "./ReportModal";

const AnswerCard = ({ answer, onUpvote, onDownvote, questionTitle }) => {
  const { isAnswerBookmarked, toggleAnswerBookmark } = useBookmarks();
  const [showReport, setShowReport] = useState(false);

  const bookmarked = isAnswerBookmarked(answer.id);
  const authorName = answer.authorName || "Unknown";
  const avatarLetter = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-[#e4e6eb]">
      {/* Votes Column */}
      <div className="flex flex-col items-center gap-[6px] text-[var(--text-light)]">
        <button
          className="bg-transparent border-none cursor-pointer text-base text-[var(--text-light)] hover:text-[#16a34a] transition-colors"
          onClick={() => onUpvote(answer.id)}
        >
          <FaArrowUp />
        </button>

        <span className="font-semibold text-[var(--text-main)]">
          {answer.votes}
        </span>

        <button
          className="bg-transparent border-none cursor-pointer text-base text-[var(--text-light)] hover:text-[#dc2626] transition-colors"
          onClick={() => onDownvote(answer.id)}
        >
          <FaArrowDown />
        </button>
      </div>

      {/* Main Content Column */}
      <div className="flex-1">
        <div className="flex items-center gap-[10px] mb-2 font-semibold">
          <div className="w-8 h-8 bg-[#e5e7eb] rounded-full flex items-center justify-center">
            {avatarLetter}
          </div>
          <span>{authorName}</span>
        </div>

        <p className="leading-relaxed">{answer.content}</p>
      </div>

      {/* Actions Column */}
      <div className="flex flex-col gap-2">
        <button
          className={`p-[6px] rounded-md text-[15px] transition-all cursor-pointer bg-transparent border-none 
            ${bookmarked 
              ? "text-[var(--primary)]" 
              : "text-[var(--text-light)] hover:bg-[var(--accent)] hover:text-[var(--primary)]"
            }`}
          onClick={() => toggleAnswerBookmark(answer, questionTitle)}
          title={bookmarked ? "Hiq nga bookmark-et" : "Shto në bookmark-et"}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>

        <button
          className="p-[6px] rounded-md text-[15px] text-[var(--text-light)] transition-all cursor-pointer bg-transparent border-none hover:bg-[#fee2e2] hover:text-[#dc2626]"
          onClick={() => setShowReport(true)}
          title="Raporto përgjigjen"
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
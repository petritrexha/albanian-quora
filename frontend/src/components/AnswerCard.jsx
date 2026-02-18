import { useState } from "react";
import { FaArrowUp, FaArrowDown, FaBookmark, FaRegBookmark, FaFlag } from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import ReportModal from "./ReportModal";
import "../styles/answerCard.css";

const AnswerCard = ({ answer, onUpvote, onDownvote, questionTitle }) => {
  const { isAnswerBookmarked, toggleAnswerBookmark } = useBookmarks();
  const bookmarked = isAnswerBookmarked(answer.id);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="answer-card">
      <div className="answer-votes">
        <button
          className="vote-btn up"
          onClick={() => onUpvote(answer.id)}
        >
          <FaArrowUp />
        </button>

        <span className="vote-count">{answer.votes}</span>

        <button
          className="vote-btn down"
          onClick={() => onDownvote(answer.id)}
        >
          <FaArrowDown />
        </button>
      </div>

      <div className="answer-content">
        <div className="answer-author">
          <div className="avatar">{answer.author[0]}</div>
          <span>{answer.author}</span>
        </div>

        <p>{answer.content}</p>
      </div>

      {/* Bookmark Button */}
      <button
        onClick={() => toggleAnswerBookmark(answer, questionTitle)}
        className={`ml-auto self-start p-2 rounded-lg transition-all duration-200 ${bookmarked
          ? "text-primary bg-accent"
          : "text-text-light hover:text-primary hover:bg-accent"
          }`}
        title={bookmarked ? "Hiq nga bookmark-et" : "Shto në bookmark-et"}
      >
        {bookmarked ? (
          <FaBookmark className="text-base" />
        ) : (
          <FaRegBookmark className="text-base" />
        )}
      </button>

      {/* Report Button */}
      <button
        onClick={() => setShowReport(true)}
        className="self-start p-2 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        title="Raporto përgjigjen"
      >
        <FaFlag className="text-sm" />
      </button>

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
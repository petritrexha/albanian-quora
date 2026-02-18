import { useState } from "react";
import { FaArrowUp, FaArrowDown, FaBookmark, FaRegBookmark, FaFlag } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import ReportModal from "./ReportModal";
import "../styles/questionCard.css";

const QuestionCard = ({ question, onUpvote, onDownvote }) => {
  const { isQuestionBookmarked, toggleQuestionBookmark } = useBookmarks();
  const bookmarked = isQuestionBookmarked(question.id);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="question-card">
      <div className="question-votes">
        <button className="vote-btn up" onClick={() => onUpvote(question.id)}>
          <FaArrowUp />
        </button>
        <span className="vote-count">{question.votes}</span>
        <button className="vote-btn down" onClick={() => onDownvote(question.id)}>
          <FaArrowDown />
        </button>
      </div>

      <div className="question-content">
        <Link to={`/question/${question.id}`} className="question-link">
          <h3>{question.title}</h3>
          <p>{question.description}</p>
        </Link>

        <div className="question-meta">
          <span>{question.views} shikime</span>
          <span>•</span>
          <span>{question.answers} përgjigje</span>
        </div>
      </div>

      {/* Bookmark Button */}
      <button
        onClick={() => toggleQuestionBookmark(question)}
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
        title="Raporto pyetjen"
      >
        <FaFlag className="text-sm" />
      </button>

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

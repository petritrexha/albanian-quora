import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../styles/answerCard.css";

const AnswerCard = ({ answer, onUpvote, onDownvote }) => {
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
    </div>
  );
};

export default AnswerCard;
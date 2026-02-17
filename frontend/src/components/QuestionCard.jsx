import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/questionCard.css";

const QuestionCard = ( { question, onUpvote, onDownvote }) => {
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
    </div>
  );
};

export default QuestionCard;


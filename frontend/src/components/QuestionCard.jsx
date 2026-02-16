import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/questionCard.css";

const QuestionCard = () => {
  return (
    <div className="question-card">
      <div className="question-votes">
        <button className="vote-btn up">
          <FaArrowUp />
        </button>
        <span className="vote-count">12</span>
        <button className="vote-btn down">
          <FaArrowDown />
        </button>
      </div>

      <div className="question-content">
        <Link to="/question/1" className="question-link">
          <h3>Si funksionon React dhe Virtual DOM?</h3>
          <p>
            Dikush mund të shpjegojë konceptin e Virtual DOM dhe pse React është kaq i shpejtë?
          </p>
        </Link>

        <div className="question-meta">
          <span>45 shikime</span>
          <span>•</span>
          <span>12 përgjigje</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;


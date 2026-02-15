import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../styles/questionCard.css";

const QuestionCard = () => {
  return (
    <div className="question-card">
      {/* LEFT – VOTES */}
      <div className="question-votes">
        <button className="vote-btn up">
          <FaArrowUp />
        </button>
        <span className="vote-count">12</span>
        <button className="vote-btn down">
          <FaArrowDown />
        </button>
      </div>

      {/* RIGHT – CONTENT */}
      <div className="question-content">
        <h3>Si funksionon React dhe Virtual DOM?</h3>
        <p>
          Dikush mund të shpjegojë konceptin e Virtual DOM dhe pse React është kaq i shpejtë?
        </p>

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


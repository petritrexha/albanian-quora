import React from "react";
import "../styles/questionDetails.css";

const QuestionDetails = () => {
  return (
    <div className="question-details-page">
      <div className="question-main">

        <div className="question-header">
          <h1>Si funksionon React dhe Virtual DOM?</h1>

          <p className="question-description">
            Dikush mund të shpjegojë konceptin e Virtual DOM dhe pse React është kaq i shpejtë?
          </p>

          <div className="question-meta">
            <span>45 shikime</span>
            <span>•</span>
            <span>12 përgjigje</span>
            <span>•</span>
            <span>postuar 2 ditë më parë</span>
          </div>
        </div>

        
        <div className="answers-section">
          <h2>Përgjigje</h2>

          <div className="answer-card">
            <div className="answer-author">
              <div className="avatar">B</div>
              <span>Bajram</span>
            </div>

            <p>
              React përdor Virtual DOM për të minimizuar ndryshimet direkte në DOM-in real,
              duke e bërë përditësimin më të shpejtë.
            </p>
          </div>

          <div className="answer-card">
            <div className="answer-author">
              <div className="avatar">A</div>
              <span>Ardit</span>
            </div>

            <p>
              Virtual DOM është një përfaqësim në memorie i DOM-it real dhe React krahason
              ndryshimet përpara se të bëjë update.
            </p>
          </div>
        </div>

        <div className="add-answer">
          <h3>Shto një përgjigje</h3>
          <textarea placeholder="Shkruaj përgjigjen tënde..." />
          <button>Posto përgjigjen</button>
        </div>

      </div>
    </div>
  );
};

export default QuestionDetails;
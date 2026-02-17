import React from "react";
import "../styles/askBox.css";

const AskBox = ({ newQuestion, setNewQuestion, handlePostQuestion }) => {
  return (
    <div className="ask-box">
      <div className="ask-top">
        <div className="avatar">B</div>

        <input
          type="text"
          placeholder="Çfarë dëshiron të pyesësh ose të ndash?"
          className="ask-input"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
      </div>

      <div className="ask-actions">
        <button onClick={handlePostQuestion}>Posto</button>
      </div>
    </div>
  );
};

export default AskBox;
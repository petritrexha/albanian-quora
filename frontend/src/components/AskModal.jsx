import React from "react";
import "../styles/askModal.css";

const AskModal = ({ newQuestion, setNewQuestion, handlePostQuestion }) => {
  return (
    <div className="ask-modal">
      <h2>Posto një pyetje</h2>

      <textarea
        placeholder="Shkruaj pyetjen tënde këtu..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />

      <button onClick={handlePostQuestion}>Posto pyetjen</button>
    </div>
  );
};

export default AskModal;
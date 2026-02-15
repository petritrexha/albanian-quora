import React from "react";
import "../styles/askBox.css";

const AskBox = () => {
  return (
    <div className="ask-box">
      <div className="ask-top">
        <div className="avatar">B</div>

        <input
          type="text"
          placeholder="Çfarë dëshiron të pyesësh ose të ndash?"
          className="ask-input"
        />
      </div>

      <div className="ask-actions">
        <button>Pyes</button>
        <button>Përgjigju</button>
        <button>Posto</button>
      </div>
    </div>
  );
};

export default AskBox;
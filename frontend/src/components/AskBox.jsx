import React from "react";
import { useAuth } from "../context/AuthContext";

const AskBox = ({ newQuestion, setNewQuestion, handlePostQuestion }) => {
  const { user } = useAuth();

  const getAvatarLetter = () => {
    if (!user) return "B";
    const displayName = user.name || user.username || user.email || "B";
    return displayName.charAt(0).toUpperCase();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePostQuestion();
    }
  };

  return (
    <div className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-4">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
          {getAvatarLetter()}
        </div>
        
        {/* Input */}
        <input
          type="text"
          placeholder="Çfarë dëshiron të pyesësh ose të ndash?"
          className="flex-1 px-[14px] py-2.5 rounded-[20px] border border-[var(--border)] bg-[var(--bg-light)] text-sm transition-colors duration-150 focus:outline-none focus:border-[var(--primary)]"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-3 pl-[52px]">
        <button 
          onClick={handlePostQuestion}
          className="bg-transparent text-[var(--text-light)] text-sm px-2.5 py-1.5 rounded-md transition-all duration-150 hover:bg-[var(--accent)] hover:text-[var(--primary)]"
        >
          Posto
        </button>
      </div>
    </div>
  );
};

export default AskBox;
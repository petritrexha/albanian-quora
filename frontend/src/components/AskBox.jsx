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

  const isDisabled = !newQuestion.trim();

  return (
    <div className="w-full bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    rounded-2xl p-5
                    transition-all duration-300 hover:shadow-md">

      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full
                        bg-gradient-to-br from-blue-600 to-purple-600
                        text-white flex items-center justify-center
                        font-semibold shadow-sm">
          {getAvatarLetter()}
        </div>

        {/* Input Section */}
        <div className="flex-1">

          <input
            type="text"
            placeholder="Çfarë dëshiron të pyesësh ose të ndash?"
            className="w-full px-4 py-3 rounded-xl
                       border border-slate-200 dark:border-slate-700
                       bg-slate-50 dark:bg-slate-800
                       text-sm text-slate-800 dark:text-slate-200
                       placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-all duration-200"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          {/* Actions */}
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePostQuestion}
              disabled={isDisabled}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  isDisabled
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
                }`}
            >
              Posto
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AskBox;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AskBox = ({ onOpenModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getAvatarLetter = () => {
    if (!user) return "B";
    const displayName = user.name || user.username || user.email || "B";
    return displayName.charAt(0).toUpperCase();
  };

  const handleInputClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    onOpenModal();
  };

  return (
    <div 
      onClick={handleInputClick}
      className="w-full bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    rounded-2xl p-5
                    transition-all duration-300 hover:shadow-md cursor-pointer">

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
          <div
            className="w-full px-4 py-3 rounded-xl
                       border border-slate-200 dark:border-slate-700
                       bg-slate-50 dark:bg-slate-800
                       text-sm text-slate-400
                       transition-all duration-200"
          >
            Çfarë dëshiron të pyesësh ose të ndash?
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskBox;
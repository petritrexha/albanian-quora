import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaComments,
  FaHome,
  FaQuestionCircle,
  FaBookmark,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ onOpenAskModal }) => {
  const { bookmarkedQuestions, bookmarkedAnswers } = useBookmarks();
  const { isAuthenticated, logout, user } = useAuth();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const totalBookmarks =
    bookmarkedQuestions.length + bookmarkedAnswers.length;

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="sticky top-0 z-[1000] w-full bg-white border-bottom border-b border-[var(--border)]">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-0 py-4 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <FaComments className="text-[22px] text-[var(--primary)]" />
          <span className="text-[22px] font-bold bg-gradient-to-r from-[var(--primary)] to-[#7c3aed] bg-clip-text text-transparent">
            AlbanianQuora
          </span>
        </Link>

        {/* Search - Hidden on small mobile, visible on tablet+ */}
        <div className="hidden md:flex flex-1 justify-center max-w-[380px]">
          <input
            className="w-full px-[18px] py-2.5 rounded-xl border border-[var(--border)] bg-[#f9fafb] text-sm focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all"
            placeholder="Kërko pyetje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-[18px]">
          <Link to="/" className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)] no-underline">
            <FaHome className="text-[18px]" />
            <span className="hidden lg:inline">Ballina</span>
          </Link>

          <button
            className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)] bg-transparent border-none cursor-pointer"
            onClick={onOpenAskModal}
          >
            <FaQuestionCircle className="text-[18px]" />
            <span className="hidden lg:inline">Pyet</span>
          </button>

          <Link to="/saved" className="relative flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)] no-underline">
            <FaBookmark className="text-[18px]" />
            <span className="hidden lg:inline">Bookmark-et</span>
            {totalBookmarks > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[var(--primary)] text-white text-[11px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalBookmarks}
              </span>
            )}
          </Link>

          <NotificationDropdown />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 lg:gap-[18px]">
              <span className="hidden md:inline text-[12px] font-medium text-[var(--text-main)]">
                {user?.name}
              </span>
              <button
                className="text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 bg-transparent border-none cursor-pointer"
                onClick={logout}
              >
                Dil
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)] no-underline">
                <FaSignInAlt className="text-[18px]" />
                Kyçu
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2.5 rounded-[10px] font-medium transition-all duration-200 hover:bg-[var(--primary-light)] no-underline shrink-0"
              >
                <FaUserPlus className="text-[16px]" />
                <span className="hidden sm:inline">Regjistrohu</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaComments,
  FaHome,
  FaBookmark,
  FaShieldAlt,
  FaUserCircle,
  FaSun,
  FaMoon
} from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ onOpenAskModal }) => {
  const { bookmarkedQuestions, bookmarkedAnswers } = useBookmarks();
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const totalBookmarks = bookmarkedQuestions.length + bookmarkedAnswers.length;

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const isAdmin =
    user?.role === 1 ||
    user?.role === "Admin" ||
    user?.role?.toString().toLowerCase() === "admin";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 no-underline group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md group-hover:scale-105 transition">
            <FaComments />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white">
            AlbanianQuora
          </span>
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 justify-center max-w-md">
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-slate-50 dark:bg-slate-800
                       text-sm text-slate-800 dark:text-slate-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Kërko pyetje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* Home */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaHome />
          </Link>

          {/* DARK MODE TOGGLE WITH ANIMATION */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full
                       bg-slate-100 dark:bg-slate-800
                       hover:scale-110 active:scale-95
                       transition-all duration-300"
          >
            <div
              className={`absolute transition-all duration-500 ${
                isDarkMode
                  ? "rotate-0 opacity-100 scale-100"
                  : "rotate-180 opacity-0 scale-50"
              }`}
            >
              <FaSun className="text-yellow-400 text-lg" />
            </div>

            <div
              className={`absolute transition-all duration-500 ${
                isDarkMode
                  ? "-rotate-180 opacity-0 scale-50"
                  : "rotate-0 opacity-100 scale-100"
              }`}
            >
              <FaMoon className="text-slate-600 dark:text-slate-300 text-lg" />
            </div>
          </button>

          {/* BOOKMARKS */}
          <Link
            to="/saved"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaBookmark />
            {totalBookmarks > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px]
                               w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {totalBookmarks}
              </span>
            )}
          </Link>

          <NotificationDropdown />

          {/* AUTH */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200 dark:border-slate-700">

              {isAdmin && (
                <Link
                  to="/admin"
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  <FaShieldAlt />
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium
                           text-slate-700 dark:text-slate-200
                           hover:text-blue-600 transition"
              >
                <FaUserCircle className="text-lg" />
                <span className="hidden md:inline">{user?.username}</span>
              </Link>

              <button
                onClick={logout}
                className="text-sm font-medium text-red-500 hover:underline"
              >
                Dil
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
              >
                Kyçu
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold
                           hover:bg-blue-700 shadow-sm hover:shadow-md transition"
              >
                Regjistrohu
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
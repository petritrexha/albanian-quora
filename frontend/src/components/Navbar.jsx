import { Link } from "react-router-dom";
import "../styles/navbar.css";
import {
  FaComments,
  FaHome,
  FaQuestionCircle,
  FaBookmark,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onOpenAskModal }) => {
  const { bookmarkedQuestions, bookmarkedAnswers } = useBookmarks();
  const totalBookmarks = bookmarkedQuestions.length + bookmarkedAnswers.length;
  const { isAuthenticated, user, logout } = useAuth();

  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="logo">
          <FaComments className="logo-icon" />
          <span className="logo-text">AlbanianQuora<span className="dot">.</span>
          </span>
        </div>

        <div className="nav-center">
          <input
            className="search"
            placeholder="Kërko pyetje..."
          />
        </div>


        <div className="nav-right">

          <Link to="/" className="nav-item">
            <FaHome className="nav-icon home-icon" />
            Ballina
          </Link>

          <a href="#" className="nav-item" onClick={(e) => {
            e.preventDefault();
            onOpenAskModal();
          }}
          >
            <FaQuestionCircle className="nav-icon ask-icon" /> Pyet</a>

          <Link to="/saved" className="nav-item" style={{ position: "relative" }}>
            <FaBookmark className="nav-icon" style={{ color: "#2563EB" }} />
            Bookmark-et
            {totalBookmarks > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full absolute -top-1 -right-1">
                {totalBookmarks}
              </span>
            )}
          </Link>

          <NotificationDropdown />

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-item">
                <FaUserCircle className="nav-icon" /> {user?.username || "Profili"}
              </Link>
              <button
                onClick={logout}
                className="nav-item"
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                <FaSignOutAlt className="nav-icon" /> Dil
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                <FaSignInAlt className="nav-icon login-icon" /> Kyçu
              </Link>

              <Link to="/register" className="btn-primary nav-item-btn">
                <FaUserPlus className="nav-icon-btn" />
                Regjistrohu
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

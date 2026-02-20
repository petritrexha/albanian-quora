import { Link } from "react-router-dom";
import "../styles/navbar.css";
import {
  FaComments,
  FaHome,
  FaQuestionCircle,
  FaBookmark,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ onOpenAskModal }) => {
  const { bookmarkedQuestions, bookmarkedAnswers } = useBookmarks();
  const totalBookmarks = bookmarkedQuestions.length + bookmarkedAnswers.length;

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

          <Link to="/login" className="nav-item">
            <FaSignInAlt className="nav-icon login-icon" /> Kyçu
          </Link>

          <Link to="/register" className="btn-primary nav-item-btn">
            <FaUserPlus className="nav-icon-btn" />
            Regjistrohu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

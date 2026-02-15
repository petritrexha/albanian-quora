import "../styles/navbar.css";
import {
  FaComments,
  FaHome,
  FaQuestionCircle,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* INNER CONTAINER (SYNC WIDTH) */}
      <div className="navbar-container">

        {/* LEFT - LOGO */}
        <div className="logo">
          <FaComments className="logo-icon" />
          <span className="logo-text">
            AlbanianQuora<span className="dot">.</span>
          </span>
        </div>

        {/* CENTER - SEARCH */}
        <div className="nav-center">
          <input
            className="search"
            placeholder="Kërko pyetje..."
          />
        </div>

        {/* RIGHT - NAV ITEMS */}
        <div className="nav-right">

          <a href="#" className="nav-item">
            <FaHome className="nav-icon home-icon" />
            Ballina
          </a>

          <a href="#" className="nav-item">
            <FaQuestionCircle className="nav-icon ask-icon" />
            Pyet
          </a>

          <a href="#" className="nav-item">
            <FaSignInAlt className="nav-icon login-icon" />
            Kyçu
          </a>

          <button className="btn-primary nav-item-btn">
            <FaUserPlus className="nav-icon-btn" />
            Regjistrohu
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;





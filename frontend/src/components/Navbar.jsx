import { Link } from "react-router-dom";
import "../styles/navbar.css";
import {
  FaComments,
  FaHome,
  FaQuestionCircle,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";

const Navbar = ({ onOpenAskModal }) => {
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


          <a href="#" className="nav-item">
            <FaSignInAlt className="nav-icon login-icon" />Kyçu</a>

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





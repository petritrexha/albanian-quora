import React from "react";
import {
  FaCode,
  FaMicrochip,
  FaFlask,
  FaGraduationCap,
  FaBriefcase
} from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Kategoritë</h3>

      <ul className="category-list">
        <li className="category-item">
          <FaCode className="category-icon" />
          Programim
        </li>

        <li className="category-item">
          <FaMicrochip className="category-icon" />
          Teknologji
        </li>

        <li className="category-item">
          <FaFlask className="category-icon" />
          Shkencë
        </li>

        <li className="category-item">
          <FaGraduationCap className="category-icon" />
          Arsim
        </li>

        <li className="category-item">
          <FaBriefcase className="category-icon" />
          Biznes
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;



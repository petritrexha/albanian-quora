import { Link } from "react-router-dom";
import {
  FaCode,
  FaMicrochip,
  FaFlask,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";

const categories = [
  { id: 1, name: "Programim", icon: <FaCode /> },
  { id: 2, name: "Teknologji", icon: <FaMicrochip /> },
  { id: 3, name: "Shkencë", icon: <FaFlask /> },
  { id: 4, name: "Arsim", icon: <FaGraduationCap /> },
  { id: 5, name: "Biznes", icon: <FaBriefcase /> },
];

const Sidebar = () => {
  return (
    <aside className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 sticky top-[90px] h-fit">
      <h3 className="mb-4 text-base font-semibold text-[var(--text-main)]">
        Kategoritë
      </h3>

      <ul className="list-none flex flex-col gap-1.5 p-0 m-0">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/category/${cat.id}`}
            className="no-underline group"
          >
            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-[var(--text-light)] transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)]">
              <span className="text-base text-[var(--primary)] transition-colors">
                {cat.icon}
              </span>
              {cat.name}
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;



import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <aside className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 sticky top-[90px] h-fit shadow-sm transition-colors duration-300">
      
      <h3 className="mb-5 text-sm uppercase tracking-wider font-bold text-[var(--text-light)]">
        Kategoritë
      </h3>

      <ul className="flex flex-col gap-2 p-0 m-0">
        {categories.map((cat) => {
          const isActive = location.pathname === `/category/${cat.id}`;

          return (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.id}`}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline
                ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--primary)] shadow-sm"
                    : "text-[var(--text-light)] hover:bg-[var(--accent)] hover:text-[var(--primary)]"
                }`}
              >
                <span
                  className={`text-base transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                >
                  {cat.icon}
                </span>

                <span className="flex-1">{cat.name}</span>

                {isActive && (
                  <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
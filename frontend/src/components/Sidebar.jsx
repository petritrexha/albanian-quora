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
    <aside className="rounded-2xl p-5 sticky top-[90px] h-fit shadow-sm transition-all duration-300
                      bg-white border border-slate-200
                      dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-800/90 dark:border-slate-700/50 dark:shadow-lg dark:shadow-slate-900/20">
      
      <h3 className="mb-5 text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
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
                    ? "bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-500/20 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-blue-400"
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
                  <span className="w-1.5 h-6 bg-blue-500 dark:bg-blue-400 rounded-full" />
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
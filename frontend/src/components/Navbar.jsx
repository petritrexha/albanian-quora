import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaComments,
  FaHome,
  FaQuestionCircle,
  FaBookmark,
  FaShieldAlt,
  FaUserCircle,
  FaSun,
  FaMoon
} from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
=======
import { useTheme } from "../context/ThemeContext";
>>>>>>> origin/develop
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

  const isAdmin = user?.role === 1 || user?.role === "Admin" || user?.role?.toString().toLowerCase() === "admin";

  return (
    <nav className="sticky top-0 z-[1000] w-full bg-[var(--card-bg)] border-b border-[var(--border)] shadow-sm transition-colors duration-300">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-0 py-4 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <FaComments className="text-[22px] text-[var(--primary)]" />
          <span className="text-[22px] font-bold bg-gradient-to-r from-[var(--primary)] to-[#7c3aed] bg-clip-text text-transparent">
            AlbanianQuora
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center max-w-[380px]">
          <input
            className="w-full px-[18px] py-2.5 rounded-xl border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none placeholder:text-[var(--text-light)]"
            placeholder="Kërko pyetje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 lg:gap-[12px]">
          
          {/* Home Link */}
          <Link to="/" className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-[var(--accent)] no-underline transition-colors">
            <FaHome className="text-[18px]" />
            <span className="hidden lg:inline">Ballina</span>
          </Link>

          {/* THE RESTORED PYET BUTTON */}
          <button 
            onClick={onOpenAskModal}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
          >
            <FaQuestionCircle className="text-[18px]" />
            <span className="hidden lg:inline">Pyet</span>
          </button>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg hover:bg-[var(--accent)] text-[var(--text-light)] transition-all"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <FaSun className="text-[18px] text-yellow-400" /> : <FaMoon className="text-[18px]" />}
          </button>

          {/* Bookmarks */}
          <Link to="/saved" className="relative flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-[var(--accent)] no-underline">
            <FaBookmark className="text-[18px]" />
            {totalBookmarks > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[var(--primary)] text-white text-[11px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalBookmarks}
              </span>
            )}
          </Link>

          <NotificationDropdown />

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 lg:gap-[12px] ml-1 border-l pl-3 border-[var(--border)]">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-500/10 px-2.5 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all no-underline">
                  <FaShieldAlt />
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text-main)] no-underline hover:text-[var(--primary)]">
                <FaUserCircle className="text-lg" />
                <span className="hidden md:inline">{user?.username}</span>
              </Link>
              <button onClick={logout} className="text-[12px] font-medium text-red-500 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                Dil
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="no-underline text-[12px] font-medium text-[var(--text-light)] px-3 py-2">Kyçu</Link>
              <Link to="/register" className="no-underline bg-[var(--primary)] text-white px-5 py-2 rounded-[10px] font-medium text-[13px]">Regjistrohu</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import {
//   FaComments,
//   FaHome,
//   FaQuestionCircle,
//   FaBookmark,
//   FaSignInAlt,
//   FaUserPlus,
//   FaShieldAlt,
//   FaUserCircle,
// } from "react-icons/fa";
// import { useBookmarks } from "../context/BookmarkContext";
// import { useAuth } from "../context/AuthContext";
// import NotificationDropdown from "./NotificationDropdown";

// const Navbar = ({ onOpenAskModal }) => {
//   const { bookmarkedQuestions, bookmarkedAnswers } = useBookmarks();
//   const { isAuthenticated, logout, user } = useAuth();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");

//   const totalBookmarks = bookmarkedQuestions.length + bookmarkedAnswers.length;

//   const handleSearchKeyDown = (e) => {
//     if (e.key === "Enter" && searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
//       setSearchTerm("");
//     }
//   };

//   const isAdmin = user?.role === 1 || 
//                   user?.role === "Admin" || 
//                   user?.role?.toString().toLowerCase() === "admin";

//   return (
//     <nav className="sticky top-0 z-[1000] w-full bg-white border-b border-[var(--border)] shadow-sm">
//       <div className="max-w-[1180px] mx-auto px-4 lg:px-0 py-4 flex items-center justify-between gap-4">
        
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
//           <FaComments className="text-[22px] text-[var(--primary)]" />
//           <span className="text-[22px] font-bold bg-gradient-to-r from-[var(--primary)] to-[#7c3aed] bg-clip-text text-transparent">
//             AlbanianQuora
//           </span>
//         </Link>

//         {/* Search */}
//         <div className="hidden md:flex flex-1 justify-center max-w-[380px]">
//           <input
//             className="w-full px-[18px] py-2.5 rounded-xl border border-[var(--border)] bg-[#f9fafb] text-sm focus:outline-none"
//             placeholder="Kërko pyetje..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={handleSearchKeyDown}
//           />
//         </div>

//         {/* Right side */}
//         <div className="flex items-center gap-2 lg:gap-[12px]">
//           <Link to="/" className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-[var(--accent)] no-underline">
//             <FaHome className="text-[18px]" />
//             <span className="hidden lg:inline">Ballina</span>
//           </Link>

//           <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-[var(--accent)]" onClick={onOpenAskModal}>
//             <FaQuestionCircle className="text-[18px]" />
//             <span className="hidden lg:inline">Pyet</span>
//           </button>

//           <Link to="/saved" className="relative flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-[var(--accent)] no-underline">
//             <FaBookmark className="text-[18px]" />
//             <span className="hidden lg:inline">Bookmark-et</span>
//             {totalBookmarks > 0 && (
//               <span className="absolute -top-1 -right-1.5 bg-[var(--primary)] text-white text-[11px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
//                 {totalBookmarks}
//               </span>
//             )}
//           </Link>

//           <NotificationDropdown />

//           {isAuthenticated ? (
//             <div className="flex items-center gap-2 lg:gap-[12px] ml-2 border-l pl-4 border-gray-200">
              
//               {isAdmin && (
//                 <Link 
//                   to="/admin" 
//                   className="flex items-center gap-1.5 text-[12px] font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white no-underline border border-red-100 transition-all"
//                 >
//                   <FaShieldAlt />
//                   <span className="hidden xl:inline">Admin Panel</span>
//                 </Link>
//               )}

//               {/* PROFILE LINK */}
//               <Link 
//                 to="/profile" 
//                 className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text-main)] hover:text-[var(--primary)] transition-colors no-underline"
//               >
//                 <FaUserCircle className="text-lg" />
//                 <span className="hidden md:inline">{user?.username}</span>
//               </Link>

//               <button
//                 className="text-[12px] font-medium text-[var(--text-light)] px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
//                 onClick={logout}
//               >
//                 Dil
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Link to="/login" className="no-underline text-[12px] font-medium text-[var(--text-light)] px-3 py-2">Kyçu</Link>
//               <Link to="/register" className="no-underline bg-[var(--primary)] text-white px-5 py-2 rounded-[10px] font-medium text-[13px]">Regjistrohu</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
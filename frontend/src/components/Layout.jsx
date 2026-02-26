import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, onOpenAskModal, onCategorySelect }) => {
  return (
    /* Changed bg-[#f5f5f5] to the theme variable and added smooth transition */
    <div className="flex flex-col min-h-screen bg-[var(--bg-light)] transition-colors duration-300">
      <Navbar onOpenAskModal={onOpenAskModal} />

      <div className="flex flex-col min-[901px]:flex-row max-w-[1180px] my-4 mx-3 min-[901px]:mx-auto gap-6 items-start w-[calc(100%-24px)] min-[901px]:w-full">
        {/* Sidebar wrapper */}
        <aside className="hidden min-[901px]:block min-[901px]:flex-[0_0_240px]">
          {/* Passed onCategorySelect here to keep your logic working */}
          <Sidebar onCategorySelect={onCategorySelect} />
        </aside>

        <main className="flex-1 flex flex-col gap-4 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

// import React from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// const Layout = ({ children, onOpenAskModal }) => {
//   return (
//     <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
//       <Navbar onOpenAskModal={onOpenAskModal} />

//       <div className="flex flex-col min-[901px]:flex-row max-w-[1180px] my-4 mx-3 min-[901px]:mx-auto gap-6 items-start w-[calc(100%-24px)] min-[901px]:w-full">
//         {/* Sidebar wrapper to handle the flex basis and mobile hiding */}
//         <aside className="hidden min-[901px]:block min-[901px]:flex-[0_0_240px]">
//           <Sidebar />
//         </aside>

//         <main className="flex-1 flex flex-col gap-4 w-full">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
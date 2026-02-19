import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  const [showAskModal, setShowAskModal] = useState(false);

  const withNavbar = (Component) => (
    <>
      <Navbar onOpenAskModal={() => setShowAskModal(true)} />
      {Component}
    </>
  );

  return (
    <Routes>
      {/* Public routes WITHOUT navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Routes WITH navbar */}
      <Route
        path="/"
        element={withNavbar(
          <Home
            showAskModal={showAskModal}
            setShowAskModal={setShowAskModal}
          />
        )}
      />

      <Route
        path="/question/:id"
        element={withNavbar(<QuestionDetails />)}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}




// import { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/Navbar";

// import Home from "./pages/Home";
// import QuestionDetails from "./pages/QuestionDetails";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";

// export default function App() {
//   const [showAskModal, setShowAskModal] = useState(false);

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />

//       {/* App Layout Routes */}
//       <Route
//         path="/"
//         element={
//           <>
//             <Navbar onOpenAskModal={() => setShowAskModal(true)} />
//             <Home
//               showAskModal={showAskModal}
//               setShowAskModal={setShowAskModal}
//             />
//           </>
//         }
//       />

//       <Route
//         path="/question/:id"
//         element={
//           <>
//             <Navbar onOpenAskModal={() => setShowAskModal(true)} />
//             <QuestionDetails />
//           </>
//         }
//       />

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }

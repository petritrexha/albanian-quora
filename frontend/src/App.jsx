import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";

function App() {
  const [showAskModal, setShowAskModal] = useState(false);

  return (
    <>
      <Navbar onOpenAskModal={() => setShowAskModal(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <Home showAskModal={showAskModal} setShowAskModal={setShowAskModal} />
          }
        />
        <Route path="/question/:id" element={<QuestionDetails />} />
      </Routes>
    </>
  );
}

export default App;




import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { BookmarkProvider } from "./context/BookmarkContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";

function App() {
  const [showAskModal, setShowAskModal] = useState(false);

  return (
    <BookmarkProvider>
      <Navbar onOpenAskModal={() => setShowAskModal(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <Home showAskModal={showAskModal} setShowAskModal={setShowAskModal} />
          }
        />
        <Route path="/question/:id" element={<QuestionDetails />} />
        <Route path="/saved" element={<Bookmarks />} />
      </Routes>
    </BookmarkProvider>
  );
}

export default App;

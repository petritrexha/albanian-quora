import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import QuestionDetails from "./pages/QuestionDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/question/1" element={<QuestionDetails />} />
      </Routes>
    </>
  );
}

export default App;




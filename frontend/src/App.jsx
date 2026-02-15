import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateQuestion from "./pages/CreateQuestion";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/create" element={<CreateQuestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

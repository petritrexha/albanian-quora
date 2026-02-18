import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditQuestion from "./pages/EditQuestion";

// Placeholder Home
function Home() {
  return <div style={{ padding: "40px" }}>Home Page</div>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<EditQuestion />} />
      </Routes>
    </Router>
  );
}

import { Routes, Route, Navigate } from "react-router-dom"
import TestPage from "./pages/TestPage"
import QuestionDetailsPage from "./pages/QuestionDeatilsPage"
import AskPage from "./pages/AskPage"
import EditQuestionPage from "./pages/EditQuestionPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/test" replace />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/questions/:id" element={<QuestionDetailsPage />} />
      <Route path="/ask" element={<AskPage />} />
      <Route path="/ask" element={<AskPage />} />
      <Route path="/questions/:id/edit" element={<EditQuestionPage />} />
   
    </Routes>
  )
}
import { useState } from "react";
import CategoryDropdown from "../components/category/CategoryDropdown";
import useQuestions from "../hooks/useQuestions";
import QuestionCard from "../components/question/QuestionCard";
import AskModal from "../components/question/AskModal";

export default function TestPage() {
  const [categoryId, setCategoryId] = useState("");
  const [askOpen, setAskOpen] = useState(false);

  const { questions, loading } = useQuestions(categoryId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 text-xl font-semibold">
          AlbanianQuora
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-6">
        {/* Create Question Box */}
        <div className="bg-white p-4 rounded shadow-sm border mb-4">
          <input
            type="text"
            placeholder="What do you want to ask?"
            onFocus={() => setAskOpen(true)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow-sm border mb-4">
          <p className="text-sm text-gray-500 mb-2">Filter by category</p>
          <CategoryDropdown value={categoryId} onChange={setCategoryId} />
        </div>

        {/* Question List */}
        <div className="bg-white p-4 rounded shadow-sm border">
          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && questions.length === 0 && (
            <p className="text-gray-500">No questions found.</p>
          )}

          {!loading &&
            questions.map((q) => <QuestionCard key={q.id} question={q} />)}
        </div>
      </div>

      {/* Ask Modal */}
      <AskModal
        open={askOpen}
        onClose={() => setAskOpen(false)}
        onCreated={() => {
        
        }}
      />
    </div>
  );
}
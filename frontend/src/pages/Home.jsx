import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AskBox from "../components/AskBox";
import QuestionCard from "../components/QuestionCard";
import {
  getQuestions,
  createQuestion,
  upvoteQuestion,
  downvoteQuestion,
} from "../services/questionService";

const Home = ({ selectedCategory, refreshTrigger }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagFilter = searchParams.get("tag") || null;

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    getQuestions(user?.id, selectedCategory, tagFilter, null)
      .then((data) => {
        if (mounted && data) setQuestions(data);
      })
      .catch(() => {
        if (mounted) setQuestions([]);
      });
    return () => {
      mounted = false;
    };
  }, [user, selectedCategory, tagFilter, refreshTrigger]);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      const created = await createQuestion({
        title: newQuestion,
        description: newQuestion,
        categoryId: selectedCategory || 1,
      });
      setQuestions((prev) => [created, ...prev]);
      setNewQuestion("");
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const newVotes = await upvoteQuestion(id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, votes: newVotes } : q))
      );
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  const handleDownvote = async (id) => {
    try {
      const newVotes = await downvoteQuestion(id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, votes: newVotes } : q))
      );
    } catch (err) {
      console.error("Downvote failed", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        {/* HERO SECTION */}
        <div className="mb-4 p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Pyet. Ndaj. Mëso.
          </h1>
          <p className="text-slate-500 text-sm">
            Platforma shqiptare për diskutim rreth programimit, teknologjisë dhe dijes.
          </p>
        </div>

        {/* ASK BOX */}
        <AskBox
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          handlePostQuestion={handlePostQuestion}
        />

        {/* TAG FILTER INFO */}
        {tagFilter && (
          <div className="text-sm text-[var(--text-light)]">
            Duke filtruar sipas tag:{" "}
            <strong className="text-[var(--primary)]">{tagFilter}</strong>{" "}
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="ml-2 text-[var(--primary)] hover:underline"
            >
              Hiq filtrim
            </button>
          </div>
        )}

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-semibold text-slate-700 tracking-tight">
            Pyetjet e fundit
          </h2>

          {questions.length > 0 && (
            <span className="text-xs text-slate-400">{questions.length} pyetje</span>
          )}
        </div>

        {/* QUESTIONS */}
        {questions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-white/50">
            <p className="text-slate-500 mb-2">
              Ende nuk ka pyetje në këtë kategori.
            </p>
            <p className="text-xs text-slate-400">
              Bëhu i pari që fillon një diskutim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
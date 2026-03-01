import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AskBox from "../components/AskBox";
import QuestionCard from "../components/QuestionCard";
import {
  getQuestions,
  upvoteQuestion,
  downvoteQuestion,
} from "../services/questionService";

const Home = ({ selectedCategory, refreshTrigger, onOpenAskModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagFilter = searchParams.get("tag") || null;

  const [questions, setQuestions] = useState([]);
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

  const handleUpvote = async (id) => {
    if (!user) return;
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
    if (!user) return;
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
        <div className="mb-4 p-6 rounded-2xl shadow-sm transition-all duration-300
                        bg-white border border-slate-200
                        dark:bg-slate-900 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Pyet / Ndaj / Mëso
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Platforma shqiptare për diskutim rreth fushave të ndryshme.
          </p>
        </div>

        {/* ASK BOX */}
        <AskBox onOpenModal={onOpenAskModal} />

        {/* TAG FILTER INFO */}
        {tagFilter && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Duke filtruar sipas tag:{" "}
            <strong className="text-blue-600 dark:text-blue-400">{tagFilter}</strong>{" "}
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Hiq filtrimin
            </button>
          </div>
        )}

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            Pyetjet e fundit
          </h2>

          {questions.length > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">{questions.length} pyetje</span>
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
          <div className="p-8 text-center rounded-xl transition-all
                          border border-dashed border-slate-200 bg-white/50
                          dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              Ende nuk ka pyetje në këtë kategori.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Bëhu i pari që fillon një diskutim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getQuestions, upvoteQuestion, downvoteQuestion } from "../services/questionService";
import AskBox from "../components/AskBox";
import QuestionCard from "../components/QuestionCard";

/* Category names (same as sidebar) */
const categoryNames = {
  1: "Programim",
  2: "Teknologji",
  3: "Shkencë",
  4: "Arsim",
  5: "Biznes",
};

const CategoryPage = ({ onOpenAskModal, onSetCategory }) => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const { user } = useAuth();

  const categoryName = categoryNames[id] || "Kategoria";

  /* Load questions for category */
  useEffect(() => {
    let mounted = true;

    getQuestions(null, id)
      .then((data) => {
        if (mounted && data) setQuestions(data);
      })
      .catch(() => {
        if (mounted) setQuestions([]);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleOpenModal = () => {
    if (onSetCategory) {
      onSetCategory(Number(id));
    }
    onOpenAskModal();
  };

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

    {/* Category Header */}
    <div className="mb-6 p-6 rounded-2xl shadow-sm transition-all duration-300
                    bg-white border border-slate-200
                    dark:bg-slate-900 dark:border-slate-800">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        {categoryName}
      </h1>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Diskutime dhe pyetje rreth {categoryName.toLowerCase()}.
      </p>

      <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        {questions.length} pyetje
      </div>
    </div>

    {/* Ask Box */}
    <div className="mb-8">
      <AskBox onOpenModal={handleOpenModal} />
    </div>

    {/* Questions */}
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
);
};

export default CategoryPage;
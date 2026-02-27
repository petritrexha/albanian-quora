import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions, createQuestion } from "../services/questionService";
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

const CategoryPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

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

  /* Post question in this category */
  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;

    const tempId = Date.now();
    const localQuestion = {
      id: tempId,
      title: newQuestion,
      content: "",
      votes: 0,
      views: 0,
      answers: 0,
      categoryId: Number(id),
    };

    setQuestions((prev) => [localQuestion, ...prev]);
    setNewQuestion("");

    try {
      const created = await createQuestion({
        title: localQuestion.title,
        content: localQuestion.content,
        categoryId: Number(id),
      });

      setQuestions((prev) =>
        prev.map((q) => (q.id === tempId ? created : q))
      );
    } catch (err) {
      console.error("Failed to create question:", err);
    }
  };
return (
  <div className="w-full max-w-4xl mx-auto px-4 py-6">

    {/* Category Header */}
    <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">
        {categoryName}
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Diskutime dhe pyetje rreth {categoryName.toLowerCase()}.
      </p>

      <div className="mt-3 text-xs text-slate-400">
        {questions.length} pyetje
      </div>
    </div>

    {/* Ask Box */}
    <div className="mb-8">
      <AskBox
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        handlePostQuestion={handlePostQuestion}
      />
    </div>

    {/* Questions */}
    {questions.length > 0 ? (
      <div className="flex flex-col gap-4">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
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
);
};

export default CategoryPage;
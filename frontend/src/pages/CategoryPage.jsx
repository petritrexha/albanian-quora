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
    <div className="flex flex-col gap-4 w-full pt-0">
      <div className="w-full max-w-[900px] flex flex-col gap-4">
        <AskBox
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          handlePostQuestion={handlePostQuestion}
        />

        <h2 className="text-xl font-bold text-[var(--text-main)] mb-3">
          {categoryName}
        </h2>

        {questions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-light)] italic text-sm mt-4">
            Nuk ka pyetje në këtë kategori aktualisht...
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
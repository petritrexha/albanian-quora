import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getQuestions } from "../services/questionService";
import QuestionCard from "../components/QuestionCard";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const query = useQuery();
  const searchTerm = query.get("q")?.toLowerCase() || "";

  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);

  /* Load all questions then filter by title */
  useEffect(() => {
    let mounted = true;

    getQuestions()
      .then((data) => {
        if (mounted) {
          setQuestions(data || []);
        }
      })
      .catch(() => {
        if (mounted) setQuestions([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* Filter by title */
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const filtered = questions.filter((q) =>
      q.title?.toLowerCase().includes(searchTerm)
    );

    setResults(filtered);
  }, [questions, searchTerm]);

 return (
  <div className="w-full max-w-[900px] mx-auto px-4 py-6">
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-6 py-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-main)]">
          Rezultatet për{" "}
          <span className="text-[var(--primary)] font-bold">
            {searchTerm ? `"${searchTerm}"` : "…"}
          </span>
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {searchTerm
            ? `U gjetën ${results.length} rezultate.`
            : "Shkruaj diçka në search për të parë rezultatet."}
        </p>
      </div>

      {searchTerm && results.length > 0 ? (
        <div className="flex flex-col gap-4">
          {results.map((question) => (
            <div
              key={question.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm"
            >
              <QuestionCard question={question} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)] p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            {searchTerm ? "Nuk u gjet asnjë pyetje." : "Shkruaj diçka për të kërkuar."}
          </p>
        </div>
      )}
    </div>
  </div>
);
};

export default SearchPage;
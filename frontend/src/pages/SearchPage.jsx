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
    <div className="w-full max-w-[900px]">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-2">
          Rezultatet e kërkimit për: <span className="text-[var(--primary)]">"{searchTerm}"</span>
        </h2>

        {searchTerm && results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {results.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center">
            <p className="text-gray-500 italic">
              {searchTerm
                ? "Nuk u gjet asnjë pyetje."
                : "Shkruaj diçka për të kërkuar."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
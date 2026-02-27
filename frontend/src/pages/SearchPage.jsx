import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getQuestions } from "../services/questionService";
import QuestionCard from "../components/QuestionCard";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage = () => {
  const query = useQuery();
  const searchTerm = query.get("q")?.trim() || "";
  const tagFilter = query.get("tag")?.trim() || null;

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchTerm && !tagFilter) {
      setResults([]);
      return;
    }
    let mounted = true;
    getQuestions(null, null, tagFilter || undefined, searchTerm || undefined)
      .then((data) => {
        if (mounted) setResults(data || []);
      })
      .catch(() => {
        if (mounted) setResults([]);
      });
    return () => { mounted = false; };
  }, [searchTerm, tagFilter]);

  const hasFilter = searchTerm || tagFilter;

  return (
    <div className="w-full max-w-[900px]">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-2">
          {hasFilter ? (
            <>Rezultatet: {searchTerm && <span className="text-[var(--primary)]">"{searchTerm}"</span>}{tagFilter && <> {" "} tag: <span className="text-[var(--primary)]">{tagFilter}</span></>}</>
          ) : (
            "Shkruaj diçka për të kërkuar."
          )}
        </h2>

        {hasFilter && results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {results.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card-bg)] p-10 rounded-xl border border-dashed border-[var(--border)] text-center">
            <p className="text-[var(--text-light)] italic">
              {hasFilter ? "Nuk u gjet asnjë pyetje." : "Shkruaj diçka për të kërkuar."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
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

    return () => {
      mounted = false;
    };
  }, [searchTerm, tagFilter]);

  const hasFilter = !!(searchTerm || tagFilter);

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-6 py-5 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-main)]">
            {hasFilter ? (
              <>
                Rezultatet për{" "}
                {searchTerm && (
                  <span className="text-[var(--primary)] font-bold">
                    "{searchTerm}"
                  </span>
                )}
                {tagFilter && (
                  <>
                    {" "}
                    tag:{" "}
                    <span className="text-[var(--primary)] font-bold">
                      {tagFilter}
                    </span>
                  </>
                )}
              </>
            ) : (
              "Shkruaj diçka për të kërkuar."
            )}
          </h2>

          <p className="mt-1 text-sm text-[var(--text-light)]">
            {hasFilter
              ? `U gjetën ${results.length} rezultate.`
              : "Shkruaj diçka në search për të parë rezultatet."}
          </p>
        </div>

        {hasFilter && results.length > 0 ? (
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
            <p className="text-sm text-[var(--text-light)] italic">
              {hasFilter
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
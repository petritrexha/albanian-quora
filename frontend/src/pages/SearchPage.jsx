import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getQuestions, upvoteQuestion, downvoteQuestion } from "../services/questionService";
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

  const handleUpvote = async (id) => {
    try {
      const newVotes = await upvoteQuestion(id);
      setResults((prev) =>
        prev.map((q) => (q.id === id ? { ...q, votes: newVotes } : q))
      );
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  const handleDownvote = async (id) => {
    try {
      const newVotes = await downvoteQuestion(id);
      setResults((prev) =>
        prev.map((q) => (q.id === id ? { ...q, votes: newVotes } : q))
      );
    } catch (err) {
      console.error("Downvote failed", err);
    }
  };

  const hasFilter = !!(searchTerm || tagFilter);

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl px-6 py-5 shadow-sm transition-all duration-300
                        bg-white border border-slate-200
                        dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
            {hasFilter ? (
              <>
                Rezultatet për{" "}
                {searchTerm && (
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    "{searchTerm}"
                  </span>
                )}
                {tagFilter && (
                  <>
                    {" "}
                    tag:{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {tagFilter}
                    </span>
                  </>
                )}
              </>
            ) : (
              "Shkruaj diçka për të kërkuar."
            )}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                className="rounded-2xl shadow-sm
                           bg-white border border-slate-200
                           dark:bg-slate-800 dark:border-slate-700/50"
              >
                <QuestionCard 
                  question={question}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center transition-all
                          border border-dashed border-slate-200 bg-white/50
                          dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
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
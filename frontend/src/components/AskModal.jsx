import { useEffect, useState } from "react";
import { getTags } from "../services/tagService";

const AskModal = ({
  newQuestion,
  setNewQuestion,
  selectedTagIds,
  setSelectedTagIds,
  handlePostQuestion,
  onClose,
}) => {
  const [tags, setTags] = useState([]);
  const isDisabled = !newQuestion.trim();
  const maxChars = 300;

  useEffect(() => {
    getTags().then(setTags).catch(() => setTags([]));
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="p-8 flex flex-col gap-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Posto një pyetje
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Shkruaj qartë dhe specifik për përgjigje më të mira.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          maxLength={maxChars}
          className="w-full min-h-[160px] p-4 rounded-2xl
                     border border-slate-200 dark:border-slate-700
                     bg-slate-50 dark:bg-slate-800
                     text-sm text-slate-800 dark:text-slate-200
                     placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition-all duration-200 resize-y"
          placeholder="Shkruaj pyetjen tënde këtu..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <div className="absolute bottom-3 right-4 text-xs text-slate-400">
          {newQuestion.length}/{maxChars}
        </div>
      </div>

      {/* Tags (opsional) */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Tags (opsional)
          </span>

          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const active = selectedTagIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white/60 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-lg text-sm font-medium
                     text-slate-500 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800
                     transition"
        >
          Anulo
        </button>

        <button
          type="button"
          onClick={handlePostQuestion}
          disabled={isDisabled}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
            ${
              isDisabled
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
            }`}
        >
          Posto pyetjen
        </button>
      </div>
    </div>
  );
};

export default AskModal;
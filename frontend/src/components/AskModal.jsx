import React, { useEffect, useState } from "react";
import { getTags } from "../services/tagService";

const AskModal = ({ newQuestion, setNewQuestion, selectedTagIds, setSelectedTagIds, handlePostQuestion, onClose }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="p-6 flex flex-col gap-4 bg-[var(--card-bg)] transition-colors duration-300">
      <h2 className="m-0 text-[22px] text-center font-semibold text-[var(--text-main)]">
        Posto një pyetje
      </h2>

      <textarea
        className="w-full min-h-[140px] p-4 rounded-lg border border-[var(--border)] resize-y text-sm focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--bg-light)] text-[var(--text-main)] placeholder:text-[var(--text-light)]"
        placeholder="Shkruaj pyetjen tënde këtu..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />

      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--text-main)]">Tags (opsional)</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedTagIds.includes(t.id)
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--bg-light)] text-[var(--text-main)] border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-2">
        <button
          className="px-6 py-2.5 bg-transparent text-[var(--text-light)] border border-[var(--border)] rounded-full font-semibold cursor-pointer hover:bg-[var(--bg-light)] transition-all"
          onClick={onClose}
        >
          Anulo
        </button>
        <button
          className="px-6 py-2.5 bg-[var(--primary)] text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 hover:shadow-lg active:scale-95"
          onClick={handlePostQuestion}
        >
          Posto pyetjen
        </button>
      </div>
    </div>
  );
};

export default AskModal;
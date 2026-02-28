import { useEffect, useState } from "react";
import { getTags, createTag } from "../services/tagService";

const AskModal = ({
  newQuestion,
  setNewQuestion,
  selectedTagIds,
  setSelectedTagIds,
  handlePostQuestion,
  onClose,
  categoryId = null,
}) => {
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [tagsError, setTagsError] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const isDisabled = !newQuestion.trim();
  const maxChars = 300;

  const loadTags = async () => {
    setLoadingTags(true);
    setTagsError(false);
    try {
      const data = await getTags();
      setTags(data || []);
    } catch {
      setTags([]);
      setTagsError(true);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    setCreatingTag(true);
    try {
      // Use categoryId from route, or default to 1
      const createdTag = await createTag(newTagName, categoryId || 1);
      // Add new tag to list
      setTags((prev) => [...prev, createdTag]);
      // Auto-select the newly created tag
      setSelectedTagIds((prev) => [...prev, createdTag.id]);
      // Reset form
      setNewTagName("");
      setShowCreateTag(false);
    } catch (error) {
      alert("Nuk u krijua tag-u. Sigurohu që je i kyçur.");
    } finally {
      setCreatingTag(false);
    }
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Tags (opsional)
          </span>
          {selectedTagIds.length > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {selectedTagIds.length} zgjedhur
            </span>
          )}
        </div>

        {loadingTags ? (
          <div className="text-sm text-slate-400 py-2">
            Duke ngarkuar tags...
          </div>
        ) : tagsError ? (
          <div className="text-sm text-slate-400 py-2">
            Nuk mund të ngarkohen tags. Mund të vazhdoni pa to.
          </div>
        ) : tags.length === 0 ? (
          <div className="text-sm text-slate-400 py-2">
            Nuk ka tags të disponueshme.
          </div>
        ) : (
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
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white/60 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Create New Tag Button */}
        {!loadingTags && !tagsError && (
          <div className="mt-2">
            {!showCreateTag ? (
              <button
                type="button"
                onClick={() => setShowCreateTag(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Krijo tag të ri
              </button>
            ) : (
              <div className="flex gap-2 items-center mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  placeholder="Emri i tag-ut"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm
                             border border-slate-200 dark:border-slate-600
                             bg-white dark:bg-slate-700
                             text-slate-800 dark:text-slate-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={creatingTag}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || creatingTag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white
                             hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  {creatingTag ? "Duke krijuar..." : "Krijo"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTag(false);
                    setNewTagName("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500
                             hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  disabled={creatingTag}
                >
                  Anulo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
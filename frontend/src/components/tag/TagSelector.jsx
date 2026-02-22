import { useState } from "react"
import useTags from "../../hooks/useTags";

export default function TagSelector({ categoryId, selectedTags = [], onChange }) {
  const { tags, loading } = useTags(categoryId);

  const safeTags = Array.isArray(tags) ? tags : [];
  const selected = Array.isArray(selectedTags) ? selectedTags : [];

  const handleAdd = (tagId) => {
    if (!selected.includes(tagId)) {
      onChange([...selected, tagId]);
    }
  };

  const handleRemove = (tagId) => {
    onChange(selected.filter((id) => id !== tagId));
  };

  if (!categoryId) {
    return <div className="text-sm text-gray-500 mt-2">Select category first</div>;
  }

  if (loading) {
    return <div className="text-sm mt-2">Loading tags...</div>;
  }

  return (
    <div className="mt-3">
      {/* Available tags */}
      <div className="flex flex-wrap gap-2">
        {safeTags.length === 0 ? (
          <div className="text-sm text-gray-500">No tags for this category.</div>
        ) : (
          safeTags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={() => handleAdd(tag.id)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full transition"
            >
              {tag.name}
            </button>
          ))
        )}
      </div>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="mt-3">
          <div className="text-sm mb-1 font-medium">Selected:</div>
          <div className="flex flex-wrap gap-2">
            {safeTags
              .filter((t) => selected.includes(t.id))
              .map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemove(tag.id)}
                    className="ml-2 text-xs font-bold"
                    aria-label="Remove tag"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
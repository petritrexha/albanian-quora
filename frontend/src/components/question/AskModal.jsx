import { useState } from "react"
import CategoryDropdown from "../category/CategoryDropdown"
import TagSelector from "../tag/TagSelector"
import axios from "../../api/axios"

export default function AskModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tagIds, setTagIds] = useState([])
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const reset = () => {
    setTitle("")
    setContent("")
    setCategoryId("")
    setTagIds([])
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!categoryId) return alert("Select a category")

    setLoading(true)
    try {
      const res = await axios.post("/questions", {
        title,
        content,
        categoryId: Number(categoryId),
        tagIds,
      })

      // i kthen pyetjen te page që ta fusë në listë
      onCreated?.(res.data)

      reset()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to create question")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal box */}
      <div className="relative max-w-2xl mx-auto mt-24 bg-white border rounded shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Ask a question</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain your question..."
            rows={5}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />

          <div>
            <p className="text-sm text-gray-500 mb-2">Category</p>
            <CategoryDropdown value={categoryId} onChange={setCategoryId} />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Tags</p>
            <TagSelector
              categoryId={categoryId}
              selectedTags={tagIds}
              onChange={setTagIds}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
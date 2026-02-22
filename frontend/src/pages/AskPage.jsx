import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import CategoryDropdown from "../components/category/CategoryDropdown"
import TagSelector from "../components/tag/TagSelector"
import axios from "../api/axios"

export default function AskPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tagIds, setTagIds] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
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

      // shko te details e pyetjes së re
      navigate(`/questions/${res.data.id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to create question")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 text-xl font-semibold">
          <Link to="/test" className="hover:underline">AlbanianQuora</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-6">
        <div className="bg-white p-6 rounded shadow-sm border">
          <h1 className="text-xl font-semibold text-gray-900">Ask a question</h1>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
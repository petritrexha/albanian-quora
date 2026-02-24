import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "../api/axios"
import CategoryDropdown from "../components/category/CategoryDropdown"
import TagSelector from "../components/tag/TagSelector"

export default function EditQuestionPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tagIds, setTagIds] = useState([])

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/questions/${id}`)
        const q = res.data

        setTitle(q.title)
        setContent(q.content)
        setCategoryId(q.categoryId)
        setTagIds(q.tagIds || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios.put(`/questions/${id}`, {
      title,
      content,
      categoryId,
      tagIds
    })

    navigate(`/questions/${id}`)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 text-xl font-semibold">
          <Link to="/test">AlbanianQuora</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white p-6 rounded shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Edit Question</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Title"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 h-32"
              placeholder="Content"
            />

            <CategoryDropdown
              value={categoryId}
              onChange={setCategoryId}
            />

            <TagSelector
              categoryId={categoryId}
              selectedTags={tagIds}
              onChange={setTagIds}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate(`/questions/${id}`)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
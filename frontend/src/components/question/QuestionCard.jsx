import { Link, useNavigate } from "react-router-dom"
import axios from "../../api/axios"

export default function QuestionCard({ question }) {
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.stopPropagation() // mos me navigu te details

    const confirmDelete = window.confirm("Delete this question?")
    if (!confirmDelete) return

    try {
      await axios.delete(`/questions/${question.id}`)
      window.location.reload() // refresh feed
    } catch (err) {
      console.error(err)
      alert("Delete failed")
    }
  }

  const preview =
    question.content?.length > 160
      ? question.content.slice(0, 160) + "…"
      : question.content

  return (
    <div className="border-b py-4 relative">

      {/* DELETE BUTTON */}
      <div className="absolute top-4 right-0">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>

      <h3 className="text-base font-semibold text-gray-900">
        <Link to={`/questions/${question.id}`} className="hover:underline">
          {question.title}
        </Link>
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        {preview}
      </p>

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {question.category && (
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200">
            {question.category}
          </span>
        )}

        {Array.isArray(question.tags) &&
          question.tags.map((t, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded bg-white text-gray-600 border border-gray-200"
            >
              #{t}
            </span>
          ))}
      </div>
    </div>
  )
}
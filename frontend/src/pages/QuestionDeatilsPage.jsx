import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "../api/axios"

export default function QuestionDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/questions/${id}`)
        setQuestion(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    )
    if (!confirmDelete) return

    try {
      await axios.delete(`/questions/${id}`)
      navigate("/test")
    } catch (err) {
      console.error(err)
      alert("Delete failed")
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>
  }

  if (!question) {
    return <div className="min-h-screen bg-gray-100 p-6">Not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 text-xl font-semibold">
          <Link to="/test" className="hover:underline">
            AlbanianQuora
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white p-6 rounded shadow-sm border relative">

          {/* Edit + Delete Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Link
              to={`/questions/${id}/edit`}
              className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {question.title}
          </h1>

          <p className="mt-3 text-gray-700 whitespace-pre-wrap">
            {question.content}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
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
      </div>
    </div>
  )
}
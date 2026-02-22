import { useEffect, useState } from "react"
import axios from "../api/axios"

export default function useQuestions(categoryId) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("/questions", {
          params: categoryId ? { categoryId } : {}
        })
        setQuestions(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [categoryId])

  return { questions, loading }
}
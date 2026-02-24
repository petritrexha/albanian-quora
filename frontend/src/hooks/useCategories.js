import { useEffect, useState } from "react"
import { getCategories } from "../api/categoryApi"

export default function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
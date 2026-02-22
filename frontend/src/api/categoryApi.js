import axios from "./axios"

export const getCategories = async () => {
  const res = await axios.get("/categories")
  return res.data   // 🔥 kjo mungonte
}
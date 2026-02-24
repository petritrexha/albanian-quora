import axios from "./axios";

export async function getTags(categoryId) {
  const res = await axios.get("/tags", {
    params: categoryId ? { categoryId } : {},
  });
  return res.data; 
}
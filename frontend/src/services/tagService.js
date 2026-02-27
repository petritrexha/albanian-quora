import api from "./api";

export const getTags = async (categoryId) => {
  try {
    const url = categoryId ? `/api/tags?categoryId=${categoryId}` : "/api/tags";
    const res = await api.get(url);
    return res.data || [];
  } catch (error) {
    console.error("Failed to load tags", error);
    return [];
  }
};

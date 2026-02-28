import api from "./api";

export const createBookmark = async (questionId) => {
  const res = await api.post("/bookmarks", { questionId });
  return res.data;
};

export const deleteBookmark = async (bookmarkId) => {
  await api.delete(`/bookmarks/${bookmarkId}`);
};

export const getMyBookmarks = async () => {
  const res = await api.get("/bookmarks/me");
  return res.data;
};
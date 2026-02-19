import api from "./api";

export const getQuestions = async (userId) => {
  const url = userId ? `/api/questions?userId=${userId}` : "/api/questions";
  const res = await api.get(url);
  return res.data;
};

export const getQuestionById = async (id, userId) => {
  const url = userId ? `/api/questions/${id}?userId=${userId}` : `/api/questions/${id}`;
  const res = await api.get(url);
  return res.data;
};
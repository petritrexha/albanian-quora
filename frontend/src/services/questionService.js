import api from "./api";

export const getQuestions = async (userId) => {
  const url = userId ? `/questions?userId=${userId}` : "/questions";
  const res = await api.get(url);
  return res.data;
};

export const getQuestionById = async (id, userId) => {
  const url = userId ? `/questions/${id}?userId=${userId}` : `/questions/${id}`;
  const res = await api.get(url);
  return res.data;
};
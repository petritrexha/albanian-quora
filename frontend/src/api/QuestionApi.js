import api from "./axios"

export const getQuestions = (categoryId) =>
  api.get(`/questions?categoryId=${categoryId}`)
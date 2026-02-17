import { mockQuestions } from "../data/mockQuestions";

export const getQuestions = () => {
  return Promise.resolve(mockQuestions);
};

export const getQuestionById = (id) => {
  return Promise.resolve(
    mockQuestions.find((q) => q.id === Number(id))
  );
};
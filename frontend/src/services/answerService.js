import api from "./api";

// This matches the POST api/Answers that worked in Swagger
export const createAnswer = async (questionId, data) => {
  const res = await api.post("Answers", {
    questionId: questionId,
    content: data.content
  });
  return res.data;
};

// This matches GET api/Answers/question/{id}
export const getAnswersByQuestionId = async (questionId) => {
  const res = await api.get(`Answers/question/${questionId}`);
  return res.data;
};

export const upvoteAnswer = async (id) => {
  const res = await api.post(`Answers/${id}/upvote`);
  return res.data;
};

export const downvoteAnswer = async (id) => {
  const res = await api.post(`Answers/${id}/downvote`);
  return res.data;
};


// import api from "./api";

// export const createAnswer = async (questionId, data) => {
//   const res = await api.post(`/questions/${questionId}/answers`, data);
//   return res.data;
// };

// export const upvoteAnswer = async (id) => {
//   const res = await api.post(`/answers/${id}/upvote`);
//   return res.data;
// };

// export const downvoteAnswer = async (id) => {
//   const res = await api.post(`/answers/${id}/downvote`);
//   return res.data;
// };

// // --- Add this function ---
// export const getAnswersByQuestionId = async (questionId) => {
//   const res = await api.get(`/answers/question/${questionId}`);
//   return res.data;
// };
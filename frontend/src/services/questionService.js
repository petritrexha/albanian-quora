import api from "./api";

export const getQuestions = async (userId, categoryId, tag, search) => {
  try {
    let url = "/api/questions";
    const params = [];
    if (userId) params.push(`userId=${userId}`);
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Failed to load questions", error);
    return [];
  }
};

export const getQuestionById = async (id, userId) => {
  try {
    const url = userId ? `/api/questions/${id}?userId=${userId}` : `/api/questions/${id}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Failed to load question", error);
    return null;
  }
};

export const createQuestion = async (payload) => {
  const userId = localStorage.getItem("userId");
  const res = await api.post("/api/questions", {
    title: payload.title,
    content: payload.description || "",
    categoryId: Number(payload.categoryId) || 1,
    tagIds: (payload.tagIds || []).map(id => Number(id)),
    userId: Number(userId),
  });
  return res.data;
};

// --- ADD THESE FOR VOTING ---
export const upvoteQuestion = async (id) => {
  const res = await api.post(`/api/questions/${id}/upvote`);
  return res.data; // returns new vote count
};

export const downvoteQuestion = async (id) => {
  const res = await api.post(`/api/questions/${id}/downvote`);
  return res.data; // returns new vote count
};

// import api from "./api";

// export const getQuestions = async (userId, categoryId) => {
//   try {
//     let url = "/api/questions";

//     const params = [];

//     if (userId) {
//       params.push(`userId=${userId}`);
//     }

//     if (categoryId) {
//       params.push(`categoryId=${categoryId}`);
//     }

//     if (params.length > 0) {
//       url += `?${params.join("&")}`;
//     }

//     const res = await api.get(url);
//     return res.data;
//   } catch (error) {
//     console.error("Failed to load questions", error);
//     return [];
//   }
// };

// export const getQuestionById = async (id, userId) => {
//   try {
//     const url = userId
//       ? `/api/questions/${id}?userId=${userId}`
//       : `/api/questions/${id}`;

//     const res = await api.get(url);
//     return res.data;
//   } catch (error) {
//     console.error("Failed to load question", error);
//     return null;
//   }
// };

// export const createQuestion = async (payload) => {
//   const userId = localStorage.getItem("userId");

//   const res = await api.post("/api/questions", {
//     title: payload.title,
//     content: payload.description || "",
//     categoryId: payload.categoryId || 1,
//     tagIds: payload.tagIds || [],
//     userId: Number(userId),   // ✅ ADD THIS
//   });

//   return res.data;
// };
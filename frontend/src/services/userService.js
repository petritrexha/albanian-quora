import api from "./api";

export async function getUserProfile(userId) {
  if (!userId) throw new Error("User id is required to load profile.");
  const res = await api.get(`/users/${userId}`);
  return res.data;
}

export async function updateUserProfile(userId, payload) {
  if (!userId) throw new Error("User id is required to update profile.");
  await api.put(`/users/${userId}`, payload);
}


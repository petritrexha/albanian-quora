import api from "./api";

// POST /auth/login  
export async function login(payload) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}

// POST /auth/register 
export async function register(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

// GET /auth/me
export async function me() {
  const res = await api.get("/auth/me");
  return res.data;
}

// POST /auth/logout (optional)
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
  }
}

// POST /auth/forgot-password
export async function forgotPassword(payload) {
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
}

// POST /auth/reset-password
export async function resetPassword(payload) {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
}

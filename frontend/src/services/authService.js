import api from "./api";

// LOGIN
export async function login({ identifier, password }) {
  if (!identifier || !password) throw new Error("Identifier and password required");

  const payload = {
    EmailOrUsername: identifier.trim(),
    Password: password.trim(),
  };

  console.log("authService sending login payload:", payload);

  const res = await api.post("/api/auth/login", payload);

  if (res.data.token) {
    localStorage.setItem("accessToken", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
}

// REGISTER
export async function register(payload) {
  const res = await api.post("/api/auth/register", payload);

  if (res.data.token) {
    localStorage.setItem("accessToken", res.data.token);
  }

  return res.data;
}

// GET CURRENT USER
export async function me() {
  const res = await api.get("/api/auth/me");
  return res.data;
}

// FORGOT PASSWORD
export async function forgotPassword(payload) {
  const res = await api.post("/api/auth/forgot-password", payload);
  return res.data;
}

// RESET PASSWORD
export async function resetPassword(payload) {
  const res = await api.post("/api/auth/reset-password", payload);
  return res.data;
}

// LOGOUT
export async function logout() {
  try {
    await api.post("/api/auth/logout");
  } catch {
    // ignore errors
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}


/*export async function login(payload) {
  const res = await api.post("api/auth/login", payload);

  if (res.data.token) {
     localStorage.setItem("accessToken", res.data.token);
   }

   return res.data;
 }
*/
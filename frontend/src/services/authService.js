import api from "./api";

// Login
export async function login({ identifier, password }) {
  if (!identifier || !password) throw new Error("Identifier and password required");

  const payload = {
    EmailOrUsername: identifier.trim(),
    Password: password.trim(),
  };

  const res = await api.post("/api/auth/login", payload);

  const otpRequired = res.data.otpRequired ?? res.data.OtpRequired;
  const loginAttemptId = res.data.loginAttemptId ?? res.data.LoginAttemptId;

  if (otpRequired && loginAttemptId) {
    localStorage.setItem("loginAttemptId", String(loginAttemptId));
  }

  return {
    otpRequired: !!otpRequired,
    loginAttemptId: loginAttemptId ?? null,
    raw: res.data,
  };
}

// Verify 2FA
export async function verify2fa({ loginAttemptId, code }) {
  if (!loginAttemptId) throw new Error("loginAttemptId required");
  if (!code) throw new Error("code required");

  const payload = {
    LoginAttemptId: Number(loginAttemptId),
    Code: String(code).trim(),
  };

  const res = await api.post("/api/auth/verify-2fa", payload);

  const token = res.data.accessToken || res.data.AccessToken;
  const userData = res.data.user || res.data.User;

  if (token) {
    localStorage.setItem("accessToken", token);
  }
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  }

  localStorage.removeItem("loginAttemptId");

  return res.data;
}

//Resend 2FA Code
 
export async function resend2fa({ loginAttemptId }) {
  if (!loginAttemptId) throw new Error("loginAttemptId required");

  const payload = {
    LoginAttemptId: Number(loginAttemptId),
  };

  const res = await api.post("/api/auth/resend-2fa", payload);
  return res.data;
}

// Register
export async function register(payload) {
  const res = await api.post("/api/auth/register", payload);

  const token = res.data.accessToken || res.data.AccessToken;
  const userData = res.data.user || res.data.User;

  if (token) {
    localStorage.setItem("accessToken", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }

  return res.data;
}

// Get current user
export async function me() {
  const res = await api.get("/api/auth/me");
  return res.data;
}

//Forgot password
export async function forgotPassword(payload) {
  const res = await api.post("/api/auth/forgot-password", payload);
  return res.data;
}

//reset password
export async function resetPassword(payload) {
  const res = await api.post("/api/auth/reset-password", payload);
  return res.data;
}

//Logout
export async function logout() {
  try {
    await api.post("/api/auth/logout");
  } catch {
    // ignore errors
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("loginAttemptId");
}
import api from "./api";

// Login
export async function login({ identifier, password }) {
  if (!identifier || !password) throw new Error("Identifier and password required");

  const payload = {
    EmailOrUsername: identifier.trim(),
    Password: password.trim(),
  };

  const res = await api.post("auth/login", payload);

  // The backend now returns AccessToken and User immediately
  const token = res.data.accessToken || res.data.AccessToken;
  const userData = res.data.user || res.data.User;

  if (token) {
    localStorage.setItem("accessToken", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }

  // Return false for otpRequired so the UI skips the 2FA screen
  return {
    otpRequired: false,
    accessToken: token,
    user: userData
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

  const res = await api.post("auth/verify-2fa", payload);

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

  const res = await api.post("auth/resend-2fa", payload);
  return res.data;
}

// Register
export async function register(payload) {
  const res = await api.post("auth/register", payload);

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
  const res = await api.get("auth/me");
  return res.data;
}

//Forgot password
export async function forgotPassword(payload) {
  const res = await api.post("auth/forgot-password", payload);
  return res.data;
}

//reset password
export async function resetPassword(payload) {
  const res = await api.post("auth/reset-password", payload);
  return res.data;
}

//Logout
export async function logout() {
  try {
    await api.post("auth/logout");
  } catch {
    // ignore errors
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("loginAttemptId");
}
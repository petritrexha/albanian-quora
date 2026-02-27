import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const identifierValue = identifier.trim();
    const passwordValue = password.trim();

    if (!identifierValue || !passwordValue) {
      setError("Plotëso të gjitha fushat.");
      return;
    }

    setLoading(true);
    try {
      const result = await login({
        identifier: identifierValue,
        password: passwordValue,
      });

      //redirect to 2FA
      if (result?.otpRequired && result?.loginAttemptId) {
        navigate("/verify-2fa", {
          replace: true,
          state: { loginAttemptId: result.loginAttemptId },
        });
        return;
      }

      // fallback
      setError("Login dështoi. Provo prapë.");
    } catch (err) {
      console.error("Login Error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login dështoi. Kontrollo kredencialet.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 relative overflow-hidden p-4">
      {/* Blur background shapes */}
      <div className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-[-80px] left-[-80px]" />
      <div className="absolute w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl bottom-[-80px] right-[-80px]" />

      <div className="relative z-10 w-full max-w-[380px] p-10 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl animate-[fadeIn_0.6s_ease]">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800 tracking-tight">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-500/10 p-3 rounded-lg border border-red-200/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Email / Username
            </label>
            <input
              className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 text-sm
                         focus:outline-none focus:ring-4 focus:ring-blue-200
                         focus:border-blue-400 transition-all duration-200 disabled:opacity-60"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="email ose username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 text-sm
                         focus:outline-none focus:ring-4 focus:ring-blue-200
                         focus:border-blue-400 transition-all duration-200 disabled:opacity-60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       shadow-lg hover:shadow-xl hover:scale-[1.02]
                       active:scale-[0.98] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Duke u kyçur..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:underline text-blue-600">
            Forgot password?
          </Link>
          <span className="mx-2 opacity-50">•</span>
          <Link to="/register" className="hover:underline text-blue-600">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
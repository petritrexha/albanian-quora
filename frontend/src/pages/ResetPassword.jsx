import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const strongPassword = (v) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/.test(v);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Token mungon ose link-u është jo valid.");
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Shkruaj password-in dhe confirm password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("ConfirmPassword nuk përputhet me Password.");
      return;
    }

    if (!strongPassword(password)) {
      setError(
        "Password duhet 8-64 karaktere dhe të ketë së paku: 1 uppercase, 1 lowercase, 1 digit, 1 special."
      );
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token,
        password,
        confirmPassword,
      });

      setMessage("Password u ndryshua me sukses. Mundeni të kyçeni tani.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Reset dështoi. Link-u mund të jetë skaduar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex justify-center items-center p-6 font-sans transition-colors duration-300">
      <div className="bg-[var(--card-bg)] p-10 w-full max-w-[400px] rounded-xl shadow-lg border border-[var(--border)]">
        <h2 className="mb-6 text-[var(--text-main)] text-2xl font-bold text-center">Reset Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border-l-4 border-red-500 text-red-500 text-sm leading-relaxed">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border-l-4 border-green-500 text-green-600 text-sm leading-relaxed">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-main)]">New Password</label>
            <input
              type="password"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-main)]">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <button 
            className="w-full mt-2 p-3 bg-[var(--primary)] border-none rounded-lg text-white font-bold cursor-pointer transition-all duration-200 hover:opacity-90 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Duke ruajtur..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
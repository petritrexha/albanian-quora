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
  <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center p-4 font-sans transition-colors">
    <div className="w-full max-w-[420px] rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-[var(--text-main)]">
        Reset Password
      </h2>
      <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
        Create a new password for your account.
      </p>

      {(error || message) && (
        <div className="mt-5 space-y-3">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700">
              {message}
            </div>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-main)]">
            New Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--accent)] px-3 py-2.5 text-[var(--text-main)]
                       placeholder:text-[var(--text-muted)] outline-none transition
                       focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-main)]">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--accent)] px-3 py-2.5 text-[var(--text-main)]
                       placeholder:text-[var(--text-muted)] outline-none transition
                       focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <button
          className="w-full rounded-lg bg-[var(--primary)] py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
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
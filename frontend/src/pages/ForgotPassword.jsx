import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const val = email.trim();

    if (!val) {
      setError("Shkruaj email-in.");
      return;
    }

    if (!isValidEmail(val)) {
      setError("Email jo valid.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email: val });
      setMessage(
        "Nëse ky email ekziston, e kemi dërguar një link për reset (kontrollo inbox/spam)."
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Kërkesa dështoi. Provo përsëri.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center p-4 transition-colors duration-300">
    <div className="w-full max-w-[420px] rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-[var(--text-main)]">
        Forgot Password
      </h2>
      <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
        Enter your email and we’ll send a reset link.
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
            Email
          </label>

          <input
            type="email"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--accent)] px-3 py-2.5 text-[var(--text-main)]
                       placeholder:text-[var(--text-muted)] outline-none transition
                       focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="name@example.com"
          />
        </div>

        <button
          className="w-full rounded-lg bg-[var(--primary)] py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Duke dërguar..." : "Send reset link"}
        </button>
      </form>
    </div>
  </div>
);
}
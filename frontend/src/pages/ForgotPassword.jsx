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
    <div className="min-h-screen bg-[var(--bg-light)] flex justify-center items-center p-4 transition-colors duration-300">
      <div className="bg-[var(--card-bg)] p-8 w-full max-w-[400px] rounded-xl shadow-lg border border-[var(--border)]">
        <h2 className="text-[var(--text-main)] text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {error && (
          <div style={{ marginBottom: 12, color: "crimson", fontSize: 14 }} className="bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}
        {message && (
          <div style={{ marginBottom: 12, color: "green", fontSize: 14 }} className="bg-green-500/10 p-2 rounded">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-main)]">Email</label>
            <input
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Shkruaj email-in tuaj"
            />
          </div>

          <button 
            className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all" 
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
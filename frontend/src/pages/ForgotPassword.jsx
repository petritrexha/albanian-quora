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
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Forgot Password</h2>

        {error && (
          <div style={{ marginBottom: 12, color: "crimson", fontSize: 14 }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ marginBottom: 12, color: "green", fontSize: 14 }}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Duke dërguar..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
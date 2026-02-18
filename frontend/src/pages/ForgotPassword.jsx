import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Shkruaj email-in.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      if (typeof res?.exists === "boolean") {
        if (!res.exists) setError("Ky email nuk ekziston.");
        else setMessage("Email ekziston. Kontrollo inbox për udhëzimet.");
      } else {
        setMessage("Nëse email ekziston, do të pranosh udhëzime në inbox.");
      }
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

        {error && <div style={{ marginBottom: 12, color: "crimson", fontSize: 14 }}>{error}</div>}
        {message && <div style={{ marginBottom: 12, color: "green", fontSize: 14 }}>{message}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Duke dërguar..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}

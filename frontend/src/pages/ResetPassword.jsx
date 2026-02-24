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
      setTimeout(() => navigate("/login", { replace: true }), 900);
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
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Reset Password</h2>

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
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Duke ruajtur..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
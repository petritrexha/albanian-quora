import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const passwordPolicy = (pw) => {
  if (pw.length < 8 || pw.length > 64) return "Password duhet të jetë 8–64 karaktere.";
  if (!/[a-z]/.test(pw)) return "Password duhet të ketë të paktën 1 shkronjë të vogël.";
  if (!/[A-Z]/.test(pw)) return "Password duhet të ketë të paktën 1 shkronjë të madhe.";
  if (!/[0-9]/.test(pw)) return "Password duhet të ketë të paktën 1 digit.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password duhet të ketë të paktën 1 karakter special.";
  return "";
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim() || !form.confirm.trim()) {
      setError("Plotëso të gjitha fushat.");
      return;
    }

    const policyErr = passwordPolicy(form.password);
    if (policyErr) {
      setError(policyErr);
      return;
    }

    if (form.password !== form.confirm) {
      setError("Password dhe Confirm Password nuk përputhen.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirm, // ✅ REQUIRED by backend
      });

      // zakonisht backend kthen token+user; kjo autoLoggedIn mund mos ekzistojë
      if (res?.token) navigate("/", { replace: true });
      else navigate("/login", { replace: true });
    } catch (err) {
      const res = err?.response;

      if (!res) {
        setError("S’u lidhëm me serverin. Kontrollo a është ndezur backend-i.");
        return;
      }

      if (res.data?.errors) {
        const entries = Object.entries(res.data.errors);
        if (entries.length) {
          const [field, msgs] = entries[0];
          setError(`${field}: ${msgs?.[0] || "Invalid value."}`);
          return;
        }
      }

      setError(res.data?.message || res.data?.error || `Register dështoi (${res.status}).`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Register</h2>

        {error && (
          <div style={{ marginBottom: 12, color: "crimson", fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} autoComplete="name" />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={onChange} autoComplete="username" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={onChange} autoComplete="email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              autoComplete="new-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Duke u regjistruar..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
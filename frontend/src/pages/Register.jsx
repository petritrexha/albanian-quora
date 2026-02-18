import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Plotëso të gjitha fushat.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password duhet të ketë së paku 6 karaktere.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Password dhe Confirm Password nuk përputhen.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (res?.autoLoggedIn) navigate("/", { replace: true });
      else navigate("/login", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Register dështoi. Provo përsëri.";
      setError(msg);
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

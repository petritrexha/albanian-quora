import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link here
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

    if (!form.name || !form.username || !form.email || !form.password || !form.confirm) {
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
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirm,
      });

      navigate("/", { replace: true });
    } catch (err) {
      const res = err?.response;
      setError(
        res?.data?.message ||
          res?.data?.error ||
          `Register dështoi (${res?.status || "server"}).`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex justify-center items-center p-6 transition-colors duration-300">
      <div className="bg-[var(--card-bg)] p-10 w-full max-w-[400px] rounded-xl shadow-lg border border-[var(--border)]">
        <h2 className="mb-6 text-[var(--text-main)] text-2xl font-bold text-center">Register</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border-l-4 border-red-500 text-red-500 text-sm leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-main)] font-medium">Name</label>
            <input 
              name="name" 
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={form.name} 
              onChange={onChange} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-main)] font-medium">Username</label>
            <input 
              name="username" 
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={form.username} 
              onChange={onChange} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-main)] font-medium">Email</label>
            <input 
              name="email" 
              type="email"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={form.email} 
              onChange={onChange} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-main)] font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-main)] font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
              value={form.confirm}
              onChange={onChange}
            />
          </div>

          <button 
            className="w-full mt-2 p-3 bg-[var(--primary)] border-none rounded-lg text-white font-bold cursor-pointer transition-all duration-200 hover:opacity-90 disabled:opacity-50" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Duke u regjistruar..." : "Register"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-[var(--text-light)]">
          Keni një llogari? <Link to="/login" className="text-[var(--primary)] font-semibold hover:underline">Kyçu këtu</Link>
        </p>
      </div>
    </div>
  );
}
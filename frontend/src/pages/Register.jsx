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
    <div className="min-h-screen bg-[#fafafa] flex justify-center items-center p-6">
      <div className="bg-white p-10 w-full max-w-[400px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <h2 className="mb-6 text-[#334155] text-2xl font-bold text-center">Register</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-[#dc143c] text-sm leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#334155] font-medium">Name</label>
            <input 
              name="name" 
              className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0ea5e9] transition-all"
              value={form.name} 
              onChange={onChange} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#334155] font-medium">Username</label>
            <input 
              name="username" 
              className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0ea5e9] transition-all"
              value={form.username} 
              onChange={onChange} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#334155] font-medium">Email</label>
            <input 
              name="email" 
              type="email"
              className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0ea5e9] transition-all"
              value={form.email} 
              onChange={onChange} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#334155] font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0ea5e9] transition-all"
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#334155] font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0ea5e9] transition-all"
              value={form.confirm}
              onChange={onChange}
            />
          </div>

          <button 
            className="w-full mt-2 p-3 bg-[#0ea5e9] border-none rounded-lg text-white font-bold cursor-pointer transition-colors duration-200 hover:bg-[#0284c7] disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Duke u regjistruar..." : "Register"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-[#64748b]">
          Keni një llogari? <a href="/login" className="text-[#0ea5e9] font-semibold hover:underline">Kyçu këtu</a>
        </p>
      </div>
    </div>
  );
}
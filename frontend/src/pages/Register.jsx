import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link here
import { useAuth } from "../context/AuthContext";

const passwordPolicy = (pw) => {
  if (pw.length < 8 || pw.length > 64)
    return "Password duhet të jetë 8–64 karaktere.";
  if (!/[a-z]/.test(pw))
    return "Password duhet të ketë të paktën 1 shkronjë të vogël.";
  if (!/[A-Z]/.test(pw))
    return "Password duhet të ketë të paktën 1 shkronjë të madhe.";
  if (!/[0-9]/.test(pw)) return "Password duhet të ketë të paktën 1 digit.";
  if (!/[^A-Za-z0-9]/.test(pw))
    return "Password duhet të ketë të paktën 1 karakter special.";
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

    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirm
    ) {
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
          `Register dështoi (${res?.status || "server"}).`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 relative overflow-hidden p-6 transition-colors duration-300">
      {/* Background blur shapes */}
      <div className="absolute w-80 h-80 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-80 h-80 bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 w-full max-w-[420px] p-10 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700/40 shadow-2xl animate-[fadeIn_0.6s_ease]">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
          Krijo Llogari
        </h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border border-red-200/40 dark:border-red-800/40 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* Emri */}
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder=" "
              className="peer w-full p-3 pt-7 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-sm text-gray-800 dark:text-white
                       focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-500/50
                       focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
            />
            <label
              className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200
                            peer-placeholder-shown:top-4
                            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                            peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Emri
            </label>
          </div>

          {/* Përdoruesi */}
          <div className="relative">
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder=" "
              className="peer w-full p-3 pt-7 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-sm text-gray-800 dark:text-white
                       focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-500/50
                       focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
            />
            <label
              className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200
                            peer-placeholder-shown:top-4
                            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                            peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Emri i përdoruesit
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder=" "
              className="peer w-full p-3 pt-7 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-sm text-gray-800 dark:text-white
                       focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-500/50
                       focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
            />
            <label
              className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200
                            peer-placeholder-shown:top-4
                            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                            peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Email
            </label>
          </div>

          {/* Fjalëkalimi */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder=" "
              className="peer w-full p-3 pt-7 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-sm text-gray-800 dark:text-white
                       focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-500/50
                       focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
            />
            <label
              className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200
                            peer-placeholder-shown:top-4
                            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                            peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Fjalëkalimi
            </label>
          </div>

          {/* Konfirmo Fjalëkalimin */}
          <div className="relative">
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              placeholder=" "
              className="peer w-full p-3 pt-7 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 text-sm text-gray-800 dark:text-white
                       focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-500/50
                       focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
            />
            <label
              className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200
                            peer-placeholder-shown:top-4
                            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                            peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Konfirmo Fjalëkalimin
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold 
                     bg-gradient-to-r from-blue-600 to-indigo-600 
                     shadow-lg hover:shadow-xl hover:scale-[1.02] 
                     active:scale-[0.98] transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Keni një llogari?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Kyçu këtu
          </Link>
        </p>
      </div>
    </div>
  );
}

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
      setTimeout(() => navigate("/login", { replace: true }), 1500);
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
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 flex items-center justify-center p-4 font-sans transition-colors duration-300">
    <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
        Reset Password
      </h2>
      <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Create a new password for your account.
      </p>

      {(error || message) && (
        <div className="mt-5 space-y-3">
          {error && (
            <div className="rounded-lg border border-red-500/30 dark:border-red-800/40 bg-red-500/10 dark:bg-red-500/20 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-green-500/30 dark:border-green-800/40 bg-green-500/10 dark:bg-green-500/20 px-3 py-2 text-sm text-green-700 dark:text-green-400">
              {message}
            </div>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            New Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-gray-800 dark:text-white
                       placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition
                       focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-gray-800 dark:text-white
                       placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition
                       focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <button
          className="w-full rounded-lg bg-blue-600 dark:bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Duke ruajtur..." : "Reset password"}
        </button>
      </form>
    </div>
  </div>
);
}
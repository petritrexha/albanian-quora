import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Verify2FA() {
  const navigate = useNavigate();
  const location = useLocation();

  const { verify2fa, resend2fa } = useAuth();

  const attemptFromState = location.state?.loginAttemptId;

  useEffect(() => {
    if (attemptFromState) {
      localStorage.setItem("loginAttemptId", String(attemptFromState));
    }
  }, [attemptFromState]);

  const loginAttemptId = useMemo(() => {
    const fromState = attemptFromState;
    const fromStorage = localStorage.getItem("loginAttemptId");
    return fromState ?? (fromStorage ? Number(fromStorage) : null);
  }, [attemptFromState]);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const canSubmit = useMemo(() => /^\d{6}$/.test(code), [code]);

  useEffect(() => {
    if (!loginAttemptId) navigate("/login", { replace: true });
  }, [loginAttemptId, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;

    try {
      setLoading(true);

      await verify2fa({ loginAttemptId, code }); // ✅ sets user immediately in context

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError("");
    if (!loginAttemptId) return;

    try {
      setResendLoading(true);
      await resend2fa({ loginAttemptId });
      setCooldown(30);
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 429) {
        setCooldown(30);
        setError(msg || "Please wait before resending.");
      } else {
        setError(msg || "Unable to resend code.");
      }
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Verify code</h1>
        <p className="text-sm text-slate-600 mb-6">
          We sent a 6-digit code to your email. It expires in 5 minutes.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            placeholder="Enter 6-digit code"
            inputMode="numeric"
            autoFocus
          />

          <button
            disabled={!canSubmit || loading}
            className="w-full rounded-lg py-2 font-medium bg-slate-900 text-white disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onResend}
            disabled={resendLoading || cooldown > 0}
            className="text-sm font-medium text-slate-900 disabled:opacity-60"
            type="button"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resendLoading
              ? "Sending..."
              : "Resend code"}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("loginAttemptId");
              navigate("/login");
            }}
            className="text-sm text-slate-600"
            type="button"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
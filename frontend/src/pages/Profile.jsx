import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../services/userService";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id && !user?.Id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user.id || user.Id;
        const data = await getUserProfile(userId);
        if (cancelled) return;

        setProfile(data);
        setForm({
          username: data.username || data.Username || "",
          name:
            data.fullName ||
            data.FullName ||
            data.name ||
            data.Name ||
            "",
          bio: data.bio || data.Bio || "",
        });
      } catch {
        if (!cancelled)
          setError("Nuk mund të ngarkoj profilin. Provo përsëri.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.id || user?.Id;
    if (!userId) return;

    setSaving(true);
    setError(null);

    try {
      await updateUserProfile(userId, {
        username: form.username.trim() || null,
        name: form.name.trim() || null,
        bio: form.bio.trim(),
      });

      const refreshed = await getUserProfile(userId);
      setProfile(refreshed);
      setEditing(false);
    } catch {
      setError("Nuk mund të ruaj ndryshimet. Provo përsëri.");
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading || error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <p className={error ? "text-red-500" : "text-slate-500"}>
            {error ||
              (loading
                ? "Duke ngarkuar profilin..."
                : "Duhet të jeni i kyçur.")}
          </p>
        </div>
      </div>
    );
  }

  const joined =
    profile?.joinedAt || profile?.JoinedAt
      ? new Date(
          profile.joinedAt || profile.JoinedAt
        ).toLocaleDateString("sq-AL", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col gap-10">

      {/* PROFILE HEADER */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200 p-8 overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-6">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 
                          text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            {(profile.username || profile.Username)?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {profile.username || profile.Username}
            </h1>

            <p className="text-sm text-slate-500">
              {profile.email || profile.Email}
            </p>

            {joined && (
              <p className="text-xs text-slate-400 mt-1 italic">
                Anëtar që nga {joined}
              </p>
            )}
          </div>
        </div>

        {(profile.bio || profile.Bio) && !editing && (
          <p className="mt-6 text-slate-700 italic border-l-4 border-blue-500 pl-4">
            "{profile.bio || profile.Bio}"
          </p>
        )}

        <button
          className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
          ${
            editing
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
          }`}
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Anulo" : "Ndrysho profilin"}
        </button>

        {editing && (
          <form
            className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-6"
            onSubmit={handleSubmit}
          >
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
            />

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Emri i plotë"
              className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
            />

            <textarea
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-200 resize-none"
            />

            <button
              type="submit"
              disabled={saving}
              className="self-start px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
            </button>
          </form>
        )}
      </div>

      {/* ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* QUESTIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Pyetjet e mia
          </h2>

          {(profile.questions || profile.Questions)?.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              Nuk keni bërë pyetje ende.
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {(profile.questions || profile.Questions)?.map((q) => (
                <li key={q.id || q.Id}>
                  <Link
                    to={`/question/${q.id || q.Id}`}
                    className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                  >
                    {q.title || q.Title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ANSWERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Përgjigjet e mia
          </h2>

          {(profile.answers || profile.Answers)?.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              Nuk keni dhënë përgjigje ende.
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {(profile.answers || profile.Answers)?.map((a) => (
                <li key={a.id || a.Id}>
                  <Link
                    to={`/question/${a.questionId || a.QuestionId}`}
                    className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                  >
                    {a.content || a.Content}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
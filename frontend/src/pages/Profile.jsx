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
          name: data.fullName || data.FullName || data.name || data.Name || "",
          bio: data.bio || data.Bio || "",
        });
      } catch (err) {
        if (cancelled) return;
        setError("Nuk mund të ngarkoj profilin. Provo përsëri.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
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
    } catch (err) {
      setError("Nuk mund të ruaj ndryshimet. Provo përsëri.");
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading || error) {
    return (
      <div className="max-w-[960px] mx-auto my-8 px-4 flex flex-col items-center">
        <div className="w-full bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-8 text-center shadow-sm">
          <p className={error ? "text-red-500" : "text-[var(--text-light)]"}>
            {error || (loading ? "Duke ngarkuar profilin..." : "Duhet të jeni i kyçur.")}
          </p>
        </div>
      </div>
    );
  }

  const joined = (profile?.joinedAt || profile?.JoinedAt)
    ? new Date(profile.joinedAt || profile.JoinedAt).toLocaleDateString("sq-AL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-[960px] mx-auto my-8 px-4 flex flex-col gap-8 pb-12 transition-colors duration-300">
      {/* Profile Info Card */}
      <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] p-7 md:p-8">
        <div className="flex items-center gap-5 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {(profile.username || profile.Username)?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] leading-tight">
                {profile.username || profile.Username}
            </h1>
            <p className="text-sm text-[var(--text-light)]">{profile.email || profile.Email}</p>
            {joined && <p className="text-xs text-[var(--text-light)] opacity-70 mt-1 font-medium italic">Anëtar që nga {joined}</p>}
          </div>
        </div>

        {(profile.bio || profile.Bio) && !editing && (
          <p className="mt-3 text-[var(--text-main)] italic border-l-4 border-[var(--primary)] pl-4 py-1 leading-relaxed opacity-90">
            "{profile.bio || profile.Bio}"
          </p>
        )}

        <button
          className={`mt-5 px-5 py-2 rounded-full border transition-all text-sm font-semibold ${
            editing 
            ? "border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] hover:opacity-80" 
            : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white hover:shadow-md"
          }`}
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Anulo" : "Ndrysho profilin"}
        </button>

        {editing && (
          <form className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">Username</label>
              <input
                name="username"
                className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--accent)] text-[var(--text-main)]"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">Emri i plotë</label>
              <input 
                name="name" 
                className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--accent)] text-[var(--text-main)]"
                value={form.name} 
                onChange={handleChange} 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">Bio</label>
              <textarea
                name="bio"
                rows={3}
                className="w-full p-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--accent)] text-[var(--text-main)] resize-none"
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="self-start mt-2 px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded-full shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
            </button>
          </form>
        )}
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] p-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></span>
            Pyetjet e mia
          </h2>
          {(profile.questions || profile.Questions)?.length === 0 ? (
            <p className="text-sm text-[var(--text-light)] italic">Ende nuk keni bërë pyetje.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {(profile.questions || profile.Questions)?.map((q) => (
                <li key={q.id || q.Id}>
                  <Link to={`/question/${q.id || q.Id}`} className="flex flex-col gap-1 group no-underline">
                    <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
                      {q.title || q.Title}
                    </span>
                    <span className="text-[10px] text-[var(--text-light)] uppercase tracking-tighter">
                      {new Date(q.createdAt || q.CreatedAt).toLocaleDateString("sq-AL")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] p-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            Përgjigjet e mia
          </h2>
          {(profile.answers || profile.Answers)?.length === 0 ? (
            <p className="text-sm text-[var(--text-light)] italic">Ende nuk keni dhënë përgjigje.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {(profile.answers || profile.Answers)?.map((a) => (
                <li key={a.id || a.Id}>
                  <Link to={`/question/${a.questionId || a.QuestionId}`} className="flex flex-col gap-1 group no-underline">
                    <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
                      {(a.questionTitle || a.QuestionTitle) && <span className="text-purple-500 font-bold text-xs">RE: </span>}
                      {a.content || a.Content}
                    </span>
                    <span className="text-[10px] text-[var(--text-light)] uppercase tracking-tighter">
                      {new Date(a.createdAt || a.CreatedAt).toLocaleDateString("sq-AL")}
                    </span>
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
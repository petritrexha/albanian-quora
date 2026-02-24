import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../services/userService";
import "../styles/profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile(user.id);
        if (cancelled) return;
        setProfile(data);
        setForm({
          username: data.username || "",
          name: data.fullName || "",
          bio: data.bio || "",
        });
      } catch (err) {
        if (cancelled) return;
        setError("Nuk mund të ngarkoj profilin. Provo përsëri.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setError(null);
    try {
      await updateUserProfile(user.id, {
        username: form.username.trim() || null,
        name: form.name.trim() || null,
        bio: form.bio.trim(),
      });

      // Refresh profile after successful save
      const refreshed = await getUserProfile(user.id);
      setProfile(refreshed);
      setEditing(false);
    } catch (err) {
      setError("Nuk mund të ruaj ndryshimet. Provo përsëri.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Duhet të jeni i kyçur për të parë profilin.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Duke ngarkuar profilin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="profile-error">{error}</p>
        </div>
      </div>
    );
  }

  const joined = profile?.joinedAt
    ? new Date(profile.joinedAt).toLocaleDateString("sq-AL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-circle">
            {profile.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1>{profile.username}</h1>
            <p className="profile-email">{profile.email}</p>
            {joined && <p className="profile-joined">Anëtar që nga {joined}</p>}
          </div>
        </div>

        {profile.bio && !editing && (
          <p className="profile-bio">"{profile.bio}"</p>
        )}

        <button
          className="profile-edit-btn"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Anulo" : "Ndrysho profilin"}
        </button>

        {editing && (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Emri i plotë</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
            </button>
          </form>
        )}
      </div>

      <div className="profile-lists">
        <div className="profile-section">
          <h2>Pyetjet e mia</h2>
          {profile.questions?.length === 0 && (
            <p className="profile-empty">Ende nuk keni bërë pyetje.</p>
          )}
          <ul>
            {profile.questions?.map((q) => (
              <li key={q.id}>
                <span className="item-title">{q.title}</span>
                <span className="item-date">
                  {new Date(q.createdAt).toLocaleDateString("sq-AL")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-section">
          <h2>Përgjigjet e mia</h2>
          {profile.answers?.length === 0 && (
            <p className="profile-empty">Ende nuk keni dhënë përgjigje.</p>
          )}
          <ul>
            {profile.answers?.map((a) => (
              <li key={a.id}>
                <span className="item-title">
                  {a.questionTitle
                    ? `${a.questionTitle} — `
                    : ""}
                  {a.content.length > 80
                    ? `${a.content.slice(0, 80)}...`
                    : a.content}
                </span>
                <span className="item-date">
                  {new Date(a.createdAt).toLocaleDateString("sq-AL")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


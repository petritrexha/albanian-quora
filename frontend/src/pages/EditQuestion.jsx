import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditQuestion.css";

const API_URL = "https://localhost:7286/api";

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState([]);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      try {
        const catRes = await fetch(`${API_URL}/Categories`);
        const tagRes = await fetch(`${API_URL}/Tags`);

        setCategories(await catRes.json());
        setTags(await tagRes.json());
      } catch (err) {
        console.error(err);
      }
    }

    loadMeta();
  }, []);

  useEffect(() => {
    if (tags.length === 0) return;

    async function loadQuestion() {
      try {
        const res = await fetch(`${API_URL}/Questions/${id}`);
        const data = await res.json();

        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.categoryId);

        if (data.tags) {
          setTagIds(
            data.tags
              .map((name) => tags.find((t) => t.name === name)?.id)
              .filter(Boolean)
          );
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    loadQuestion();
  }, [id, tags]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Titulli është i detyrueshëm.");
    if (!content.trim()) return alert("Përmbajtja është e detyrueshme.");
    if (!categoryId) return alert("Zgjidh një kategori.");
    if (!tagIds.length) return alert("Zgjidh të paktën një tag.");

    try {
      const res = await fetch(`${API_URL}/Questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          categoryId: Number(categoryId),
          tagIds,
        }),
      });

      if (res.ok) navigate("/");
      else alert("Përditësimi dështoi.");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container fade-in">
      <div className="card">
        <h2>Edit Question</h2>

        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-container">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`tag-pill ${
                  tagIds.includes(tag.id) ? "active" : ""
                }`}
                onClick={() =>
                  setTagIds((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((t) => t !== tag.id)
                      : [...prev, tag.id]
                  )
                }
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} className="primary-btn">
          Update Question
        </button>
      </div>
    </div>
  );
}

import useCategories from "../../hooks/useCategories"

export default function CategoryDropdown({ value, onChange }) {
  const { categories, loading } = useCategories()

  if (loading) {
    return (
      <select className="border p-2 rounded w-full">
        <option>Loading...</option>
      </select>
    )
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border p-2 rounded w-full"
    >
      <option value="">Select category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}
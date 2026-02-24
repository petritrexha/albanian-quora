import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/admin/stats");
        setStats(r.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/admin/users", { params: { page, pageSize } });
        setUsers(r.data.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [page, pageSize]);

  const deleteUser = async (id) => {
    if (!confirm("Delete user? This action cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      alert("Failed to delete user.");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Signed in as: {user?.username} ({user?.role})</p>

      <section className="mt-4">
        <h2 className="text-xl">Stats</h2>
        {stats ? (
          <ul>
            <li>Users: {stats.users}</li>
            <li>Questions: {stats.questions}</li>
            <li>Answers: {stats.answers}</li>
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </section>

      <section className="mt-4">
        <h2 className="text-xl">Users</h2>
        <table className="min-w-full mt-2 border">
          <thead>
            <tr>
              <th className="p-2 border">Id</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">
                  <button onClick={() => deleteUser(u.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

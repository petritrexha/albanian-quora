import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // 'users', 'questions', 'answers'
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch Stats
  const fetchStats = () => {
    api.get("/api/admin/stats")
      .then(r => setStats(r.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch Data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/api/admin/${activeTab}`);
      // Normalizing the response for different JSON formats
      const list = Array.isArray(r.data) ? r.data : (r.data.data || r.data.Data || []);
      setDataList(list);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for any type of deletion with a SAFETY GUARD for Admin
  const openDeleteModal = (id) => {
    // Safety check: Prevent Admin from deleting their own account
    const currentUserId = currentUser?.id || currentUser?.Id;
    if (activeTab === "users" && id === currentUserId) {
      alert("Siguria: Nuk mund të fshini llogarinë tuaj aktuale nga paneli i adminit!");
      return;
    }

    setItemToDelete(id);
    setIsModalOpen(true);
  };

  // The actual API call after user confirms in the modal
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/api/admin/${activeTab}/${itemToDelete}`);
      
      // Remove the item from the local UI list
      setDataList(dataList.filter(item => (item.id || item.Id) !== itemToDelete));
      
      // Refresh the numbers at the top
      fetchStats();
    } catch (e) {
      alert("Fshirja dështoi. Serveri nuk u përgjigj.");
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-8 bg-[var(--bg-light)] min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Paneli i Adminit</h1>
          <p className="text-[var(--text-light)] font-medium">Administratori: {currentUser?.username}</p>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {['users', 'questions', 'answers'].map((key) => (
            <div key={key} className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--border)]">
              <h3 className="text-[var(--text-light)] uppercase text-[10px] font-black tracking-widest mb-1">
                {key === 'users' ? 'Përdorues' : key === 'questions' ? 'Pyetje' : 'Përgjigje'}
              </h3>
              <p className="text-3xl font-bold text-[var(--primary)]">
                {stats ? (stats[key] ?? stats[key.charAt(0).toUpperCase() + key.slice(1)]) : "0"}
              </p>
            </div>
          ))}
        </section>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-[var(--accent)] p-1 rounded-xl w-fit">
          {['users', 'questions', 'answers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? "bg-[var(--card-bg)] text-[var(--primary)] shadow-sm" 
                  : "text-[var(--text-light)] hover:text-[var(--text-main)]"
              }`}
            >
              {tab === 'users' ? 'Përdoruesit' : tab === 'questions' ? 'Pyetjet' : 'Përgjigjet'}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <section className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--accent)] text-[var(--text-light)] text-xs font-bold uppercase">
              <tr>
                <th className="p-4 border-b border-[var(--border)]">
                  {activeTab === 'users' ? 'Përdoruesi / Detajet' : 'Përmbajtja e tekstit'}
                </th>
                {activeTab !== 'users' && <th className="p-4 border-b border-[var(--border)]">Autori</th>}
                <th className="p-4 border-b border-[var(--border)] text-right">Veprimet</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="3" className="p-16 text-center text-[var(--text-light)] animate-pulse">Duke u ngarkuar...</td></tr>
              ) : dataList.length === 0 ? (
                <tr><td colSpan="3" className="p-16 text-center text-[var(--text-light)] italic">Nuk u gjet asnjë rekord në këtë kategori.</td></tr>
              ) : (
                dataList.map((item) => (
                  <tr key={item.id || item.Id} className="hover:bg-[var(--accent)] transition-colors">
                    <td className="p-4 border-b border-[var(--border)]">
                      <div className="font-semibold text-[var(--text-main)]">
                        {item.username || item.Username || item.content || item.Content || item.title || item.Title}
                      </div>
                      {item.email && <div className="text-xs text-[var(--text-light)] mt-0.5">{item.email}</div>}
                    </td>
                    {activeTab !== 'users' && (
                      <td className="p-4 border-b border-[var(--border)] text-[var(--text-light)] font-medium">
                        {item.username || item.Username || "I panjohur"}
                      </td>
                    )}
                    <td className="p-4 border-b border-[var(--border)] text-right">
                      <button 
                        onClick={() => openDeleteModal(item.id || item.Id)}
                        className="px-4 py-1.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* The Modern Modal */}
        <DeleteConfirmModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Konfirmoni Fshirjen"
          message={`A jeni vërtet i sigurt që dëshironi ta fshini këtë ${
            activeTab === 'users' ? 'përdorues' : 
            activeTab === 'questions' ? 'pyetje' : 'përgjigje'
          }? Ky veprim do të fshijë përgjithmonë të dhënat nga baza e të dhënave.`}
        />
      </div>
    </div>
  );
}
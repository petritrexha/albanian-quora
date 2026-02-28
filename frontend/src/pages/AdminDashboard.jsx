import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchStats = () => {
    api.get("/api/admin/stats")
      .then(r => setStats(r.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/api/admin/${activeTab}`);
      const list = Array.isArray(r.data) ? r.data : (r.data.data || r.data.Data || []);
      setDataList(list);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    const currentUserId = currentUser?.id || currentUser?.Id;
    if (activeTab === "users" && id === currentUserId) {
      alert("Siguria: Nuk mund të fshini llogarinë tuaj aktuale nga paneli i adminit!");
      return;
    }
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/api/admin/${activeTab}/${itemToDelete}`);
      setDataList(dataList.filter(item => (item.id || item.Id) !== itemToDelete));
      fetchStats();
    } catch (e) {
      alert("Fshirja dështoi. Serveri nuk u përgjigj.");
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 transition-colors duration-300
                    bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Paneli i Adminit
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Administratori: {currentUser?.username}
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {['users', 'questions', 'answers'].map((key) => (
            <div
              key={key}
              className="p-7 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                         bg-white border border-slate-200
                         dark:bg-gradient-to-br dark:from-slate-800 dark:to-indigo-900/20 dark:border-slate-700/50"
            >
              <h3 className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-widest mb-2">
                {key === 'users' ? 'Përdorues' : key === 'questions' ? 'Pyetje' : 'Përgjigje'}
              </h3>
              <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                {stats ? (stats[key] ?? stats[key.charAt(0).toUpperCase() + key.slice(1)]) : "0"}
              </p>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 rounded-2xl w-fit
                        bg-slate-100 dark:bg-slate-800">
          {['users', 'questions', 'answers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
              ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md scale-[1.03]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {tab === 'users' ? 'Përdoruesit' : tab === 'questions' ? 'Pyetjet' : 'Përgjigjet'}
            </button>
          ))}
        </div>

        {/* Table */}
        <section className="rounded-2xl shadow-sm overflow-hidden
                            bg-white border border-slate-200
                            dark:bg-slate-800 dark:border-slate-700/50">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-bold uppercase
                              bg-slate-50 text-slate-500
                              dark:bg-slate-700/50 dark:text-slate-400">
              <tr>
                <th className="p-5 border-b border-slate-200 dark:border-slate-700">
                  {activeTab === 'users' ? 'Përdoruesi / Detajet' : 'Përmbajtja e tekstit'}
                </th>
                {activeTab !== 'users' && (
                  <th className="p-5 border-b border-slate-200 dark:border-slate-700">Autori</th>
                )}
                <th className="p-5 border-b border-slate-200 dark:border-slate-700 text-right">Veprimet</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center text-slate-500 dark:text-slate-400 animate-pulse">
                    Duke u ngarkuar...
                  </td>
                </tr>
              ) : dataList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg">
                        📭
                      </div>
                      <p className="italic">
                        Nuk u gjet asnjë rekord në këtë kategori.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                dataList.map((item) => (
                  <tr
                    key={item.id || item.Id}
                    className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="p-5 border-b border-slate-200 dark:border-slate-700">
                      <div className="font-semibold text-slate-800 dark:text-white">
                        {item.username || item.Username || item.content || item.Content || item.title || item.Title}
                      </div>
                      {item.email && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.email}
                        </div>
                      )}
                    </td>

                    {activeTab !== 'users' && (
                      <td className="p-5 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                        {item.username || item.Username || "I panjohur"}
                      </td>
                    )}

                    <td className="p-5 border-b border-slate-200 dark:border-slate-700 text-right">
                      <button
                        onClick={() => openDeleteModal(item.id || item.Id)}
                        className="px-4 py-1.5 rounded-full font-bold text-xs
                        bg-red-500/10 text-red-500
                        hover:bg-red-500 hover:text-white
                        hover:shadow-lg hover:shadow-red-500/20
                        transition-all duration-200"
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

        {/* Modal */}
        <DeleteConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Konfirmoni Fshirjen"
          message={`A jeni vërtet i sigurt që dëshironi ta fshini këtë ${
            activeTab === 'users'
              ? 'përdorues'
              : activeTab === 'questions'
              ? 'pyetje'
              : 'përgjigje'
          }? Ky veprim do të fshijë përgjithmonë të dhënat nga baza e të dhënave.`}
        />
      </div>
    </div>
  );
}
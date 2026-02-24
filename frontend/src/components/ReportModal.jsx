import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaFlag, FaTimes } from "react-icons/fa";

const reportReasons = [
  "Përmbajtje e papërshtatshme",
  "Spam ose reklamë",
  "Informacion i rremë",
  "Gjuhë ofenduese",
  "Tjetër",
];

const ReportModal = ({ isOpen, onClose, targetType, targetId }) => {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Tjetër" ? customReason : selectedReason;

    if (!reason.trim()) return;

    setLoading(true);

    try {
      const reporterId =
        user?.id || Number(localStorage.getItem("userId")) || 1;

      await api.post("/api/reports", {
        reporterId,
        targetType,
        targetId,
        reason,
      });
    } catch (error) {
      console.error("Failed to submit report", error);
    }

    setLoading(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason("");
      setCustomReason("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[50]" 
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[480px] rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FaFlag className="text-[#ef4444]" />
            <h2 className="m-0 text-lg font-semibold text-[var(--text-main)]">
              Raporto {targetType === "Question" ? "pyetjen" : "përgjigjen"}
            </h2>
          </div>

          <button
            className="border-none bg-transparent cursor-pointer p-1.5 rounded-md text-[var(--text-light)] hover:bg-[#f3f4f6] hover:text-[var(--text-main)] transition-colors"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-[18px] px-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-[22px]">
                ✓
              </div>
              <p className="font-semibold text-[var(--text-main)] m-0">
                Raporti u dërgua me sukses!
              </p>
              <p className="text-sm text-[var(--text-light)] mt-1 m-0">
                Faleminderit për kontributin tuaj.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-light)] mb-3 m-0">
                Zgjedh arsyen e raportimit:
              </p>

              <div className="flex flex-col gap-2">
                {reportReasons.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 border rounded-lg cursor-pointer transition-all duration-150 ${
                      selectedReason === reason 
                      ? "border-[var(--primary)] bg-[var(--accent)]" 
                      : "border-[var(--border)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      className="accent-[var(--primary)]"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                    />
                    <span className="text-sm text-[var(--text-main)]">{reason}</span>
                  </label>
                ))}
              </div>

              {selectedReason === "Tjetër" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Përshkruaj arsyen..."
                  className="w-full mt-3 p-2.5 border border-[var(--border)] rounded-lg resize-y focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex justify-end gap-2.5 p-3.5 px-5 border-t border-[var(--border)]">
            <button
              onClick={handleClose}
              className="px-3.5 py-2 rounded-md border-none bg-[#f3f4f6] text-[var(--text-main)] cursor-pointer hover:bg-[#e5e7eb] transition-colors"
            >
              Anulo
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                !selectedReason ||
                (selectedReason === "Tjetër" && !customReason.trim()) ||
                loading
              }
              className="px-3.5 py-2 rounded-md border-none bg-[#ef4444] text-white cursor-pointer hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Duke dërguar..." : "Dërgo raportin"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;

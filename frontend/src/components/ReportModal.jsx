import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaFlag, FaTimes, FaCheck } from "react-icons/fa";

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

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Tjetër" ? customReason : selectedReason;

    if (!reason.trim()) return;

    setLoading(true);

    try {
      const reporterId =
        user?.id || Number(localStorage.getItem("userId")) || 1;

      await api.post("reports", {
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
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setSubmitted(false);
    onClose();
  };

  const disabled =
    !selectedReason ||
    (selectedReason === "Tjetër" && !customReason.trim()) ||
    loading;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/40 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900
                   rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800
                   animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-red-500">
            <FaFlag />
            <h2 className="font-semibold text-slate-800 dark:text-white">
              Raporto {targetType === "Question" ? "pyetjen" : "përgjigjen"}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full
                              bg-green-100 dark:bg-green-500/20
                              text-green-600 flex items-center justify-center text-xl">
                <FaCheck />
              </div>
              <p className="font-semibold text-slate-800 dark:text-white">
                Raporti u dërgua!
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Faleminderit për kontributin tuaj.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Zgjidh arsyen e raportimit:
              </p>

              <div className="flex flex-col gap-3">
                {reportReasons.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                      ${selectedReason === reason
                        ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      className="accent-red-500"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                    />
                    <span className="text-sm text-slate-800 dark:text-slate-200">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {selectedReason === "Tjetër" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Përshkruaj arsyen..."
                  className="w-full mt-4 p-3 rounded-xl
                             border border-slate-200 dark:border-slate-700
                             bg-slate-50 dark:bg-slate-800
                             text-sm text-slate-800 dark:text-slate-200
                             focus:outline-none focus:ring-2 focus:ring-red-500
                             transition"
                  rows={3}
                />
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        {!submitted && (
          <div className="flex justify-end gap-3 p-5 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         bg-slate-100 dark:bg-slate-800
                         text-slate-700 dark:text-slate-300
                         hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Anulo
            </button>

            <button
              onClick={handleSubmit}
              disabled={disabled}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
                ${disabled
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
                }`}
            >
              {loading ? "Duke dërguar..." : "Dërgo raportin"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ReportModal;
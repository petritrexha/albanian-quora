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
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const { user } = useAuth();

    const handleSubmit = async () => {
        const reason =
            selectedReason === "Tjetër" ? customReason : selectedReason;
        if (!reason.trim()) return;

        setLoading(true);

        try {
            const reporterId = user?.id || Number(localStorage.getItem("userId")) || 1;
            await api.post("/reports", {
                reporterId,
                targetType,
                targetId,
                reason,
            });
        } catch (e) {
            console.error("Failed to submit report", e);
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
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                onClick={handleClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <FaFlag className="text-red-500" />
                            <h2 className="font-semibold text-text-main">
                                Raporto {targetType === "Question" ? "pyetjen" : "përgjigjen"}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg text-text-light hover:text-text-main hover:bg-gray-100 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4">
                        {submitted ? (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 text-xl">✓</span>
                                </div>
                                <p className="font-medium text-text-main">
                                    Raporti u dërgua me sukses!
                                </p>
                                <p className="text-sm text-text-light mt-1">
                                    Faleminderit për kontributin tuaj.
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-text-light mb-4">
                                    Zgjedh arsyen e raportimit:
                                </p>

                                <div className="flex flex-col gap-2">
                                    {reportReasons.map((reason) => (
                                        <label
                                            key={reason}
                                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-150 ${selectedReason === reason
                                                    ? "border-primary bg-accent"
                                                    : "border-border hover:border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="report-reason"
                                                value={reason}
                                                checked={selectedReason === reason}
                                                onChange={() => setSelectedReason(reason)}
                                                className="accent-primary"
                                            />
                                            <span className="text-sm text-text-main">{reason}</span>
                                        </label>
                                    ))}
                                </div>

                                {selectedReason === "Tjetër" && (
                                    <textarea
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder="Përshkruaj arsyen..."
                                        className="w-full mt-3 p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-primary"
                                        rows={3}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {!submitted && (
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm text-text-light hover:text-text-main rounded-lg hover:bg-gray-100 transition-colors"
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
                                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Duke dërguar..." : "Dërgo raportin"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReportModal;

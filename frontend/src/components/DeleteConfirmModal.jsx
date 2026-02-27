import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center
                 bg-black/40 backdrop-blur-sm px-4
                 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900
                   rounded-2xl shadow-2xl
                   max-w-sm w-full p-7
                   border border-slate-200 dark:border-slate-800
                   animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-full
                        bg-red-100 dark:bg-red-500/20
                        flex items-center justify-center
                        text-red-600 text-xl">
          <FaExclamationTriangle />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl
                       bg-slate-100 dark:bg-slate-800
                       text-slate-700 dark:text-slate-300
                       font-semibold
                       hover:bg-slate-200 dark:hover:bg-slate-700
                       transition"
          >
            Anulo
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl
                       bg-red-600 text-white font-semibold
                       hover:bg-red-700
                       shadow-md hover:shadow-lg
                       active:scale-95 transition-all"
          >
            Fshij
          </button>
        </div>
      </div>
    </div>
  );
}
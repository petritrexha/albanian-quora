import { useState } from "react";
import { FaBell, FaBookmark, FaFlag, FaInfoCircle } from "react-icons/fa";

const mockNotifications = [
  {
    id: 1,
    type: "bookmark",
    message: "Pyetja jote u ruajt me sukses.",
    isRead: false,
    createdAt: "2 min më parë",
  },
  {
    id: 2,
    type: "info",
    message: "Mirë se vini në AlbanianQuora!",
    isRead: true,
    createdAt: "1 orë më parë",
  },
];

const typeIcons = {
  bookmark: <FaBookmark />,
  report: <FaFlag />,
  info: <FaInfoCircle />,
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        className="relative bg-transparent border-none cursor-pointer p-2 rounded-lg text-[var(--text-light)] transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)]"
        onClick={() => setOpen(!open)}
        title="Njoftimet"
        aria-label="Njoftimet"
      >
        <FaBell className="text-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown Card */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold m-0 text-[var(--text-main)]">Njoftimet</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead} 
                  className="text-[11px] text-[var(--primary)] bg-transparent border-none cursor-pointer p-0 hover:underline"
                >
                  Shëno të gjitha
                </button>
              )}
            </div>

            {/* List Wrapper */}
            <div className="max-h-[260px] overflow-y-auto bg-[var(--card-bg)]">
              {notifications.length === 0 ? (
                <div className="p-7 text-center text-[13px] text-[var(--text-light)]">
                  Nuk ka njoftime.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-b-0 transition-colors duration-150 ${
                      n.isRead ? "bg-[var(--card-bg)]" : "bg-[var(--accent)]"
                    }`}
                  >
                    <div className="text-[var(--primary)] text-sm mt-0.5">
                      {typeIcons[n.type] || <FaInfoCircle />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[var(--text-main)] m-0 leading-tight">
                        {n.message}
                      </p>
                      <p className="text-[11px] text-[var(--text-light)] mt-0.5 m-0">
                        {n.createdAt}
                      </p>
                    </div>

                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
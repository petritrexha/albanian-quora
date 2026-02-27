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
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg
                   text-slate-600 dark:text-slate-300
                   hover:bg-slate-100 dark:hover:bg-slate-800
                   transition-all duration-200"
        title="Njoftimet"
      >
        <FaBell
          className={`text-lg transition-transform duration-300 ${
            unreadCount > 0 ? "animate-bounce-soft" : ""
          }`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px]
                           font-bold w-5 h-5 rounded-full flex items-center justify-center
                           animate-pulse">
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

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-3 w-80
                       bg-white dark:bg-slate-900
                       border border-slate-200 dark:border-slate-800
                       rounded-2xl shadow-2xl z-50
                       overflow-hidden
                       animate-dropdownIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                Njoftimet
              </h3>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Shëno të gjitha
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[280px] overflow-y-auto">

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  Nuk ka njoftime.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b
                      border-slate-100 dark:border-slate-800
                      transition-colors duration-200
                      ${
                        n.isRead
                          ? "bg-white dark:bg-slate-900"
                          : "bg-blue-50 dark:bg-slate-800/60"
                      }
                      hover:bg-slate-50 dark:hover:bg-slate-800`}
                  >
                    <div className="text-blue-600 mt-1 text-sm">
                      {typeIcons[n.type] || <FaInfoCircle />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-tight">
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {n.createdAt}
                      </p>
                    </div>

                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
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
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
    bookmark: <FaBookmark className="text-primary text-sm" />,
    report: <FaFlag className="text-red-500 text-sm" />,
    info: <FaInfoCircle className="text-blue-400 text-sm" />,
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
                className="relative p-2 rounded-lg text-text-light hover:text-primary hover:bg-accent transition-all duration-200"
                title="Njoftimet"
            >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h3 className="font-semibold text-text-main text-sm">
                                Njoftimet
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Shëno të gjitha
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-text-light text-sm">
                                    Nuk ka njoftime.
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-none transition-colors duration-150 ${n.isRead ? "bg-white" : "bg-blue-50"
                                            }`}
                                    >
                                        <div className="mt-0.5">
                                            {typeIcons[n.type] || typeIcons.info}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-text-main">{n.message}</p>
                                            <p className="text-xs text-text-light mt-0.5">
                                                {n.createdAt}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
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

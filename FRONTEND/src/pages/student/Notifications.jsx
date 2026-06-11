import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/notifications/my")
      .then(r => setNotifications(r.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/api/notifications/read/${id}`);
      setNotifications(p => p.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch { }
  };

  const markAllRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications(p => p.map(n => ({ ...n, isRead: true })));
      toast.success("All marked as read ✅");
    } catch { toast.error("Failed"); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return (
    <div className="flex justify-center mt-16">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold">Notifications</h2>
          {unreadCount > 0 && <p className="text-xs text-primary">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-ghost btn-sm text-xs">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-base-content/40">
          <span className="text-5xl mb-3">🔕</span>
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm mt-1">Your professor hasn't sent anything</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`bg-base-100 rounded-2xl p-4 shadow-sm transition-all active:scale-[0.98]
                ${!n.isRead ? "border-l-4 border-primary cursor-pointer" : "opacity-70"}`}
            >
              <div className="flex gap-3">
                <span className="text-2xl shrink-0 mt-0.5">
                  {n.type === "batch" ? "📢" : "👤"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold text-sm leading-snug ${!n.isRead ? "text-primary" : ""}`}>
                      {n.title}
                    </p>
                    <span className="text-xs text-base-content/40 shrink-0 mt-0.5">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-base-content/40">
                      {n.from?.name || "Professor"} · {n.type === "batch" ? `Batch ${n.batch}` : "Personal"}
                    </p>
                    {!n.isRead && <span className="badge badge-primary badge-xs">New</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;

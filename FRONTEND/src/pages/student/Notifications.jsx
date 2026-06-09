import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch { console.log("mark read failed"); }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All marked as read ✅");
    } catch { toast.error("Failed"); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2 pb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">🔔 Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-primary">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔕</div>
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`bg-base-100 rounded-xl p-4 shadow cursor-pointer transition-all
                ${!n.isRead ? "border-l-4 border-primary" : "opacity-75"}`}
            >
              <div className="flex gap-3 items-start">
                <div className="text-2xl shrink-0">
                  {n.type === "batch" ? "📢" : "👤"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold truncate ${!n.isRead ? "text-primary" : ""}`}>
                      {n.title}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      From: {n.from?.name || "Professor"} •{" "}
                      {n.type === "batch" ? `Batch ${n.batch}` : "Personal"}
                    </p>
                    {!n.isRead && (
                      <span className="badge badge-primary badge-xs">New</span>
                    )}
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

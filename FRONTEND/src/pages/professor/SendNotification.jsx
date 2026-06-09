import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

function SendNotification() {
  const [type, setType] = useState("batch");
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", batch: "", toStudent: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load batches and all students
    api.get("/professor/batches").then(r => setBatches(r.data)).catch(console.log);
    api.get("/professor/students").then(r => setStudents(r.data)).catch(console.log);
    api.get("/notifications/sent").then(r => setSent(r.data)).catch(console.log);
  }, []);

  const handleSend = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.message.trim()) return toast.error("Message is required");
    if (type === "batch" && !form.batch) return toast.error("Select a batch");
    if (type === "personal" && !form.toStudent) return toast.error("Select a student");

    try {
      setLoading(true);
      const payload = { title: form.title, message: form.message, type };
      if (type === "batch") payload.batch = form.batch;
      else payload.toStudent = form.toStudent;

      await api.post("/notifications/send", payload);
      toast.success("Notification sent ✅");
      setForm({ title: "", message: "", batch: "", toStudent: "" });
      // Refresh sent list
      const r = await api.get("/notifications/sent");
      setSent(r.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setSent(sent.filter(n => n._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto px-2 pb-8">
      <h2 className="text-2xl font-bold mb-6">🔔 Send Notification</h2>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setType("batch")}
          className={`btn btn-sm flex-1 ${type === "batch" ? "btn-primary" : "btn-outline"}`}
        >
          📢 Entire Batch
        </button>
        <button
          onClick={() => setType("personal")}
          className={`btn btn-sm flex-1 ${type === "personal" ? "btn-primary" : "btn-outline"}`}
        >
          👤 Specific Student
        </button>
      </div>

      {/* Target selector */}
      {type === "batch" ? (
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select Batch</label>
          <select
            className="select select-bordered w-full"
            value={form.batch}
            onChange={e => setForm({ ...form, batch: e.target.value })}
          >
            <option value="" disabled>Choose batch...</option>
            {batches.map(b => <option key={b} value={b}>Batch {b}</option>)}
          </select>
        </div>
      ) : (
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select Student</label>
          <select
            className="select select-bordered w-full"
            value={form.toStudent}
            onChange={e => setForm({ ...form, toStudent: e.target.value })}
          >
            <option value="" disabled>Choose student...</option>
            {students.map(({ student }) => (
              <option key={student._id} value={student._id}>
                {student.name} — Batch {student.batch}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Title</label>
        <input
          className="input input-bordered w-full"
          placeholder="e.g. Assignment Due Tomorrow"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* Message */}
      <div className="mb-5">
        <label className="text-sm font-medium mb-1 block">Message</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="Write your message here..."
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button onClick={handleSend} className="btn btn-primary w-full" disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : "Send Notification 🔔"}
      </button>

      {/* Sent history */}
      {sent.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-3">Sent Notifications</h3>
          <div className="space-y-3">
            {sent.map(n => (
              <div key={n._id} className="bg-base-100 shadow rounded-xl p-4 flex gap-3">
                <div className="text-2xl">{n.type === "batch" ? "📢" : "👤"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold truncate">{n.title}</p>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs mt-1 text-primary">
                    {n.type === "batch" ? `📢 Batch ${n.batch}` : `👤 ${n.toStudent?.name || "Student"}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="btn btn-ghost btn-xs text-error self-start"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SendNotification;

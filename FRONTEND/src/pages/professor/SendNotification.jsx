import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function SendNotification() {
  const [type, setType] = useState("batch");
  const [batches, setBatches] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [form, setForm] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [batchRes, studentRes, sentRes] = await Promise.all([
          api.get("/api/professor/batches"),
          api.get("/api/professor/students"),
          api.get("/api/notifications/sent"),
        ]);
        setBatches(batchRes.data || []);
        setAllStudents(studentRes.data || []);
        setSent(sentRes.data || []);
      } catch (err) {
        toast.error("Failed to load data");
        console.log(err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // When batch selected in personal mode, filter students
  useEffect(() => {
    if (!selectedBatch) {
      setFilteredStudents([]);
      setSelectedStudent("");
      return;
    }
    const filtered = allStudents.filter(({ student }) => student.batch === selectedBatch);
    setFilteredStudents(filtered);
    setSelectedStudent(""); // reset student when batch changes
  }, [selectedBatch, allStudents]);

  // Reset selections when switching type
  const handleTypeSwitch = (newType) => {
    setType(newType);
    setSelectedBatch("");
    setSelectedStudent("");
    setFilteredStudents([]);
  };

  const handleSend = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.message.trim()) return toast.error("Message is required");
    if (type === "batch" && !selectedBatch) return toast.error("Select a batch");
    if (type === "personal" && !selectedStudent) return toast.error("Select a student");

    try {
      setLoading(true);
      const payload = {
        title: form.title,
        message: form.message,
        type,
        ...(type === "batch" ? { batch: selectedBatch } : { toStudent: selectedStudent }),
      };

      await api.post("/api/notifications/send", payload);
      toast.success("Notification sent ✅");
      setForm({ title: "", message: "" });
      setSelectedBatch("");
      setSelectedStudent("");

      const r = await api.get("/api/notifications/sent");
      setSent(r.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
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

  if (loadingData) {
    return <div className="flex justify-center mt-10"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-2 pb-8">
      <h2 className="text-2xl font-bold mb-6">🔔 Send Notification</h2>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => handleTypeSwitch("batch")}
          className={`btn btn-sm flex-1 ${type === "batch" ? "btn-primary" : "btn-outline"}`}
        >
          📢 Entire Batch
        </button>
        <button
          onClick={() => handleTypeSwitch("personal")}
          className={`btn btn-sm flex-1 ${type === "personal" ? "btn-primary" : "btn-outline"}`}
        >
          👤 Personal
        </button>
      </div>

      {/* BATCH MODE */}
      {type === "batch" && (
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select Batch</label>
          {batches.length === 0 ? (
            <p className="text-gray-400 text-sm">No batches found. Students need to register first.</p>
          ) : (
            <select
              className="select select-bordered w-full"
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
            >
              <option value="" disabled>Choose batch...</option>
              {batches.map(b => (
                <option key={b} value={b}>Batch {b}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* PERSONAL MODE — Step 1: batch, Step 2: student */}
      {type === "personal" && (
        <>
          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">
              Step 1 — Select Batch
            </label>
            {batches.length === 0 ? (
              <p className="text-gray-400 text-sm">No batches found.</p>
            ) : (
              <select
                className="select select-bordered w-full"
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
              >
                <option value="" disabled>Choose batch first...</option>
                {batches.map(b => (
                  <option key={b} value={b}>Batch {b}</option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">
              Step 2 — Select Student
              {!selectedBatch && <span className="text-gray-400 font-normal"> (select batch first)</span>}
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              disabled={!selectedBatch}
            >
              <option value="" disabled>
                {!selectedBatch ? "Select batch first..." : filteredStudents.length === 0 ? "No students in this batch" : "Choose student..."}
              </option>
              {filteredStudents.map(({ student }) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </>
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
                <div className="text-2xl shrink-0">{n.type === "batch" ? "📢" : "👤"}</div>
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
                  className="btn btn-ghost btn-xs text-error self-start shrink-0"
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

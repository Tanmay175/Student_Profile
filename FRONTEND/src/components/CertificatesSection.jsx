import { useState, useEffect, useCallback } from "react";
import {
  getCertificates,
  uploadCertificate,
  updateCertificate,
  deleteCertificate,
} from "../services/certificateService";

const MAX = 5;

const CATEGORIES = [
  "Internship","Course","Workshop","Hackathon",
  "Research","Achievement","Sports","Cultural","Other",
];

const BADGE_COLORS = {
  Internship:  "badge-primary",
  Course:      "badge-info",
  Workshop:    "badge-warning",
  Hackathon:   "badge-error",
  Research:    "badge-secondary",
  Achievement: "badge-accent",
  Sports:      "badge-success",
  Cultural:    "badge-neutral",
  Other:       "badge-ghost",
};

// Convert share link to embed link
const toEmbed = (link) => {
  const match = link && link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match
    ? `https://drive.google.com/file/d/${match[1]}/preview`
    : link;
};

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function CertModal({ cert, onClose, onDone }) {
  const isEdit = !!cert;
  const [title, setTitle]         = useState(cert?.title || "");
  const [category, setCategory]   = useState(cert?.category || "");
  const [driveLink, setDriveLink] = useState(cert?.driveLink || "");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const submit = async () => {
    if (!title.trim())     { setError("Title is required."); return; }
    if (!category)         { setError("Category is required."); return; }
    if (!driveLink.trim()) { setError("Google Drive link is required."); return; }
    if (!driveLink.includes("drive.google.com")) {
      setError("Please paste a valid Google Drive link."); return;
    }
    setLoading(true); setError("");
    try {
      const payload = { title: title.trim(), category, driveLink: driveLink.trim() };
      const result = isEdit
        ? await updateCertificate(cert._id, payload)
        : await uploadCertificate(payload);
      onDone(result);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {isEdit ? "Edit Certificate" : "Add Certificate"}
        </h3>

        {error && <div className="alert alert-error mb-3 text-sm py-2">{error}</div>}

        <div className="form-control mb-3">
          <label className="label"><span className="label-text">Certificate Title *</span></label>
          <input
            type="text" maxLength={150} value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AWS Cloud Practitioner"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mb-3">
          <label className="label"><span className="label-text">Category *</span></label>
          <select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-control mb-2">
          <label className="label"><span className="label-text">Google Drive Link *</span></label>
          <input
            type="url" value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="input input-bordered w-full"
          />
        </div>
        <p className="text-xs opacity-50 mb-4">
          In Google Drive: right-click the PDF → Share → Anyone with the link → Copy link
        </p>

        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading
              ? <span className="loading loading-spinner loading-sm" />
              : isEdit ? "Save" : "Add Certificate"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop"><button onClick={onClose} /></form>
    </dialog>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ cert, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const confirm = async () => {
    setLoading(true); setError("");
    try {
      await deleteCertificate(cert._id);
      onDone(cert._id);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Delete failed.");
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Delete Certificate</h3>
        <p className="text-sm opacity-70 mb-1">Are you sure you want to delete:</p>
        <p className="font-semibold mb-4">"{cert.title}"</p>
        {error && <div className="alert alert-error mb-3 text-sm py-2">{error}</div>}
        <p className="text-xs text-error mb-4">This cannot be undone.</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-error" onClick={confirm} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Delete"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop"><button onClick={onClose} /></form>
    </dialog>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ cert, onClose }) {
  const embedUrl = toEmbed(cert.driveLink);

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-4xl w-full h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-base-300 shrink-0">
          <div>
            <span className={`badge badge-sm ${BADGE_COLORS[cert.category] || "badge-ghost"} mr-2`}>
              {cert.category}
            </span>
            <span className="font-semibold text-sm">{cert.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={cert.driveLink} target="_blank" rel="noreferrer" className="btn btn-ghost btn-xs">
              Open in Drive ↗
            </a>
            <button className="btn btn-ghost btn-xs" onClick={onClose}>✕</button>
          </div>
        </div>
        <iframe
          src={embedUrl}
          title={cert.title}
          className="flex-1 w-full border-0"
          allow="autoplay"
        />
      </div>
      <form method="dialog" className="modal-backdrop"><button onClick={onClose} /></form>
    </dialog>
  );
}

// ── Main CertificatesSection ──────────────────────────────────────────────────
function CertificatesSection({ studentId, isOwner }) {
  const [certs, setCerts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCert, setEdit]   = useState(null);
  const [delCert, setDel]     = useState(null);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const data = await getCertificates(studentId);
      setCerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  const onAdded   = (cert) => setCerts((p) => [cert, ...p]);
  const onUpdated = (cert) => setCerts((p) => p.map((c) => (c._id === cert._id ? cert : c)));
  const onDeleted = (id)   => setCerts((p) => p.filter((c) => c._id !== id));

  return (
    <div className="mt-8 bg-base-100 shadow p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">
          Certificates
          <span className="text-sm font-normal opacity-60 ml-2">({certs.length}/{MAX})</span>
        </h3>
        {isOwner && certs.length < MAX && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            + Add Certificate
          </button>
        )}
        {isOwner && certs.length >= MAX && (
          <span className="badge badge-warning">Max {MAX} reached</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}

      {/* Empty state */}
      {!loading && certs.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 border-2 border-dashed rounded-xl opacity-60">
          <span className="text-4xl">📜</span>
          <p className="font-semibold">No certificates yet</p>
          {isOwner && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              Add your first certificate
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && certs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <div
              key={cert._id}
              className="card bg-base-200 shadow hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <button
                onClick={() => setPreview(cert)}
                className="flex items-center justify-center h-36 bg-base-300 rounded-t-2xl hover:bg-base-200 transition-colors cursor-pointer w-full"
              >
                <span className="text-5xl opacity-30">📄</span>
              </button>

              <div className="card-body p-4 gap-2">
                <span className={`badge badge-sm self-start ${BADGE_COLORS[cert.category] || "badge-ghost"}`}>
                  {cert.category}
                </span>
                <p className="font-semibold text-sm line-clamp-2">{cert.title}</p>

                {isOwner && (
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setEdit(cert)} className="btn btn-ghost btn-xs flex-1">
                      Edit
                    </button>
                    <button onClick={() => setDel(cert)} className="btn btn-ghost btn-xs flex-1 text-error">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd  && <CertModal onClose={() => setShowAdd(false)} onDone={onAdded} />}
      {editCert && <CertModal cert={editCert} onClose={() => setEdit(null)} onDone={onUpdated} />}
      {delCert  && <DeleteModal cert={delCert} onClose={() => setDel(null)} onDone={onDeleted} />}
      {preview  && <PreviewModal cert={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

export default CertificatesSection;
import Certificate from "../models/Certificate.js";

const MAX_CERTS = 5;

const err = (res, status, message) =>
  res.status(status).json({ success: false, message });

// Convert any Google Drive share link to a direct embeddable preview link
// e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//   -> https://drive.google.com/file/d/FILE_ID/preview
const toEmbedLink = (link) => {
  try {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return link;
  } catch {
    return link;
  }
};

// GET /api/certificates/count/:studentId  ✅ NEW — used by leaderboard
export const getCertificateCount = async (req, res) => {
  try {
    const { studentId } = req.params;
    const count = await Certificate.countByStudent(studentId);
    res.json({ success: true, count });
  } catch (e) {
    console.error("getCertificateCount:", e);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// GET /api/certificates/:studentId
export const getCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;
    const isOwner = req.user._id.toString() === studentId;
    const isPrivileged = req.user.role === "professor";
    if (!isOwner && !isPrivileged) return err(res, 403, "Access denied.");

    const certs = await Certificate.find({ student: studentId }).sort({ createdAt: -1 });
    res.json({ success: true, data: certs });
  } catch (e) {
    console.error("getCertificates:", e);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/certificates
export const uploadCertificate = async (req, res) => {
  try {
    const { title, category, driveLink } = req.body;

    if (!title?.trim()) return err(res, 400, "Certificate title is required.");
    if (!category)      return err(res, 400, "Category is required.");
    if (!driveLink?.trim()) return err(res, 400, "Google Drive link is required.");

    const studentId = req.user._id;
    const count = await Certificate.countByStudent(studentId);
    if (count >= MAX_CERTS) {
      return err(res, 400, `Maximum ${MAX_CERTS} certificates allowed.`);
    }

    const cert = await Certificate.create({
      student: studentId,
      title: title.trim(),
      category,
      driveLink: driveLink.trim(),
    });

    res.status(201).json({ success: true, data: cert });
  } catch (e) {
    console.error("uploadCertificate:", e);
    if (e.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(e.errors)[0].message });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/certificates/:id
export const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return err(res, 404, "Certificate not found.");

    const isOwner = cert.student.toString() === req.user._id.toString();
    if (!isOwner) return err(res, 403, "Access denied.");

    const { title, category, driveLink } = req.body;
    if (title !== undefined) {
      if (!title.trim()) return err(res, 400, "Title cannot be empty.");
      cert.title = title.trim();
    }
    if (category !== undefined) cert.category = category;
    if (driveLink !== undefined) {
      if (!driveLink.trim()) return err(res, 400, "Drive link cannot be empty.");
      cert.driveLink = driveLink.trim();
    }

    await cert.save();
    res.json({ success: true, data: cert });
  } catch (e) {
    console.error("updateCertificate:", e);
    if (e.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(e.errors)[0].message });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/certificates/:id
export const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return err(res, 404, "Certificate not found.");

    const isOwner = cert.student.toString() === req.user._id.toString();
    if (!isOwner) return err(res, 403, "Access denied.");

    await cert.deleteOne();
    res.json({ success: true, message: "Certificate deleted." });
  } catch (e) {
    console.error("deleteCertificate:", e);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export { toEmbedLink };
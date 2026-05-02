import api from "./api";

export const getCertificates = async (studentId) => {
  const res = await api.get(`/api/certificates/${studentId}`);
  return res.data.data;
};

// POST body: { title, category, driveLink }
export const uploadCertificate = async (payload) => {
  const res = await api.post("/api/certificates", payload);
  return res.data.data;
};

export const updateCertificate = async (id, payload) => {
  const res = await api.put(`/api/certificates/${id}`, payload);
  return res.data.data;
};

export const deleteCertificate = async (id) => {
  const res = await api.delete(`/api/certificates/${id}`);
  return res.data;
};
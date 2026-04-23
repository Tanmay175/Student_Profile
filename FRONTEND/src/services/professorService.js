import api from "./api";

export const getBatches = async () => {
  const res = await api.get("/api/professor/batches");
  return res.data;
};

export const getStudentsByBatch = async (year) => {
  const res = await api.get(`/api/professor/batch/${year}`);
  return res.data;
};

export const getStudentDetails = async (id) => {
  const res = await api.get(`/api/professor/student/${id}`);
  return res.data;
};

export const getAllStudents = async () => {
  const res = await api.get("/api/professor/students");
  return res.data;
};

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
  const token = localStorage.getItem("token");
    console.log("TOKEN:", token); // 👈 debug
  const res = await axios.get(
    "http://localhost:5000/api/professor/students",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
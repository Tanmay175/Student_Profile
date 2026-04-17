import api from "./api";

// GET PROFILE
export const getProfile = async () => {
  const res = await api.get("/api/student/profile");
  return res.data;
};

// CREATE PROFILE
export const createProfile = async (formData) => {
  const res = await api.post("/api/student/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// UPDATE PROFILE
export const updateProfile = async (formData) => {
  const res = await api.put("/api/student/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
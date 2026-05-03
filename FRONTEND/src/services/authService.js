import api from "./api";

export const loginUser = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

// ✅ NEW: Change Password
export const changePassword = async (data) => {
  const res = await api.put("/api/auth/change-password", data);
  return res.data;
};
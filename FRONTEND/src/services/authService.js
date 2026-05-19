import api from "./api";

export const loginUser = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.put("/api/auth/change-password", data);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/api/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await api.post("/api/auth/reset-password", data);
  return res.data;
};
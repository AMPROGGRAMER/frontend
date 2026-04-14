import api from "./api.js";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("sl_token", data.token);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  localStorage.setItem("sl_token", data.token);
  return data;
};

export const me = async () => {
  const token = localStorage.getItem("sl_token");
  if (!token) return null;
  const { data } = await api.get("/auth/me");
  return data;
};


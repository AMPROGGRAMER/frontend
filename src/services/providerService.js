import api from "./api.js";

export const fetchProviders = async (params = {}) => {
  const { data } = await api.get("/providers", { params });
  return data;
};

export const fetchProvidersByCategory = async (category, params = {}) => {
  const { data } = await api.get(`/providers/category/${encodeURIComponent(category)}`, { params });
  return data;
};

export const fetchProviderById = async (id) => {
  const { data } = await api.get(`/providers/${id}`);
  return data;
};

export const updateMyProviderProfile = async (payload) => {
  const { data } = await api.post("/providers", payload);
  return data;
};


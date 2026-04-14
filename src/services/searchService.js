import api from "./api.js";

export const searchProvidersApi = async (params = {}) => {
  const { data } = await api.get("/search/providers", { params });
  return data;
};


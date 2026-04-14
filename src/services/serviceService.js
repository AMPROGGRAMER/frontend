import api from "./api.js";

export const getPublicServices = async (params = {}) => {
  const { data } = await api.get("/services", { 
    params: { ...params, _t: Date.now() } 
  });
  return data;
};

export const getProviderServices = async () => {
  const { data } = await api.get("/services/my", { params: { _t: Date.now() } });
  return data;
};

export const createService = async (payload) => {
  const { data } = await api.post("/services", payload);
  return data;
};

export const updateService = async (id, payload) => {
  const { data } = await api.patch(`/services/${id}`, payload);
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};

export const getServicesByProvider = async (providerId) => {
  const { data } = await api.get("/services", { 
    params: { providerId, _t: Date.now() } 
  });
  return data;
};

export const deleteServiceAdmin = async (id) => {
  const { data } = await api.delete(`/services/admin/${id}`);
  return data;
};

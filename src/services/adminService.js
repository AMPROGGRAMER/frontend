import api from "./api.js";

export const fetchAdminSummary = async () => {
  const { data } = await api.get("/admin/summary");
  return data;
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const fetchAdminProviders = async () => {
  const { data } = await api.get("/admin/providers");
  return data;
};

export const deleteAdminUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const approveAdminProvider = async (id) => {
  const { data } = await api.patch(`/admin/providers/${id}/approve`);
  return data;
};

export const deleteAdminProvider = async (id) => {
  const { data } = await api.delete(`/admin/providers/${id}`);
  return data;
};

export const fetchAdminBookings = async () => {
  const { data } = await api.get("/admin/bookings");
  return data;
};

export const fetchAnalytics = async () => {
  const { data } = await api.get("/admin/analytics");
  return data;
};


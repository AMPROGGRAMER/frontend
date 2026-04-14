import api from "./api.js";

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

export const fetchMyBookings = async () => {
  const { data } = await api.get("/bookings/my");
  return data;
};

export const fetchProviderBookings = async () => {
  const { data } = await api.get("/bookings/provider");
  return data;
};

export const updateBookingStatusApi = async (id, status) => {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data;
};

export const payBookingWithWallet = async (bookingId) => {
  const { data } = await api.post(`/bookings/${bookingId}/pay/wallet`);
  return data;
};


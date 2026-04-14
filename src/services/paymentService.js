import api from "./api.js";

export const createRazorpayOrder = async (bookingId) => {
  const { data } = await api.post("/payments/razorpay/order", { bookingId });
  return data;
};

export const verifyRazorpayPayment = async (payload) => {
  const { data } = await api.post("/payments/razorpay/verify", payload);
  return data;
};


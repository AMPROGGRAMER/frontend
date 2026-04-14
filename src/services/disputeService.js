import api from "./api.js";

// Get my disputes (user sees their own, admin sees all)
export const getMyDisputes = async () => {
  const { data } = await api.get("/disputes/my");
  return data;
};

// Create a dispute for a booking
export const createDispute = async (payload) => {
  const { data } = await api.post("/disputes", payload);
  return data;
};

// Admin: Resolve a dispute
export const resolveDisputeAdmin = async (disputeId) => {
  const { data } = await api.patch(`/disputes/${disputeId}/resolve`);
  return data;
};

import api from "./api.js";

export const updateMyProfile = async (payload) => {
  const { data } = await api.patch("/users/me", payload);
  return data;
};

export const getMyFavorites = async () => {
  const { data } = await api.get("/users/favorites");
  return data;
};

export const toggleFavoriteProvider = async (providerId) => {
  const { data } = await api.post(`/users/favorites/${providerId}/toggle`);
  return data;
};

export const getMyWallet = async () => {
  const { data } = await api.get("/users/wallet");
  return data;
};

export const addWalletFunds = async (amount) => {
  const { data } = await api.post("/users/wallet/add", { amount });
  return data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post("/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

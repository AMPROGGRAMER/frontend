import api from "./api.js";

export const getMyThreads = async () => {
  const { data } = await api.get("/chat/threads");
  return data;
};

export const getOrCreateThread = async (otherUserId) => {
  const { data } = await api.post(`/chat/thread/${otherUserId}`);
  return data;
};

export const getThreadMessages = async (chatId) => {
  const { data } = await api.get(`/chat/thread/${chatId}/messages`);
  return data;
};

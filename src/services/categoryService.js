import api from "./api.js";

export const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};


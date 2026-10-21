import api from "../api/api";

export const getCurrentUser = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

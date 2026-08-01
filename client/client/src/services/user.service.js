import api from "../api/axios";

// Retorna os dados do usuário atual (agora exportando como getUserProfile e getMe)
export const getUserProfile = async () => {
  const response = await api.get("/users/me");
  return response.data.user;
};

export const getMe = getUserProfile;

export const updateUserSettings = async (data) => {
  const response = await api.put("/users/settings", data);
  return response.data.user;
};

export const recordStudySession = async () => {
  const response = await api.post("/users/study-session");
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await api.get('/users/dashboard');
  return response.data;
};